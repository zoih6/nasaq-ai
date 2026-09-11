# عقود البيانات والـMock API — نَسَق AI

| الحقل | القيمة |
|---|---|
| الإصدار | `0.1` |
| الحالة | Contract baseline للـFrontend prototype |
| آخر تحديث | 11 سبتمبر 2026 |
| المرجع | [PRD](../01-product/PRD.md) · [State Machines](../01-product/STATE-MACHINES.md) · [Frontend Architecture](FRONTEND-ARCHITECTURE.md) |

> هذه الوثيقة تحدد أشكال البيانات والسلوك على الحدود. الأمثلة TypeScript إرشادية، والتنفيذ الفعلي يكون في `packages/contracts` باستخدام Zod كمصدر لأنواع runtime وcompile-time.

---

## 1. مبادئ العقود

1. contract واحد للـMock والـBackend.
2. IDs opaque؛ لا تستخرج منها صلاحية أو زمنًا.
3. التواريخ ISO-8601 UTC strings عند النقل.
4. المال integer minor units + currency.
5. status discriminated union، لا مجموعة booleans متعارضة.
6. كل list cursor-paginated ما لم تكن bounded صغيرة.
7. كل command حساس يدعم idempotency.
8. الأخطاء codes ثابتة ورسائل localized في الواجهة.
9. لا secrets أو prompt content في analytics/audit DTOs العامة.
10. breaking changes تحتاج version جديدًا أو migration؛ لا تغيير صامت.

---

## 2. Versioning وHeaders

### Base path المستقبلي

```text
/api/v1
```

### Headers

```text
Authorization: Bearer …
X-Workspace-Id: ws_…
Idempotency-Key: idem_…          # commands المكلفة/الحساسة
If-Match: "resource-version"     # optimistic concurrency
X-Request-Id: req_…              # client optional, server canonical
Accept-Language: ar | en
```

### Response metadata

```ts
type ResponseMeta = {
  requestId: string;
  serverTime: string;
  apiVersion: "v1";
};
```

---

## 3. الأنواع الأولية

```ts
type Locale = "ar" | "en";
type Direction = "rtl" | "ltr";
type ISODateTime = string;
type CurrencyCode = "USD" | "EUR" | "SAR" | "AED" | string;
type MinorUnit = number; // safe integer only
type ResourceVersion = number;

type Money = {
  amountMinor: MinorUnit;
  currency: CurrencyCode;
};

type DateRange = {
  from: ISODateTime;
  to: ISODateTime;
};

type ActorRef = {
  type: "user" | "system" | "agent" | "service";
  id: string;
  displayName?: string;
};
```

### ID prefixes للfixtures والlogs

| الكيان | Prefix |
|---|---|
| workspace | `ws_` |
| user | `usr_` |
| membership | `mem_` |
| project | `prj_` |
| conversation | `cnv_` |
| message | `msg_` |
| response | `rsp_` |
| comparison | `cmp_` |
| model | `mdl_` |
| provider | `pvd_` |
| credential | `cred_` |
| agent | `agt_` |
| agent version | `agv_` |
| flow | `flw_` |
| flow version | `flv_` |
| run | `run_` |
| step/node run | `stp_` |
| approval | `apr_` |
| artifact | `art_` |
| collection | `col_` |
| knowledge source | `src_` |
| usage event | `use_` |
| budget | `bdg_` |
| notification | `ntf_` |

Prefixes للتشخيص فقط؛ authorization لا يعتمد عليها.

---

## 4. Success وError envelopes

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta: ResponseMeta;
};

type ApiFailure = {
  ok: false;
  error: ApiError;
  meta: ResponseMeta;
};

