import React, { useState, useRef } from 'react';
import { useEmissions } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import {
  CampusDepartment,
  EmissionSourceCategory,
  EmissionRecord,
  ProofAttachmentType,
} from '../types';
import { EMISSION_FACTORS } from '../utils/calculations';
import {
  X,
  Calculator,
  Leaf,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: EmissionRecord | null;
}

const DEPARTMENTS: CampusDepartment[] = [
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'IT',
  'AIDS',
  'AIML',
  'Mathematics (Freshman Engineering)',
  'Engineering Chemistry (Freshman Engineering)',
  'Engineering Physics (Freshman Engineering)',
  'Freshman Engineering (1st Year)',
  'Hostels & Residential Blocks',
  'Administration & Management',
  'Transport & Fleet Facilities',
  'Central Library & Labs',
];

export const EmissionEntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
}) => {
  const { addRecord, updateRecord } = useEmissions();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(recordToEdit?.title || '');
  const [date, setDate] = useState(
    recordToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState<EmissionSourceCategory>(
    recordToEdit?.category || 'department_electricity'
  );
  const [department, setDepartment] = useState<CampusDepartment>(
    recordToEdit?.department || currentUser?.department || 'CSE'
  );
  const [facilityLocation, setFacilityLocation] = useState(
    recordToEdit?.facilityLocation || ''
  );
  const [meterReadingNumber, setMeterReadingNumber] = useState(
    recordToEdit?.meterReadingNumber || 'MTR-MKCE-2026'
  );
  const [activityValue, setActivityValue] = useState<number | ''>(
    recordToEdit ? recordToEdit.activityValue : ''
  );
  const [proofType, setProofType] = useState<ProofAttachmentType>(
    recordToEdit?.proofType || 'photo'
  );
  const [proofUrl, setProofUrl] = useState(
    recordToEdit?.proofUrl ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  );
  const [proofFileName, setProofFileName] = useState(
    recordToEdit?.proofFileName || 'Meter_Reading_Proof.jpg'
  );
  const [proofFileSize, setProofFileSize] = useState(
    recordToEdit?.proofFileSize || '1.24 MB'
  );
  const [notes, setNotes] = useState(recordToEdit?.notes || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMeta = EMISSION_FACTORS[category];
  const numVal = typeof activityValue === 'number' ? activityValue : 0;
  const calculatedEmissionKg = Number((numVal * currentMeta.factor).toFixed(2));
  const calculatedEmissionTons = calculatedEmissionKg / 1000;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setProofType(isPdf ? 'pdf' : 'photo');
    setProofFileName(file.name);
    const kb = Math.max(1, Math.round(file.size / 1024));
    setProofFileSize(kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`);
    if (isPdf) {
      setProofUrl(
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 640;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.65);
              setProofUrl(compressed);
              return;
            }
          } catch {
            // Fall back to original dataUrl
          }
          setProofUrl(dataUrl);
        };
        img.onerror = () => setProofUrl(dataUrl);
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numVal <= 0) {
      setError('Please provide a positive numerical value for activity consumption.');
      return;
    }

    if (!facilityLocation.trim()) {
      setError('Please specify the campus facility location (e.g. Science Block 2F or Hostel A).');
      return;
    }

    if (recordToEdit) {
      updateRecord(recordToEdit.id, {
        title,
        date,
        category,
        department,
        facilityLocation,
        meterReadingNumber,
        activityValue: numVal,
        proofType,
        proofUrl,
        proofFileName,
        proofFileSize,
        notes,
      });
    } else {
      const res = addRecord({
        title,
        date,
        category,
        department,
        facilityLocation,
        meterReadingNumber,
        activityValue: numVal,
        proofType,
        proofUrl,
        proofFileName,
        proofFileSize,
        notes,
      });

      if (!res.success) {
        setError(res.message);
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Operator Telemetry Entry (Photo / PDF Proof)</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {recordToEdit ? 'Edit Emission Record & Proof' : 'Record New Log Entry with Proof'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            M.Kumarasamy College of Engineering · Submitted logs are verified by Admin PRANITH SRIRAM G.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Activity Title / Description
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CSE Sub-Meter #401 Monthly Electricity Consumption"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Source Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmissionSourceCategory)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                {Object.entries(EMISSION_FACTORS).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label} ({meta.scope})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as CampusDepartment)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Facility / Location
              </label>
              <input
                type="text"
                required
                value={facilityLocation}
                onChange={(e) => setFacilityLocation(e.target.value)}
                placeholder="e.g. Panel B1"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Meter / Invoice No.
              </label>
              <input
                type="text"
                required
                value={meterReadingNumber}
                onChange={(e) => setMeterReadingNumber(e.target.value)}
                placeholder="MTR-CS-401"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Audit Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Activity Consumption Value ({currentMeta.unit})
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={activityValue}
                onChange={(e) =>
                  setActivityValue(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder={`Enter amount in ${currentMeta.unit}`}
                className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-16 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-xs"
              />
              <span className="absolute right-3 top-2 text-xs font-mono text-slate-500">
                {currentMeta.unit}
              </span>
            </div>
          </div>

          {/* Photo or PDF Proof Attachment */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Attach Photo or PDF Proof</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProofType('photo');
                    setProofFileName('Meter_Photo_Proof.jpg');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                    proofType === 'photo'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProofType('pdf');
                    setProofFileName('TANGEDCO_Utility_Invoice.pdf');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                    proofType === 'pdf'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg p-2.5">
              <div className="text-xs truncate">
                <span className="font-semibold text-slate-800">{proofFileName}</span>{' '}
                <span className="text-[10px] font-mono text-slate-400">({proofFileSize})</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold shrink-0 cursor-pointer"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Real-time Calculation Formula Card */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-800">
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Computed Carbon Impact (GHG Protocol)</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-emerald-200">
                Factor: {currentMeta.factor} kg CO₂e/{currentMeta.unit}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-600">
              Formula: {numVal.toLocaleString()} {currentMeta.unit} × {currentMeta.factor} ={' '}
              <strong className="text-slate-900 tabular-nums">{calculatedEmissionKg} kg CO₂e</strong>
            </div>
            <div className="text-sm font-bold font-mono text-emerald-800 pt-1">
              {calculatedEmissionTons < 0 ? '-' : ''}
              {Math.abs(calculatedEmissionTons).toFixed(3)} Metric Tons CO₂e
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Operator / Meter Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sub-meter ID #409, photo captured during shift audit"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{recordToEdit ? 'Save Changes' : 'Submit Log & Proof for Approval'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
