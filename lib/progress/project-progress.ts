export interface TaskWeightItem {
  weight: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ProgressResult {
  percentage: number;
  completedWeight: number;
  totalWeight: number;
  hasMeasurableTasks: boolean;
}

/**
 * Calculates project progress based on weighted task completion.
 * Formula (Section 18):
 * Completed Task Weight / Total Non-Cancelled Task Weight * 100
 */
export function calculateProjectProgress(tasks: TaskWeightItem[]): ProgressResult {
  const eligibleTasks = tasks.filter((t) => t.status !== 'CANCELLED');

  if (eligibleTasks.length === 0) {
    return {
      percentage: 0,
      completedWeight: 0,
      totalWeight: 0,
      hasMeasurableTasks: false,
    };
  }

  const totalWeight = eligibleTasks.reduce((sum, t) => sum + Math.max(1, t.weight || 1), 0);
  const completedWeight = eligibleTasks
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + Math.max(1, t.weight || 1), 0);

  const percentage = Math.round((completedWeight / totalWeight) * 1000) / 10; // 1 decimal place

  return {
    percentage,
    completedWeight,
    totalWeight,
    hasMeasurableTasks: true,
  };
}
