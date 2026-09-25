export type PaceStatus =
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'OFF_TRACK'
  | 'NOT_STARTED'
  | 'COMPLETED'
  | 'NO_SCHEDULE';

export interface PaceCalculationResult {
  actual: number;
  expected: number;
  delta: number;
  status: PaceStatus;
  statusLabel: string;
}

/**
 * Calculates Expected Pace vs Actual Pace (Architecture Section 19)
 *
 * Expected = (Current Date - Start Date) / (Target Date - Start Date) * 100
 * Delta = Actual - Expected
 *
 * Thresholds:
 * Delta >= -5%       -> ON_TRACK
 * -20% <= Delta < -5% -> AT_RISK
 * Delta < -20%       -> OFF_TRACK
 */
export function calculatePace(params: {
  startDate: string | null | undefined;
  targetDate: string | null | undefined;
  actualProgress: number;
  isCompleted?: boolean;
  referenceDate?: Date;
}): PaceCalculationResult {
  const { startDate, targetDate, actualProgress, isCompleted = false, referenceDate = new Date() } = params;

  if (isCompleted || actualProgress >= 100) {
    return {
      actual: 100,
      expected: 100,
      delta: 0,
      status: 'COMPLETED',
      statusLabel: 'Completed',
    };
  }

  if (!startDate || !targetDate) {
    return {
      actual: actualProgress,
      expected: 0,
      delta: 0,
      status: 'NO_SCHEDULE',
      statusLabel: 'No timeline set',
    };
  }

  const start = new Date(startDate).getTime();
  const target = new Date(targetDate).getTime();
  const now = referenceDate.getTime();

  // Edge case: target <= start
  if (target <= start) {
    const expected = now >= target ? 100 : 0;
    const delta = Math.round((actualProgress - expected) * 10) / 10;
    return {
      actual: actualProgress,
      expected,
      delta,
      status: delta >= -5 ? 'ON_TRACK' : delta >= -20 ? 'AT_RISK' : 'OFF_TRACK',
      statusLabel: delta >= 0 ? `+${delta}% Ahead` : `${delta}% Behind`,
    };
  }

  // Edge case: current date is before start date
  if (now < start) {
    return {
      actual: actualProgress,
      expected: 0,
      delta: actualProgress,
      status: 'NOT_STARTED',
      statusLabel: 'Starts in future',
    };
  }

  // Target date has passed
  if (now >= target) {
    const expected = 100;
    const delta = Math.round((actualProgress - expected) * 10) / 10;
    return {
      actual: actualProgress,
      expected: 100,
      delta,
      status: delta >= -5 ? 'ON_TRACK' : delta >= -20 ? 'AT_RISK' : 'OFF_TRACK',
      statusLabel: `${delta}% Past deadline`,
    };
  }

  // General timeline calculation
  const totalDuration = target - start;
  const elapsed = now - start;
  const rawExpected = (elapsed / totalDuration) * 100;
  const expected = Math.round(Math.min(100, Math.max(0, rawExpected)) * 10) / 10;

  const delta = Math.round((actualProgress - expected) * 10) / 10;

  let status: PaceStatus = 'ON_TRACK';
  if (delta < -20) {
    status = 'OFF_TRACK';
  } else if (delta < -5) {
    status = 'AT_RISK';
  } else {
    status = 'ON_TRACK';
  }

  const statusLabel =
    delta > 0
      ? `+${delta}% Ahead`
      : delta === 0
      ? 'On Pace'
      : `${delta}% Behind`;

  return {
    actual: actualProgress,
    expected,
    delta,
    status,
    statusLabel,
  };
}
