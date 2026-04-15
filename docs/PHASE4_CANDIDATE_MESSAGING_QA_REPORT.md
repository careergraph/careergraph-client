# Phase 4 Candidate Messaging - Implementation and QA Report

Date: 2026-04-15
Owner: Copilot (GPT-5.3-Codex)
Scope: Candidate FE messaging in JavaScript (careergraph-client)

## 1) Requested Scope Checklist

- [x] Add `/messages` page, mobile-first layout
- [x] Thread list with company/HR info
- [x] Chat window in JS (ported from Phase 3 ideas)
- [x] Add "Message HR" entry point from Applied Jobs
- [x] Add unread badge in candidate navigation
- [x] Add job context bar in chat window
- [x] Candidate constraints: no block/archive actions in UI
- [x] Candidate constraints: unsend only within 60 seconds
- [x] Validate with build and cross-role messaging flow

## 2) Main Functional Changes

### Messaging feature module (new)

- Added API client: `src/features/messaging/api/messagingApi.js`
- Added Zustand store: `src/features/messaging/store/messagingStore.js`
- Added hooks:
  - `src/features/messaging/hooks/useThreads.js`
  - `src/features/messaging/hooks/useMessages.js`
  - `src/features/messaging/hooks/useChatSocket.js`
  - `src/features/messaging/hooks/useUnsendCountdown.js`
  - `src/features/messaging/hooks/useMessagingUnread.js`
- Added identity helper for robust own-message detection:
  - `src/features/messaging/utils/identity.js`
- Added UI components:
  - `src/features/messaging/components/ChatWindow.jsx`
  - `src/features/messaging/components/InboxList.jsx`
  - `src/features/messaging/components/ThreadCard.jsx`
  - `src/features/messaging/components/MessageBubble.jsx`
  - `src/features/messaging/components/MessageInput.jsx`
  - `src/features/messaging/components/TypingIndicator.jsx`
  - `src/features/messaging/components/ReadReceipt.jsx`
  - `src/features/messaging/components/EmptyInbox.jsx`
  - `src/features/messaging/components/EmptyChat.jsx`
- Added page and styles:
  - `src/features/messaging/pages/MessagesPage.jsx`
  - `src/features/messaging/styles/messaging.css`

### Candidate app integration (updated)

- Route config:
  - `src/config/index.js` (added `/messages`)
  - `src/routes/routes.jsx` (registered private route)
- Navigation + unread badges:
  - `src/components/ProfileDashboard/Sidebar.jsx`
  - `src/layouts/components/Navbar/Navbar.jsx`
- Profile dashboard responsive behavior for messages screen:
  - `src/layouts/ProfileDashboardLayout/ProfileDashboardLayout.jsx`
- Applied Jobs chat entry point:
  - `src/pages/AppliedJobs.jsx`

### Dependency updates

- Added `date-fns` to support message time formatting.

## 3) Important Behavioral Notes

- Candidate UI intentionally excludes block/archive controls.
- Unsend is available only for own messages and only in 60s window.
- Mobile behavior includes list/chat panel switching and keyboard-safe message input spacing.
- Own-message identity now uses JWT-aware identity resolution (`sub` fallback), reducing sender-id mismatch risk.

## 4) Validation Summary

### Build validation (candidate FE)

Command:
- `npm run build`

Result:
- PASS

### Realtime messaging E2E validation (HR <-> Candidate)

Environment used:
- API: `http://localhost:8010/careergraph/api/v1`
- RTC: `http://localhost:4000`

Flow validated:
1. HR login success
2. Candidate login success (test account created via register + OTP confirm)
3. Candidate creates/gets thread with HR company
4. Candidate sends message via API + emits `new-message`
5. HR receives `new-message` socket event
6. HR marks thread as read via API + emits `messages-read`
7. Candidate receives `messages-read` socket event
8. Candidate unsends message via API + emits `message-deleted`
9. HR receives `message-deleted` socket event

Result:
- PASS

Evidence snapshot from run:
- send status: 200
- read status: 200
- unsend status: 200
- events observed: `new-message`, `messages-read`, `message-deleted`

## 5) Environment Issue Found During E2E (and Local Fix)

While running E2E, `/messages/threads` initially failed with HTTP 500 due DB schema mismatch:
- missing columns: `message_threads.archived_by_company`, `message_threads.archived_by_candidate`

Local fix applied to dev DB:

```sql
ALTER TABLE message_threads
  ADD COLUMN IF NOT EXISTS archived_by_company BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE message_threads
  ADD COLUMN IF NOT EXISTS archived_by_candidate BOOLEAN NOT NULL DEFAULT FALSE;
```

After this fix, end-to-end flow passed.

## 6) Final Status

- Candidate FE Phase 4 messaging requirements are implemented.
- Build is green.
- Cross-role messaging flow is validated in local environment after schema alignment.