type ApiError = {
  code: ErrorCode;
  messageKey: string;
  retryability: "retryable" | "user_action" | "final" | "unknown";
  correlationId?: string;
  fieldErrors?: Array<{
    path: string;
    code: string;
    messageKey: string;
  }>;
  safeDetails?: Record<string, string | number | boolean | null>;
};
```

### Error codes الأساسية

```text
VALIDATION_FAILED
AUTHENTICATION_REQUIRED
SESSION_EXPIRED
FORBIDDEN
RESOURCE_NOT_FOUND
RESOURCE_ARCHIVED
VERSION_CONFLICT
IDEMPOTENCY_CONFLICT
RATE_LIMITED
QUOTA_EXCEEDED
BUDGET_EXCEEDED
CREDITS_INSUFFICIENT
CREDENTIAL_INVALID
CREDENTIAL_REVOKED
MODEL_UNAVAILABLE
MODEL_CAPABILITY_MISMATCH
PROVIDER_DEGRADED
PROVIDER_TIMEOUT
UPLOAD_REJECTED
FILE_QUARANTINED
POLICY_BLOCKED
APPROVAL_REQUIRED
APPROVAL_EXPIRED
RUN_NOT_CANCELLABLE
UNKNOWN_OUTCOME
INTERNAL_ERROR
```

لا يعرض `safeDetails` raw provider payload أو stack أو secret.

---

## 5. Pagination وFiltering

```ts
type PageInfo = {
  nextCursor: string | null;
  previousCursor?: string | null;
  hasMore: boolean;
};

type Paginated<T> = {
  items: T[];
  pageInfo: PageInfo;
  totalApprox?: number;
};
```

- cursor opaque.
- `limit` افتراضي 25، والحد الأقصى يحدده endpoint.
- sort keys allowlisted.
- filters schema per endpoint.
- `totalApprox` لا يعرض كرقم دقيق دون معنى.

---

## 6. Workspace, User & Membership

```ts
type Workspace = {
  id: string;
  name: string;
  slug?: string;
  avatar?: { kind: "initials" | "image"; value: string };
  status: "active" | "suspended" | "deleting";
  defaultLocale: Locale;
  defaultModelId?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  version: ResourceVersion;
};

type User = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  locale: Locale;
  theme: "light" | "dark" | "system";
};

type Role = "owner" | "admin" | "builder" | "member" | "viewer" | "billing";

type Membership = {
  id: string;
  workspaceId: string;
  user: Pick<User, "id" | "displayName" | "email" | "avatarUrl">;
  roles: Role[];
  status: "active" | "invited" | "suspended";
  joinedAt?: ISODateTime;
};
```

### Permission snapshot

```ts
type PermissionSnapshot = {
  workspaceId: string;
  roles: Role[];
  actions: string[];
  constraints: Record<string, unknown>;
  generatedAt: ISODateTime;
  version: string;
};
```

هذا snapshot لتحسين UI، وليس بديل authorization في الخادم.

---

## 7. Project

```ts
type ProjectStatus = "active" | "archiving" | "archived" | "deleting";

type Project = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  colorToken?: string;
  icon?: string;
  status: ProjectStatus;
  instructions?: string;
  defaultModelId?: string;
  defaultPayerPolicy?: PayerPolicy;
  counts: {
    conversations: number;
    knowledgeSources: number;
    agents: number;
    flows: number;
    activeRuns: number;
  };
  createdBy: ActorRef;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  version: ResourceVersion;
};
```

`counts` summary وقد يكون eventually consistent؛ التفاصيل من endpoints الخاصة.

---

## 8. Providers, Models & Routing

```ts
type ProviderStatus = "available" | "degraded" | "outage" | "disabled";
type ModelStatus = "available" | "degraded" | "retiring" | "unavailable";
type Modality = "text" | "image_input" | "image_output" | "audio_input" | "audio_output" | "file";

type Provider = {
  id: string;
  key: string;
  displayName: string;
  status: ProviderStatus;
  statusMessageKey?: string;
};

type Model = {
  id: string;
  providerId: string;
  providerModelKey: string;
  displayName: string;
  family: string;
  status: ModelStatus;
  capabilities: {
    modalities: Modality[];
    tools: boolean;
    structuredOutput: boolean;
    citations: boolean;
    maxContextTokens?: number;
  };
  fitTags: Array<"general" | "research" | "coding" | "reasoning" | "fast" | "vision" | "long_context">;
  relativeSpeed: "fast" | "balanced" | "slow";
  relativeCost: "low" | "medium" | "high";
  pricingVersionId?: string;
  access: {
    platformCredits: boolean;
    byok: boolean;
    credentialStatus?: CredentialStatus;
  };
  retirementAt?: ISODateTime;
};

