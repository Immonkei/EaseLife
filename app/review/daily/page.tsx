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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          3-Minute Daily Reflection
        </h2>
        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
          Calibrate your execution: reflect on your energy, focus, and learnings to plan better tomorrow.
        </p>
      </div>

      <ReflectionForm initialReflection={reflection} />
    </div>
  );
}
