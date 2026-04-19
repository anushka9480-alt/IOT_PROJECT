import { Pill, Clock, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface MedicationCardProps {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  onToggle: (id: string) => void;
  color: string;
}

export function MedicationCard({ id, name, dosage, time, taken, onToggle, color }: MedicationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white border-2 border-[#1E293B] rounded-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        taken ? 'opacity-60' : ''
      } ${isHovered ? 'scale-[1.02] rotate-[-1deg]' : ''}`}
      style={{
        boxShadow: taken ? '4px 4px 0px #E2E8F0' : `4px 4px 0px ${color}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-full border-2 border-[#1E293B] flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Pill className="text-white" strokeWidth={2.5} size={24} />
        </div>
        <button
          onClick={() => onToggle(id)}
          className={`w-10 h-10 rounded-full border-2 border-[#1E293B] flex items-center justify-center transition-all duration-300 ${
            taken ? 'bg-[#34D399]' : 'bg-white hover:bg-[#FBBF24]'
          }`}
          style={{
            boxShadow: '2px 2px 0px #1E293B',
          }}
        >
          {taken ? (
            <Check className="text-white" strokeWidth={2.5} size={20} />
          ) : (
            <div className="w-3 h-3 rounded-full border-2 border-[#64748B]" />
          )}
        </button>
      </div>
      <h3 className="mb-2">{name}</h3>
      <p className="text-[#64748B] mb-3">{dosage}</p>
      <div className="flex items-center gap-2 text-[#1E293B]">
        <Clock size={16} strokeWidth={2.5} />
        <span>{time}</span>
      </div>
    </div>
  );
}