type RoutingMode = "manual" | "smart" | "quality" | "speed" | "cost" | "privacy";

type RoutingPolicy = {
  mode: RoutingMode;
  selectedModelId?: string;
  fallbackEnabled: boolean;
  fallbackModelIds: string[];
  allowCrossProviderFallback: boolean;
  payerPolicy: PayerPolicy;
};

type PayerPolicy = {
  primary: "byok" | "platform_credits";
  fallback?: "byok" | "platform_credits" | "none";
  credentialId?: string;
};
```

### Routing receipt

```ts
type RoutingReceipt = {
  requestedMode: RoutingMode;
  selectedModelId: string;
  providerId: string;
  payer: "byok" | "platform_credits";
  reasonCodes: string[];
  fallbackOccurred: boolean;
  fallbackFromModelId?: string;
};
```

---

## 9. Provider Credential metadata

```ts
type CredentialStatus = "testing" | "active" | "degraded" | "invalid" | "rotating" | "revoked";
type CredentialScope =
  | { type: "personal"; userId: string }
  | { type: "workspace"; workspaceId: string }
  | { type: "project"; projectId: string };

type ProviderCredential = {
  id: string;
  providerId: string;
  label: string;
  status: CredentialStatus;
  scope: CredentialScope;
  maskedHint?: string;
  lastTestedAt?: ISODateTime;
  lastUsedAt?: ISODateTime;
  createdBy: ActorRef;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};
```

**لا يوجد field للقيمة السرية في response schema.**

Command create يستخدم:

```ts
type CreateCredentialInput = {
  providerId: string;
  label: string;
  secret: string; // request-only, never persisted client-side
  scope: CredentialScope;
};
```

---

## 10. Conversation & Message

```ts
type Conversation = {
  id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  status: "active" | "archived";
  mode: "single" | "compare";
  defaultRoutingPolicy: RoutingPolicy;
  createdBy: ActorRef;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  version: ResourceVersion;
};

type MessageStatus =
  | "submitting"
  | "accepted"
  | "persisted"
  | "failed_retryable"
  | "failed_final";

type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system_notice";
  status: MessageStatus;
  parts: ContentPart[];
  parentMessageId?: string;
  branchId?: string;
  createdBy: ActorRef;
  createdAt: ISODateTime;
};

type ContentPart =
  | { type: "text"; text: string }
  | { type: "markdown"; markdown: string }
  | { type: "attachment"; attachment: AttachmentRef }
  | { type: "citation"; citation: Citation }
  | { type: "artifact_ref"; artifactId: string }
  | { type: "notice"; tone: "info" | "warning" | "danger"; messageKey: string };
```

### Attachment

```ts
type AttachmentStatus = "selected" | "uploading" | "scanning" | "processing" | "ready" | "rejected" | "quarantined" | "failed";

type AttachmentRef = {
  id: string;
  fileName: string;
  mediaType: string;
  sizeBytes: number;
  status: AttachmentStatus;
  previewKind: "image" | "document" | "text" | "none";
};
```

---

## 11. Model Response

```ts
type ResponseStatus =
  | "queued" | "connecting" | "streaming" | "interrupted" | "reconciling"
  | "completing" | "cancel_requested" | "completed" | "completed_with_warnings"
  | "cancelled" | "failed_retryable" | "failed_final";

type ModelResponse = {
  id: string;
  messageId: string;
  conversationId: string;
  status: ResponseStatus;
  modelId: string;
  routingReceipt: RoutingReceipt;
  parts: ContentPart[];
  citations: Citation[];
  usage?: UsageSummary;
  warnings: ProductWarning[];
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
};

