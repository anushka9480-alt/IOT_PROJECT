import { TrendingUp, Calendar, Award } from 'lucide-react';

interface AdherenceStatsProps {
  todayPercentage: number;
  weekStreak: number;
  totalMedications: number;
}

export function AdherenceStats({ todayPercentage, weekStreak, totalMedications }: AdherenceStatsProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: "Today's Progress",
      value: `${todayPercentage}%`,
      color: '#8B5CF6',
    },
    {
      icon: Calendar,
      label: 'Week Streak',
      value: `${weekStreak} days`,
      color: '#F472B6',
    },
    {
      icon: Award,
      label: 'Total Meds',
      value: totalMedications,
      color: '#FBBF24',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white border-2 border-[#1E293B] rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: `3px 3px 0px ${stat.color}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-[#1E293B] flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: stat.color }}
            >
              <Icon className="text-white" strokeWidth={2.5} size={20} />
            </div>
            <div className="text-2xl mb-1">{stat.value}</div>
            <div className="text-xs text-[#64748B]">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
