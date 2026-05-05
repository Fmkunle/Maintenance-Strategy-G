import Fastify from "fastify";
import { riskEvaluationRequestSchema, workspaceUpsertSchema } from "@maint/contracts";
import { evaluateRiskScenario } from "@maint/domain";
import { createWorkspaceStore } from "./workspaceStore";

const app = Fastify({
  logger: true
});

const workspaceStore = createWorkspaceStore();

app.get("/health", async () => ({
  status: "ok",
  service: "@maint/api"
}));

app.get("/api/workspaces/:workspaceId", async (request, reply) => {
  const workspaceId = String((request.params as { workspaceId?: string }).workspaceId || "").trim();
  const record = workspaceStore.get(workspaceId);

  if (!record) {
    return reply.code(404).send({
      message: `Workspace '${workspaceId}' was not found.`
    });
  }

  return record;
});

app.put("/api/workspaces/:workspaceId", async (request, reply) => {
  const workspaceId = String((request.params as { workspaceId?: string }).workspaceId || "").trim();
  const parsedBody = workspaceUpsertSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.code(400).send({
      message: "Workspace payload failed validation.",
      issues: parsedBody.error.issues
    });
  }

  return workspaceStore.upsert(workspaceId, parsedBody.data);
});

app.post("/api/risk/evaluate", async (request, reply) => {
  const parsedBody = riskEvaluationRequestSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return reply.code(400).send({
      message: "Risk evaluation payload failed validation.",
      issues: parsedBody.error.issues
    });
  }

  return evaluateRiskScenario(parsedBody.data);
});

const port = Number(process.env.PORT || "3001");

app
  .listen({
    host: "0.0.0.0",
    port
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