type Citation = {
  id: string;
  marker: string;
  title: string;
  url?: string;
  sourceId?: string;
  locator?: { type: "page" | "section" | "paragraph" | "time" | "url_fragment"; value: string };
  excerpt?: string;
  availability: "available" | "unavailable" | "restricted";
};
```

Markdown/model output يخضع renderer آمن؛ HTML خام غير موثوق.

---

## 12. Comparison

```ts
type ComparisonStatus = "configuring" | "validating" | "running" | "partial" | "completed" | "failed" | "cancel_requested" | "cancelled";

type Comparison = {
  id: string;
  conversationId: string;
  sourceMessageId: string;
  status: ComparisonStatus;
  branchResponseIds: string[];
  compatibilityAdjustments: Array<{
    modelId: string;
    code: string;
    descriptionKey: string;
  }>;
  selectedResponseId?: string;
  synthesisResponseId?: string;
  createdAt: ISODateTime;
};
```

---

## 13. Agent definition

```ts
type Agent = {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  latestDraftVersionId?: string;
  publishedVersionId?: string;
  createdBy: ActorRef;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

type AgentVersion = {
  id: string;
  agentId: string;
  versionNumber: number;
  state: "draft" | "published";
  goal: string;
  instructions: string;
  routingPolicy: RoutingPolicy;
  knowledgeCollectionIds: string[];
  tools: ToolGrant[];
  approvalPolicy: ApprovalPolicy;
  limits: RunLimits;
  validation: ValidationResult;
  createdAt: ISODateTime;
};

type RunLimits = {
  maxCost?: Money;
  maxDurationSeconds: number;
  maxSteps: number;
};
```

---

## 14. Tools, grants & approval policy

```ts
type ToolRisk = "read" | "write_internal" | "external_side_effect" | "destructive" | "secret_access" | "financial";

type ToolOperation = {
  id: string;
  toolId: string;
  name: string;
  description: string;
  risk: ToolRisk;
  inputSchemaRef: string;
  supportsIdempotency: boolean;
};

type ToolGrant = {
  toolId: string;
  operationIds: string[];
  scope: Record<string, string | string[]>;
  credentialId?: string;
};

type ApprovalPolicy = {
  rules: Array<{
    risk: ToolRisk;
    mode: "allow" | "require_approval" | "deny";
    approverRoles?: Role[];
    threshold?: Money;
  }>;
};
```

---

## 15. Run, Step, Approval & Artifact

```ts
type RunStatus =
  | "draft" | "validating" | "rejected" | "queued" | "planning" | "running"
  | "waiting_for_input" | "waiting_for_approval" | "paused" | "cancel_requested"
  | "recovering" | "finalizing" | "completed" | "completed_with_warnings"
  | "failed_retryable" | "failed_final" | "cancelled" | "expired";

type Run = {
  id: string;
  type: "agent" | "flow";
  workspaceId: string;
  projectId?: string;
  definitionId: string;
  versionId: string;
  status: RunStatus;
  goal: string;
  plan?: PlanItem[];
  limits: RunLimits;
  usage: UsageSummary;
  artifactIds: string[];
  pendingApprovalIds: string[];
  createdBy: ActorRef;
  createdAt: ISODateTime;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
  lastEventSequence: number;
};

type PlanItem = {
  id: string;
  title: string;
  status: "pending" | "active" | "completed" | "skipped" | "failed";
};

type StepStatus = "blocked" | "ready" | "queued" | "running" | "waiting_for_approval" | "succeeded" | "skipped" | "failed_retryable" | "failed_final" | "cancelled";

type RunStep = {
  id: string;
  runId: string;
  parentStepId?: string;
  title: string;
  kind: "model" | "tool" | "approval" | "transform" | "output" | "system";
  status: StepStatus;
  modelId?: string;
  toolOperationId?: string;
  attempt: number;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
  usage?: UsageSummary;
  safeSummary?: string;
  error?: ApiError;
};
```

### Approval

```ts
type ApprovalStatus = "pending" | "reviewing" | "approved" | "edited" | "denied" | "expired" | "revoked" | "consumed" | "execution_failed";

type Approval = {
  id: string;
  runId: string;
  stepId: string;
  status: ApprovalStatus;
  risk: ToolRisk;
  actionDigest: string;
  actionTitle: string;
  actionSummary: string;
  targetSummary?: string;
  costEstimate?: Money;
  editableFields: string[];
  expiresAt: ISODateTime;
  requestedAt: ISODateTime;
  resolvedAt?: ISODateTime;
  resolvedBy?: ActorRef;
};
```

### Artifact

```ts
type Artifact = {
  id: string;
  workspaceId: string;
  projectId?: string;
  runId?: string;
  type: "document" | "table" | "file" | "image" | "link_collection" | "json";
  title: string;
  mediaType: string;
  sizeBytes?: number;
  status: "generating" | "ready" | "preview_failed" | "deleted";
  preview?: { kind: string; safeUrl?: string; excerpt?: string };
  createdAt: ISODateTime;
};
```

---

## 16. Flow graph

```ts
type Flow = {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  description?: string;
  status: "draft" | "published" | "deprecated" | "archived";
  latestDraftVersionId?: string;
  publishedVersionId?: string;
  updatedAt: ISODateTime;
};

type FlowVersion = {
  id: string;
  flowId: string;
  versionNumber: number;
  state: "draft" | "published" | "deprecated";
  graph: FlowGraph;
  validation: ValidationResult;
  limits: RunLimits;
  createdAt: ISODateTime;
};

type FlowGraph = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport?: { x: number; y: number; zoom: number };
};

