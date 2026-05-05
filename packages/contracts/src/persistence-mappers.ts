/**
 * Snapshot-oriented failure-mode fields that are preserved across DB JSON rebuilds.
 *
 * These fields intentionally stay stringly-typed because the current workspace
 * persists already-formatted display values in the DB JSON contract.
 */
export interface FailureModeSnapshotFields {
  "Failure Mode Cost Benefit Ratio": string
  "Failure Mode Total Cost": string
  "Failure Mode Effect Cost": string
  "Failure Mode Corrective Down Time": string
  "Failure Mode Corrective Event Count": string
  "Failure Mode Corrective Cost": string
  "Failure Mode Planned Cost": string
  "Failure Mode Secondary Action Cost": string
  "Failure Mode Inspection Cost": string
  "Failure Mode Failure Rate": string
  "Failure Mode Availability": string
}

export interface FailureModeEffectRow {
  "Failure Mode Effect Effect": string
  "Failure Mode Effect Redundancy Factor": string
}

export interface FailureModeTaskRow {
  "Task Name": string
  "Task Strategy": string
  "Scheduled Task Type": string
  "Scheduled Task Is Enabled": boolean
  "Scheduled Task Do Not Deliver": boolean
  "Scheduled Task Is Secondary Action": boolean
  "Scheduled Task Description": string
  "Scheduled Task Secondary Inspection": string
  "Scheduled Task Interval": string
  "Scheduled Task Interval Short Description": string
  "Scheduled Task PF Interval": string
  "Scheduled Task Detection Probability": string
  "Scheduled Task Duration": string
  "Scheduled Task Labor Labor": string
}

/**
 * Legacy-compatible failure-mode DB JSON shape.
 *
 * The field names intentionally mirror the current persisted structure exactly so
 * extraction does not imply a storage migration.
 */
export interface FailureModeDbJson extends FailureModeSnapshotFields {
  "Physical Asset Name": string
  "Physical Asset Description": string
  "Component Name": string
  "Failure Mode Name": string
  "Failure Mode Description": string
  "Failure Mode Is Dormant": boolean
  "Failure Mode Demand Frequency": string
  "Failure Mode Distribution": string
  "Failure Mode MTTF": string
  "Failure Mode Eta 1": string
  "Failure Mode Beta 1": string
  "Failure Mode Gamma 1": string
  "Failure Mode Alarm Is Enabled": boolean
  "Failure Mode Alarm Description": string
  "Failure Mode Alarm PF Interval": string
  "Failure Mode Alarm Detection Probability": string
  effects: FailureModeEffectRow[]
  tasks: FailureModeTaskRow[]
}
