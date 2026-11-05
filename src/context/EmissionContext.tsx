import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  EmissionRecord,
  InstitutionalPerson,
  MitigationPlan,
  CampusDepartment,
  EmissionSourceCategory,
  EmissionScope,
  ProofAttachmentType,
} from '../types';
import { StorageService } from '../utils/storage';
import { calculateAggregateMetrics, EMISSION_FACTORS, AggregatedMetrics } from '../utils/calculations';
import { useAuth } from './AuthContext';

interface EmissionContextType {
  records: EmissionRecord[];
  institutionalPeople: InstitutionalPerson[];
  mitigationPlans: MitigationPlan[];
  selectedDepartment: CampusDepartment | 'All Departments';
  setSelectedDepartment: (dept: CampusDepartment | 'All Departments') => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  filteredRecords: EmissionRecord[];
  aggregateMetrics: AggregatedMetrics;
  pendingLogCount: number;
  addRecord: (data: {
    title: string;
    date: string;
    category: EmissionSourceCategory;
    department: CampusDepartment;
    facilityLocation: string;
    activityValue: number;
    notes?: string;
    proofType?: ProofAttachmentType;
    proofUrl?: string;
    proofFileName?: string;
    proofFileSize?: string;
    meterReadingNumber?: string;
  }) => { success: boolean; message: string; record?: EmissionRecord };
  updateRecord: (id: string, updates: Partial<EmissionRecord>) => boolean;
  approveRecord: (id: string, remarks?: string) => boolean;
  rejectRecord: (id: string, remarks: string) => boolean;
  deleteRecord: (id: string) => boolean;
  clearAllRecords: () => void;
  addPerson: (person: Omit<InstitutionalPerson, 'id'>) => boolean;
  updatePerson: (id: string, updates: Partial<InstitutionalPerson>) => boolean;
  deletePerson: (id: string) => boolean;
  updateMitigationPlan: (id: string, updates: Partial<MitigationPlan>) => boolean;
  exportAuditData: (format: 'csv' | 'json') => void;
  resetAllCampusData: () => void;
}

const EmissionContext = createContext<EmissionContextType | undefined>(undefined);

