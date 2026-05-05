import { z } from "zod";

/**
 * The first backend iteration stores a tenant-local workspace document as raw JSON.
 * We keep the shape intentionally loose so the frontend can continue to evolve
 * without waiting for a large schema migration project.
 */
export const workspaceUpsertSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  payload: z.unknown()
});

export type WorkspaceUpsert = z.infer<typeof workspaceUpsertSchema>;

export interface WorkspaceRecord extends WorkspaceUpsert {
  workspaceId: string;
  updatedAt: string;
}
