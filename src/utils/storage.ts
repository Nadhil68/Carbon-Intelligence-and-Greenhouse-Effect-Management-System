import {
  User,
  EmissionRecord,
  InstitutionalPerson,
  MitigationPlan,
  SimulatedEmail,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EMISSION_RECORDS,
  INITIAL_INSTITUTIONAL_PEOPLE,
  INITIAL_MITIGATION_PLANS,
  INITIAL_SIMULATED_EMAILS,
} from './initialData';

const STORAGE_KEYS = {
  USERS: 'carbon_sys_users_v5', // Prof. Ananthi & Prof. A. Selvanayagi set strictly as Class Advisors (not operators)
  RECORDS: 'carbon_sys_records_proof_v5', // Includes operator logs with Photo/PDF proofs & approval status
  PEOPLE: 'carbon_sys_people_v2',
  PLANS: 'carbon_sys_plans_v1',
  EMAILS: 'carbon_sys_emails_v2',
  CURRENT_USER_ID: 'carbon_sys_current_user_v2',
  RESET_TOKENS: 'carbon_sys_reset_tokens_v1',
};

const ACTIVE_STORAGE_KEYS = new Set(Object.values(STORAGE_KEYS));
const memoryFallbackStore: Record<string, unknown> = {};
const inMemoryProofUrlCache: Record<string, string> = {};

const DEFAULT_PHOTO_PROOF_URL =
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
const DEFAULT_PDF_PROOF_URL =
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80';

// Maximum length for a single proofUrl stored in localStorage (~45KB)
const MAX_STORED_PROOF_URL_LENGTH = 45000;

function purgeLegacyStorageKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('carbon_sys_') && !ACTIVE_STORAGE_KEYS.has(k)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // Ignore removal errors
      }
    });
  } catch {
    // Ignore storage enumeration errors
  }
}

function compactRecordsForStorage(
  records: EmissionRecord[],
  stripAllDataUrls = false
): EmissionRecord[] {
  return records.map((rec) => {
    const url = rec.proofUrl;
    if (!url) return rec;

    const isDataUrl = url.startsWith('data:');
    const isTooLarge = url.length > MAX_STORED_PROOF_URL_LENGTH;

    if ((stripAllDataUrls && isDataUrl) || isTooLarge) {
      inMemoryProofUrlCache[rec.id] = url;
      return {
        ...rec,
        proofUrl:
          rec.proofType === 'pdf' ? DEFAULT_PDF_PROOF_URL : DEFAULT_PHOTO_PROOF_URL,
      };
    }
    return rec;
  });
}

function hydrateRecordsFromCache(records: EmissionRecord[]): EmissionRecord[] {
  return records.map((rec) => {
    const cachedUrl = inMemoryProofUrlCache[rec.id];
    if (cachedUrl) {
      return { ...rec, proofUrl: cachedUrl };
    }
    return rec;
  });
}

// Run initial cleanup of obsolete version keys on module load
purgeLegacyStorageKeys();

// Safe localStorage helper
function getStoredJson<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  if (key in memoryFallbackStore) {
    return memoryFallbackStore[key] as T;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  memoryFallbackStore[key] = value;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError or storage restriction: free space & retry with compacted payload
    purgeLegacyStorageKeys();
    try {
      localStorage.removeItem(STORAGE_KEYS.RESET_TOKENS);
      localStorage.removeItem(STORAGE_KEYS.EMAILS);
    } catch {
      // Ignore cleanup errors
    }

    try {
      if (key === STORAGE_KEYS.RECORDS && Array.isArray(value)) {
        const compacted = compactRecordsForStorage(
          value as unknown as EmissionRecord[],
          true
        );
        localStorage.setItem(key, JSON.stringify(compacted));
      } else {
        // Also compact existing stored records if another key failed due to full storage
        const rawRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
        if (rawRecords) {
          const parsed = JSON.parse(rawRecords) as EmissionRecord[];
          if (Array.isArray(parsed)) {
            const compacted = compactRecordsForStorage(parsed, true);
            localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(compacted));
          }
        }
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Keep value in memoryFallbackStore so the session continues seamlessly without console.error
    }
  }
}

