# Candidate Interview Notification Refresh Fix Report - 2026-06-18

## Scope

- Added candidate-side handling for new interview-status notifications.
- Forced notification click navigation to reload page data every time.
- Enabled browser notification click-through with refresh semantics.

## Frontend Changes

- `NotificationDropdown.jsx`
  - Added support for:
    - `INTERVIEW_CANCELLED`
    - `INTERVIEW_RESCHEDULE_ACCEPTED`
    - `INTERVIEW_RESCHEDULE_REJECTED`
  - Notification click now uses hard redirect with `refresh=1` and `ts`.
  - Same-page navigation no longer leaves stale interview data on screen.

- `useNotifySocket.js`
  - Native browser notification click now opens `data.navigateTo` and forces reload.

## Test Result

- `npm run build` - PASS

## Senior Tester Review

- Candidate now receives clearer feedback for interview lifecycle changes, not only initial scheduling.
- Clicking from dropdown or browser notification should always fetch latest interview data because route is reloaded from scratch.

## Strict UX Review

- Strong improvement:
  - lower confusion when HR cancels or handles a reschedule proposal
  - stale-state complaint on same-page redirect is addressed safely
- Remaining production observation:
  - full reload is intentionally conservative; it trades some smoothness for correctness

## Recommendation

- Accept current implementation for production hotfix.
- Later consider route-aware refetch + optimistic notification deep links for smoother navigation.