type FlowNode = {
  id: string;
  type: "start" | "input" | "model" | "agent" | "knowledge" | "condition" | "approval" | "output";
  position: { x: number; y: number };
  label: string;
  config: Record<string, unknown>; // parsed by type-specific schema
};

type FlowEdge = {
  id: string;
  sourceNodeId: string;
  sourceHandle?: string;
  targetNodeId: string;
  targetHandle?: string;
  conditionLabel?: string;
};
```

كل `node.type` يملك Zod schema مستقلة؛ `Record` ليس escape hatch في التنفيذ.

### Validation

```ts
type ValidationResult = {
  status: "not_run" | "valid" | "valid_with_warnings" | "invalid";
  issues: Array<{
    id: string;
    severity: "error" | "warning" | "info";
    code: string;
    messageKey: string;
    path?: string;
    nodeId?: string;
  }>;
  checkedAt?: ISODateTime;
};
```

---

## 17. Knowledge

```ts
type KnowledgeCollection = {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  description?: string;
  sourceCount: number;
  readySourceCount: number;
  createdAt: ISODateTime;
};

type KnowledgeSourceStatus = "uploaded" | "scanning" | "processing" | "ready" | "stale" | "reprocessing" | "failed_retryable" | "failed_final" | "quarantined" | "deleting" | "deleted";

type KnowledgeSource = {
  id: string;
  collectionId: string;
  type: "file" | "url" | "text";
  name: string;
  status: KnowledgeSourceStatus;
  stage?: "upload" | "scan" | "extract" | "index";
  mediaType?: string;
  sizeBytes?: number;
  sourceUrl?: string;
  locatorSupport: Array<"page" | "section" | "paragraph">;
  lastIndexedAt?: ISODateTime;
  error?: ApiError;
  createdAt: ISODateTime;
};

type RetrievalResult = {
  query: string;
  passages: Array<{
    id: string;
    sourceId: string;
    text: string;
    locator?: Citation["locator"];
    score?: number;
  }>;
  profileId: string;
  executedAt: ISODateTime;
};
```

---

## 18. Usage, Cost & Budget

```ts
type UsageQuantity = {
  unit: "input_token" | "output_token" | "image" | "second" | "request" | "storage_byte_day";
  quantity: string; // decimal-safe
};

type CostState = "estimate" | "reserved" | "actual" | "adjustment" | "refunded" | "pending_reconciliation";

type UsageSummary = {
  payer: "byok" | "platform_credits" | "mixed";
  quantities: UsageQuantity[];
  estimatedCost?: Money;
  actualCost?: Money;
  state: CostState;
};

