import { Sparkles } from 'lucide-react';

interface GeminiInsightProps {
  insight: string;
}

export function GeminiInsight({ insight }: GeminiInsightProps) {
  return (
    <div
      className="bg-white border-2 border-[#1E293B] rounded-2xl p-6 mb-6"
      style={{
        boxShadow: '6px 6px 0px #8B5CF6',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-white" strokeWidth={2.5} size={24} />
        </div>
        <div className="flex-1">
          <h4 className="mb-2">AI Health Insight</h4>
          <p className="text-[#64748B] leading-relaxed">{insight}</p>
        </div>
      </div>
    </div>
  );
}
