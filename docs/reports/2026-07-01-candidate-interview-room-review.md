# Client Report - 2026-07-01 - Candidate interview room regression review

## Scope

- Review candidate-side interview room behavior against the reported kick/rejoin issue.

## Findings

- Candidate `useWebRTC` is already intentionally passive after admission:
  - candidate waits for host offer
  - avoids offer glare
- The primary defect was not in the candidate page itself.
- The observed "waiting / not seeing each other until F5" state is consistent with stale host-side peer state after kick.
- Candidate access is still UI-gated to `15` minutes before the scheduled interview, which matches the requested business rule.

## QA notes

- Candidate page currently handles:
  - `rejected`
  - `kicked`
  - `room-ended`
  - host-driven media disable
- Because the RTC fix now emits `user-left` properly to HR, candidate rejoin should work without requiring additional candidate-page changes.
- Candidate timer now prefers shared `roomOpenedAt` from signaling, so both browsers can show the same session time instead of drifting based on local join time.
- Remote placeholder copy now better distinguishes "HR has not joined" from "media is reconnecting".

## UI/UX review

- Lobby and error states are more production-ready than the RTC flow itself was.
- One remaining UX gap:
  - after a long pending wait, candidate feedback is still quite generic
  - showing clearer state such as "HR đang xem yêu cầu của bạn" vs "HR chưa mở phòng" would reduce confusion

## Verification

- No code changes were required in `careergraph-client` for this fix set.
- Candidate flow still needs manual E2E validation together with HR and RTC after deploying the signaling patch.