type UsageEvent = {
  id: string;
  workspaceId: string;
  projectId?: string;
  userId?: string;
  resource: { type: "message" | "response" | "run" | "step" | "storage"; id: string };
  providerId?: string;
  modelId?: string;
  credentialId?: string;
  payer: "byok" | "platform_credits";
  quantities: UsageQuantity[];
  cost: Money;
  state: CostState;
  pricingVersionId?: string;
  idempotencyKey: string;
  occurredAt: ISODateTime;
};

type Budget = {
  id: string;
  scope: { type: "workspace" | "project" | "user"; id: string };
  period: "daily" | "weekly" | "monthly";
  softLimit?: Money;
  hardLimit?: Money;
  alertPercentages: number[];
  currentActual: Money;
  currentReserved: Money;
  status: "healthy" | "warning" | "near_limit" | "exceeded_soft" | "blocked_hard";
};
```

---

## 19. Notification & Audit

```ts
type Notification = {
  id: string;
  workspaceId: string;
  userId: string;
  type: "run_update" | "approval" | "budget" | "security" | "team";
  severity: "info" | "attention" | "critical";
  titleKey: string;
  bodyKey: string;
  resource?: { type: string; id: string };
  readAt?: ISODateTime;
  createdAt: ISODateTime;
};

type AuditEvent = {
  id: string;
  workspaceId: string;
  actor: ActorRef;
  action: string;
  resource?: { type: string; id: string };
  outcome: "success" | "failure" | "denied";
  safeSummary?: string;
  requestId?: string;
  occurredAt: ISODateTime;
};
```

Audit لا يحتوي secret أو prompt body؛ التفاصيل الحساسة في نظام محمي منفصل عند الحاجة.

---

## 20. REST endpoint matrix الأولية

### Session/workspaces

```text
GET    /me
GET    /workspaces
POST   /workspaces
GET    /workspaces/:id
PATCH  /workspaces/:id
GET    /workspaces/:id/permissions
```

### Projects

```text
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
POST   /projects/:id/archive
POST   /projects/:id/restore
DELETE /projects/:id
```

### Chat

```text
GET    /conversations
POST   /conversations
GET    /conversations/:id
GET    /conversations/:id/messages
POST   /conversations/:id/messages
POST   /responses/:id/cancel
POST   /responses/:id/retry
POST   /comparisons
GET    /comparisons/:id
POST   /comparisons/:id/select
POST   /comparisons/:id/synthesize
```

### Agents/runs

```text
GET    /agents
POST   /agents
GET    /agents/:id
PATCH  /agents/:id/draft
POST   /agents/:id/validate
POST   /agents/:id/publish
POST   /agents/:id/runs
GET    /runs
GET    /runs/:id
GET    /runs/:id/steps
POST   /runs/:id/cancel
POST   /runs/:id/pause
POST   /runs/:id/resume
POST   /runs/:id/input
POST   /runs/:id/retry
```

### Approvals/artifacts

```text
GET    /approvals
GET    /approvals/:id
POST   /approvals/:id/approve
POST   /approvals/:id/edit-and-approve
POST   /approvals/:id/deny
GET    /artifacts/:id
POST   /artifacts/:id/save-to-project
```

### Flows

```text
GET    /flows
POST   /flows
GET    /flows/:id
PATCH  /flows/:id/draft
POST   /flows/:id/validate
POST   /flows/:id/publish
POST   /flows/:id/runs
```

### Knowledge

```text
GET    /knowledge/collections
POST   /knowledge/collections
GET    /knowledge/collections/:id
POST   /knowledge/collections/:id/sources
POST   /knowledge/collections/:id/test
GET    /knowledge/sources/:id
POST   /knowledge/sources/:id/retry
DELETE /knowledge/sources/:id
```

### Models/credentials/usage

```text
GET    /providers
GET    /models
GET    /models/:id
GET    /credentials
POST   /credentials
POST   /credentials/:id/test
POST   /credentials/:id/rotate
DELETE /credentials/:id
GET    /usage
GET    /usage/events/:id
GET    /budgets
POST   /budgets
PATCH  /budgets/:id
```

Prototype handlers يمكن أن تكون داخلية، لكن الأسماء والسلوك لا يتغيران بلا تحديث هذا العقد.

---

## 21. Event stream contract

```ts
type StreamEnvelope<TType extends string, TPayload> = {
  eventId: string;
  streamId: string;
  sequence: number;
  type: TType;
  occurredAt: ISODateTime;
  payload: TPayload;
};
```

### Response events

```text
response.created
response.started
response.delta
response.citation_added
response.usage_updated
response.warning_added
response.cancel_requested
response.completed
response.failed
```

### Run events

```text
run.created
run.status_changed
run.plan_updated
step.created
step.started
step.progress
step.completed
step.failed
approval.requested
approval.resolved
artifact.created
run.usage_updated
run.completed
run.failed
```

### قواعد

- `sequence` يزيد داخل stream.
- client يحفظ آخر sequence.
- duplicate eventId يهمل idempotently.
- gap يطلب snapshot/reconnect.
- delta لا يحتوي HTML موثوق.
- event log ليس chain-of-thought؛ summaries عملية منقحة.

---

## 22. Mock scenario contract

```ts
type MockScenario =
  | "happy"
  | "new_user"
  | "dense"
  | "provider_degraded"
  | "partial_compare"
  | "quota_low"
  | "quota_exhausted"
  | "viewer"
  | "approval_pending"
  | "run_failure"
  | "offline_reconnect"
  | "rtl_stress";
