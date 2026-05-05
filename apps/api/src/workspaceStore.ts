import type { WorkspaceRecord, WorkspaceUpsert } from "@maint/contracts";

/**
 * First-pass workspace storage.
 *
 * This is intentionally in-memory because the goal of this phase is to define
 * the service boundary and shared contracts before introducing PostgreSQL and a
 * migration toolchain. Swapping the implementation later should not require route
 * or frontend changes.
 */
export const createWorkspaceStore = () => {
  const records = new Map<string, WorkspaceRecord>();

  return {
    get(workspaceId: string): WorkspaceRecord | null {
      return records.get(workspaceId) || null;
    },
    upsert(workspaceId: string, workspace: WorkspaceUpsert): WorkspaceRecord {
      const record: WorkspaceRecord = {
        ...workspace,
        workspaceId,
        updatedAt: new Date().toISOString()
      };
      records.set(workspaceId, record);
      return record;
    }
  };
};
