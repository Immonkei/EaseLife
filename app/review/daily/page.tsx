import { BookOpen } from "lucide-react";
import { getDailyReflection } from "@/lib/reflection/daily-reflection-service";
import { ReflectionForm } from "./reflection-form";

export default async function DailyReviewPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  let reflection = null;

  try {
    reflection = await getDailyReflection(todayStr);
  } catch {}

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          Daily Review
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Take a brief moment to celebrate today&apos;s wins and set up tomorrow for success.
        </p>
      </div>

      <ReflectionForm initialReflection={reflection} />
    </div>
  );
}