```

يمكن تحديد السيناريو من development toolbar أو query آمن في بيئة التطوير فقط. لا يصل إلى production.

### زمن المحاكاة

```ts
type MockTiming = {
  requestMs: number;
  firstEventMs: number;
  eventIntervalMs: number;
  terminalMs: number;
};
```

القيم seeded وقابلة لتسريع tests.

---

## 23. Analytics event shape

```ts
type AnalyticsEvent = {
  name: string;
  occurredAt: ISODateTime;
  anonymousId?: string;
  userId?: string;
  workspaceId?: string;
  routeId?: string;
  properties: Record<string, string | number | boolean | null>;
};
```

### حقول ممنوعة افتراضيًا

- prompt/response text.
- file name/content.
- API key/credential hint.
- source excerpt.
- email خارج نظام identity المخصص.
- URL كامل قد يحوي query حساسًا.

---

## 24. Redaction

```ts
type Redacted<T> = T & {
  redactions?: Array<{
    field: string;
    reason: "secret" | "pii" | "permission" | "policy";
  }>;
};
```

- server يطبق redaction؛ client لا يتلقى ثم يخفي.
- audit/notifications تستخدم safe summaries.
- viewer قد يرى resource metadata دون content حسب permission.
- export يخضع contract وصلاحيات مستقلة.

---

## 25. Contract testing

### اختبارات لازمة

- schema parse لكل fixture.
- success/error envelope.
- forward-compatible unknown optional fields.
- reject invalid status combinations.
- money safe integer/currency.
- events ordered/duplicates/gaps.
- permission-redacted variants.
- Arabic/English/mixed bidi strings.
- generated OpenAPI/JSON Schema consistency لاحقًا.

### CI gate

```text
contracts typecheck
→ schema tests
→ all fixtures parse
→ mock handlers satisfy endpoints
→ UI integration scenarios
```

---

## 26. معايير القبول

- [ ] كل كيان ظاهر في Wave 1 له Zod schema.
- [ ] لا شاشة تستورد object غير متحقق من boundary.
- [ ] status values تطابق `STATE-MACHINES.md`.
- [ ] secrets لا توجد في response schemas.
- [ ] money وusage لا يستخدمان float غير مضبوط.
- [ ] كل command مكلف/حساس يحدد idempotency behavior.
- [ ] كل list يحدد pagination/filter schema.
- [ ] streaming mock يطبق sequence/duplicate/gap.
- [ ] fixtures happy/error/permission/quota parse بنجاح.
- [ ] أي تغيير contract يكسر test أو يتطلب تحديثًا واعيًا للواجهات.
