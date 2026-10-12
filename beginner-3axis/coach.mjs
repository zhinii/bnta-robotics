/** Offline, explanation-only coaching. There is deliberately no network adapter,
 * simulator reference, coordinate setter, or action callback in this interface. */
import { finiteVec } from "./model.mjs";
import { LESSONS } from "./lessons.mjs";

export const COACH_TEXT_KEYS = Object.freeze(
  [
    "unavailable",
    ...["preview", "grip", "blocked", "start", "generic"].flatMap((group) =>
      [1, 2, 3].map((n) => `${group}${n}`),
    ),
  ].map((key) => `coach.${key}`),
);
/** @param {{telemetry?:object,lessonId?:string,stageId?:string,errorCode?:string,
 * prediction?:string,priorHintLevel?:number,evidence?:object}} input
 * @returns {{lessonId:string,stageId:string,hintLevel:number,textKey:string,
 * suggestedControlId:string|null,evidenceEventIds:string[],telemetryAvailable:boolean}} */
export function coachHint(input = {}) {
  const lessonId = LESSONS.some((l) => l.id === input.lessonId)
    ? input.lessonId
    : "types";
  const stageId =
    typeof input.stageId === "string" ? input.stageId.slice(0, 80) : "practice";
  const hintLevel = Math.max(
    1,
    Math.min(
      3,
      (Number.isInteger(input.priorHintLevel) ? input.priorHintLevel : 0) + 1,
    ),
  );
  const telemetry = input.telemetry;
  const telemetryAvailable =
    telemetry?.verified === true &&
    finiteVec(telemetry.current ?? telemetry.tcp) &&
    finiteVec(telemetry.target) &&
    typeof telemetry.objectHeld === "boolean";
  const evidenceEventIds = Array.isArray(input.evidence?.eventIds)
    ? input.evidence.eventIds
        .filter((id) => typeof id === "string" && id.length <= 120)
        .slice(-32)
    : [];
  let group = "generic",
    suggestedControlId = null;
  if (telemetryAvailable) {
    const code = input.errorCode ?? telemetry.errorCode;
    if (code === "START_STATE_MISMATCH") {
      group = "start";
      suggestedControlId = "reset";
    } else if (
      ["PATH_BLOCKED", "SELF_COLLISION", "FLOOR_COLLISION"].includes(code)
    ) {
      group = "blocked";
      suggestedControlId = "target-z";
    } else if (
      code === "GRASP_APPROACH_REQUIRED" ||
      (telemetry.gripperState === "closed" && !telemetry.objectHeld)
    ) {
      group = "grip";
      suggestedControlId = "open";
    } else if (telemetry.previewEdited === true) {
      group = "preview";
      suggestedControlId = "move";
    }
  }
  return Object.freeze({
    lessonId,
    stageId,
    hintLevel,
    textKey: telemetryAvailable
      ? `coach.${group}${hintLevel}`
      : "coach.unavailable",
    suggestedControlId: telemetryAvailable ? suggestedControlId : null,
    evidenceEventIds: Object.freeze(evidenceEventIds),
    telemetryAvailable,
  });
}
export const getCoachHint = coachHint;
