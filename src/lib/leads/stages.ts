export const PIPELINE_STAGES = [
  "submitted",
  "contacted",
  "appointment_set",
  "qualified",
  "closed_won",
  "closed_lost",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export function isPipelineStage(s: string): s is PipelineStage {
  return (PIPELINE_STAGES as readonly string[]).includes(s);
}

export function stageLabel(stage: string): string {
  return stage.replace(/_/g, " ");
}
