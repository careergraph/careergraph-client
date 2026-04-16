# Candidate FE Multi-Job Context QA Report

Date: 2026-04-16
Owner: Copilot (GPT-5.3-Codex)
Scope: `careergraph-client` messaging UI layer

## 1) Implemented

- API updates:
  - `getMessages(threadId, jobId?, page, size)`
  - `sendMessage(..., jobContextId?)`
  - `getThreadJobs(threadId)`
  - normalized `ThreadSummary.jobs`, `ThreadSummary.primaryJob`, `Message.jobContext`
- ChatWindow updates:
  - Job Filter Bar for view filtering.
  - Job Context Selector in compose area.
  - Context-aware sending via `jobContextId`.
  - Message grouping by job context with `JobDivider`.
- Message bubble:
  - Added job tag under message meta row.
- Inbox/thread list:
  - Search now includes all job titles in thread.
  - Thread card shows multi-job chips (up to 2).
- Added stable per-job color helper.

## 2) Compatibility

- Existing candidate messaging behavior preserved:
  - same thread list entry points,
  - same realtime socket flow,
  - same unsend/read logic.
- Job context is additive and optional (`null` means general message).

## 3) Build Validation

Command:

```bash
cd careergraph-client
npm run build
```

Result:

- PASS

Notes:

- Vite chunk-size warning remains (non-blocking, outside messaging scope).

## 4) Checklist Mapping (Phase 4 style)

- [x] Candidate chat supports multi-job context selection.
- [x] Candidate chat supports job-specific filter view.
- [x] Job context divider/tag rendering in message area.
- [x] Thread list shows multi-job context chips.
- [x] Build passed.
- [ ] Manual cross-role runtime E2E for new multi-job flows (pending).

## 5) Risks / Follow-up

- UI currently keeps existing `application` context bar for backward compatibility while adding multi-job controls.
- Recommended follow-up:
  - runtime E2E for HR send with context -> Candidate filter rendering,
  - add regression tests for send/retry preserving `jobContextId`.