export const StorageService = {
  getUsers(): User[] {
    const users = getStoredJson<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Explicitly purge any legacy records of Sundaram or Radhakrishnan and enforce Ananthi & Selvanayagi as Class Advisors (viewer, not operator)
    const filtered = users
      .filter((u) => {
        const text = `${u.name} ${u.email} ${u.id}`.toLowerCase();
        return !text.includes('sundaram') && !text.includes('radhakrishnan');
      })
      .map((u) => {
        const lowerName = u.name.toLowerCase();
        const lowerEmail = u.email.toLowerCase();
        if (
          lowerName.includes('ananthi') ||
          lowerEmail.includes('ananthi') ||
          lowerName.includes('selvanayagi') ||
          lowerEmail.includes('selvanayagi')
        ) {
          return {
            ...u,
            role: 'viewer' as const,
            designation: 'Class Advisors' as const,
          };
        }
        return u;
      });

    // Ensure primary executive accounts, HODs, and operators are always available
    const requiredBootstrapEmails = [
      'principle@mkce.ac.in',
      'principal@mkce.ac.in',
      'manager@mkce.ac.in',
      'dean@mkce.ac.in',
      'logavel@mkce.ac.in',
      'hod-cse@mkce.ac.in',
      'hod-ece@mkce.ac.in',
      'hod-eee@mkce.ac.in',
      'hod-mech@mkce.ac.in',
      'hod-civil@mkce.ac.in',
      'hod-it@mkce.ac.in',
      'hod-aids@mkce.ac.in',
      'hod-aiml@mkce.ac.in',
      'hod-fe@mkce.ac.in',
      'operator@mkce.ac.in',
      'nadhilnadhil68@gamil.com',
      'pradeepravi076@gmail.com',
      'santhoshmeswaran@gmail.com',
      'ssctnpscacio27@gmail.com',
      '21CS001@mkce.ac.in',
      'kaviarasu@mkce.ac.in',
      'ananthi@mkce.ac.in',
      'selvanayagi@mkce.ac.in',
      'priya.chem@campus.edu',
      'karthik.op@mkce.ac.in',
    ];

    requiredBootstrapEmails.forEach((email) => {
      const exists = filtered.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        const seed = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (seed) filtered.push(seed);
      }
    });

    return filtered;
  },

  saveUsers(users: User[]): void {
    setStoredJson(STORAGE_KEYS.USERS, users);
  },

  getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return 'usr-admin-01';
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-admin-01';
    } catch {
      return 'usr-admin-01';
    }
  },

  setCurrentUserId(id: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch {
      // Ignore storage quota errors
    }
  },

  getRecords(): EmissionRecord[] {
    if (typeof window !== 'undefined') {
      purgeLegacyStorageKeys();
    }
    const stored = getStoredJson<EmissionRecord[]>(
      STORAGE_KEYS.RECORDS,
      INITIAL_EMISSION_RECORDS
    );
    return hydrateRecordsFromCache(stored);
  },

  saveRecords(records: EmissionRecord[]): void {
    memoryFallbackStore[STORAGE_KEYS.RECORDS] = records;
    const compacted = compactRecordsForStorage(records, false);
    setStoredJson(STORAGE_KEYS.RECORDS, compacted);
    memoryFallbackStore[STORAGE_KEYS.RECORDS] = records;
  },

  clearAllRecords(): void {
    if (typeof window === 'undefined') return;
    memoryFallbackStore[STORAGE_KEYS.RECORDS] = [];
    purgeLegacyStorageKeys();
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify([]));
    } catch {
      // Ignore quota errors
    }
  },

  getPeople(): InstitutionalPerson[] {
    const people = getStoredJson<InstitutionalPerson[]>(STORAGE_KEYS.PEOPLE, INITIAL_INSTITUTIONAL_PEOPLE);
    const filtered = people.filter((p) => {
      const text = `${p.name} ${p.email} ${p.id}`.toLowerCase();
      return !text.includes('sundaram') && !text.includes('radhakrishnan');
    });
    return filtered;
  },

  savePeople(people: InstitutionalPerson[]): void {
    setStoredJson(STORAGE_KEYS.PEOPLE, people);
  },

  getPlans(): MitigationPlan[] {
    return getStoredJson<MitigationPlan[]>(STORAGE_KEYS.PLANS, INITIAL_MITIGATION_PLANS);
  },

  savePlans(plans: MitigationPlan[]): void {
    setStoredJson(STORAGE_KEYS.PLANS, plans);
  },

  getEmails(): SimulatedEmail[] {
    const emails = getStoredJson<SimulatedEmail[]>(STORAGE_KEYS.EMAILS, INITIAL_SIMULATED_EMAILS);
    const filtered = emails.filter((e) => {
      const text = `${e.toName} ${e.toEmail} ${e.id} ${e.subject}`.toLowerCase();
      return !text.includes('sundaram') && !text.includes('radhakrishnan');
    });
    return filtered;
  },

  saveEmails(emails: SimulatedEmail[]): void {
    setStoredJson(STORAGE_KEYS.EMAILS, emails);
  },

  getResetTokens(): Record<string, { email: string; expiresAt: number; token: string }> {
    return getStoredJson(STORAGE_KEYS.RESET_TOKENS, {});
  },

  saveResetTokens(tokens: Record<string, { email: string; expiresAt: number; token: string }>): void {
    setStoredJson(STORAGE_KEYS.RESET_TOKENS, tokens);
  },

  resetToDefaultData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.PEOPLE);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.RESET_TOKENS);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr-admin-01');
    window.location.reload();
  },
};
