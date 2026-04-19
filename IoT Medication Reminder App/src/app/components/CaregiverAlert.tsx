import { AlertCircle, User, X } from 'lucide-react';

interface CaregiverAlertProps {
  patientName: string;
  medicationName: string;
  missedTime: string;
  onDismiss: () => void;
}

export function CaregiverAlert({ patientName, medicationName, missedTime, onDismiss }: CaregiverAlertProps) {
  return (
    <div
      className="bg-white border-2 border-[#1E293B] rounded-2xl p-5 mb-4 transition-all duration-300"
      style={{
        boxShadow: '4px 4px 0px #EF4444',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EF4444] border-2 border-[#1E293B] flex items-center justify-center flex-shrink-0">
          <AlertCircle className="text-white" strokeWidth={2.5} size={24} />
        </div>
        <div className="flex-1">
          <h4 className="mb-1">Missed Medication Alert</h4>
          <p className="text-[#64748B] mb-2">
            {patientName} missed their {medicationName} dose at {missedTime}
          </p>
          <div className="flex items-center gap-2 text-[#64748B]">
            <User size={14} strokeWidth={2.5} />
            <span className="text-sm">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-8 h-8 rounded-full bg-white border-2 border-[#1E293B] flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
          style={{
            boxShadow: '2px 2px 0px #1E293B',
          }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
