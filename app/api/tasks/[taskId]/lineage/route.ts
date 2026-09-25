import { NextRequest, NextResponse } from "next/server";
import { getTaskLineage } from "@/lib/lineage/lineage-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
  }

  const lineage = await getTaskLineage(taskId);

  if (!lineage) {
    return NextResponse.json(
      { error: "Task not found or lineage unavailable" },
      { status: 404 }
    );
  }

  return NextResponse.json(lineage);
}