export const EmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<EmissionRecord[]>(() => StorageService.getRecords());
  const [institutionalPeople, setInstitutionalPeople] = useState<InstitutionalPerson[]>(() => StorageService.getPeople());
  const [mitigationPlans, setMitigationPlans] = useState<MitigationPlan[]>(() => StorageService.getPlans());
  const [selectedDepartment, setSelectedDepartment] = useState<CampusDepartment | 'All Departments'>('All Departments');
  const [selectedMonth, setSelectedMonth] = useState<string>('All Months');

  useEffect(() => {
    StorageService.saveRecords(records);
  }, [records]);

  useEffect(() => {
    StorageService.savePeople(institutionalPeople);
  }, [institutionalPeople]);

  useEffect(() => {
    StorageService.savePlans(mitigationPlans);
  }, [mitigationPlans]);

  const pendingLogCount = useMemo(() => {
    return records.filter((r) => (r.approvalStatus || 'pending') === 'pending').length;
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchDept = selectedDepartment === 'All Departments' || r.department === selectedDepartment;
      const matchMonth = selectedMonth === 'All Months' || r.month === selectedMonth;
      return matchDept && matchMonth;
    });
  }, [records, selectedDepartment, selectedMonth]);

  const aggregateMetrics = useMemo(() => {
    return calculateAggregateMetrics(filteredRecords, 4850);
  }, [filteredRecords]);

  const addRecord = (data: {
    title: string;
    date: string;
    category: EmissionSourceCategory;
    department: CampusDepartment;
    facilityLocation: string;
    activityValue: number;
    notes?: string;
    proofType?: ProofAttachmentType;
    proofUrl?: string;
    proofFileName?: string;
    proofFileSize?: string;
    meterReadingNumber?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Must be logged in to record emissions data.' };
    }

    const meta = EMISSION_FACTORS[data.category];
    const factor = meta ? meta.factor : 0.82;
    const unit = meta ? meta.unit : 'units';
    const scope: EmissionScope = meta ? meta.scope : 'Scope 2';

    // Total CO2e in kg
    const totalKg = Number((data.activityValue * factor).toFixed(2));
    const month = data.date.substring(0, 7); // e.g. "2026-03"

    const newRecord: EmissionRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      date: data.date,
      month,
      category: data.category,
      scope,
      department: data.department,
      facilityLocation: data.facilityLocation.trim(),
      activityValue: data.activityValue,
      unit,
      emissionFactor: factor,
      totalEmissionKgCO2e: totalKg,
      reportedBy: {
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        userEmail: currentUser.email,
      },
      verifiedByAdmin: false,
      approvalStatus: 'pending',
      proofType: data.proofType || 'photo',
      proofUrl:
        data.proofUrl ||
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      proofFileName: data.proofFileName || 'Meter_Reading_Proof.jpg',
      proofFileSize: data.proofFileSize || '1.15 MB',
      meterReadingNumber: data.meterReadingNumber?.trim() || `MTR-${Date.now().toString().slice(-5)}`,
      notes: data.notes?.trim() || '',
    };

    setRecords((prev) => [newRecord, ...prev]);
    return {
      success: true,
      message: 'Log entry with proof submitted! Sent to Administrator PRANITH SRIRAM G for approval.',
      record: newRecord,
    };
  };

  const updateRecord = (id: string, updates: Partial<EmissionRecord>) => {
    if (!currentUser || currentUser.role !== 'operator') return false;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        // Recalculate emission if activity or category changed
        if (updates.activityValue !== undefined || updates.category !== undefined) {
          const cat = updated.category;
          const factor = EMISSION_FACTORS[cat]?.factor ?? 0.82;
          updated.emissionFactor = factor;
          updated.unit = EMISSION_FACTORS[cat]?.unit ?? 'units';
          updated.scope = EMISSION_FACTORS[cat]?.scope ?? 'Scope 2';
          updated.totalEmissionKgCO2e = Number((updated.activityValue * factor).toFixed(2));
        }
        return updated;
      })
    );
    return true;
  };

  const approveRecord = (id: string, remarks?: string) => {
    const reviewer = currentUser?.name || 'PRANITH SRIRAM G';
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              verifiedByAdmin: true,
              approvalStatus: 'approved',
              reviewedBy: reviewer,
              reviewedAt: nowStr,
              adminRemarks:
                remarks?.trim() ||
                'Attached Photo/PDF proof inspected and verified against campus meter registry. Approved.',
            }
          : r
      )
    );
    return true;
  };

  const rejectRecord = (id: string, remarks: string) => {
    const reviewer = currentUser?.name || 'PRANITH SRIRAM G';
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              verifiedByAdmin: false,
              approvalStatus: 'rejected',
              reviewedBy: reviewer,
              reviewedAt: nowStr,
              adminRemarks:
                remarks.trim() ||
                'Proof attachment unclear or mismatched with meter reading. Please re-upload clear Photo or PDF.',
            }
          : r
      )
    );
    return true;
  };

  const deleteRecord = (id: string) => {
    if (!currentUser || (currentUser.role !== 'operator' && currentUser.role !== 'admin')) return false;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const clearAllRecords = () => {
    StorageService.clearAllRecords();
    setRecords([]);
  };

  const addPerson = (person: Omit<InstitutionalPerson, 'id'>) => {
    const newPerson: InstitutionalPerson = {
      ...person,
      id: `inst-${Date.now()}`,
    };
    setInstitutionalPeople((prev) => [...prev, newPerson]);
    return true;
  };

  const updatePerson = (id: string, updates: Partial<InstitutionalPerson>) => {
    setInstitutionalPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    return true;
  };

  const deletePerson = (id: string) => {
    setInstitutionalPeople((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const updateMitigationPlan = (id: string, updates: Partial<MitigationPlan>) => {
    setMitigationPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    return true;
  };

  const exportAuditData = (format: 'csv' | 'json') => {
    const filename = `Campus_Carbon_Audit_Report_${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = [
        'Record ID',
        'Date',
        'Month',
        'Category',
        'Scope',
        'Department',
        'Facility',
        'Activity Value',
        'Unit',
        'Emission Factor',
        'Total kg CO2e',
        'Total tCO2e',
        'Reported By',
        'Approval Status',
        'Proof Type',
        'Proof File',
        'Reviewed By',
        'Notes',
      ];
      const rows = filteredRecords.map((r) => [
        r.id,
        r.date,
        r.month,
        r.category,
        r.scope,
        `"${r.department}"`,
        `"${r.facilityLocation}"`,
        r.activityValue,
        r.unit,
        r.emissionFactor,
        r.totalEmissionKgCO2e,
        (r.totalEmissionKgCO2e / 1000).toFixed(3),
        `"${r.reportedBy.userName} (${r.reportedBy.userRole})"`,
        r.approvalStatus || 'pending',
        r.proofType || 'photo',
        `"${r.proofFileName || ''}"`,
        `"${r.reviewedBy || ''}"`,
        `"${r.notes?.replace(/"/g, '""') || ''}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const resetAllCampusData = () => {
    StorageService.resetToDefaultData();
  };

  return (
    <EmissionContext.Provider
      value={{
        records,
        institutionalPeople,
        mitigationPlans,
        selectedDepartment,
        setSelectedDepartment,
        selectedMonth,
        setSelectedMonth,
        filteredRecords,
        aggregateMetrics,
        pendingLogCount,
        addRecord,
        updateRecord,
        approveRecord,
        rejectRecord,
        deleteRecord,
        clearAllRecords,
        addPerson,
        updatePerson,
        deletePerson,
        updateMitigationPlan,
        exportAuditData,
        resetAllCampusData,
      }}
    >
      {children}
    </EmissionContext.Provider>
  );
};

export const useEmissions = () => {
  const context = useContext(EmissionContext);
  if (!context) {
    throw new Error('useEmissions must be used within an EmissionProvider');
  }
  return context;
};
