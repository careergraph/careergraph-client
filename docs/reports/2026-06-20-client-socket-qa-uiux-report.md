# Candidate Socket QA and UIUX Report - 2026-06-20

## Scope

- Reviewed candidate notification socket usage.
- Reviewed candidate messaging socket usage.
- Reviewed candidate interview room signaling usage.
- Performed customer-lens UI/UX review for production readiness.

## Fix Applied

Updated candidate socket clients to allow Socket.IO fallback instead of enforcing websocket only.

Changed areas:

- notification socket hook
- chat socket hook
- interview room hook

New client behavior:

- `transports: ["websocket", "polling"]`
- `tryAllTransports: true`
- reconnect retained
- connection timeout added

## Production Impact

This directly reduces the chance that candidates fail to receive:

- notifications
- chat realtime updates
- interview room signaling

when accessing the system through CloudFront and reverse proxy layers.

## Senior Test Review

Positive findings:

- Notification routing logic is practical and user-centered.
- Chat socket hook already uses a shared connection model.
- Candidate interview room remains passive during offer glare situations, which is a good signaling choice.

Residual risks:

- I could not execute a frontend build on 2026-06-20 because `node` is not available in the shell PATH.
- There is no automated public-domain smoke test proving handshake fallback under real proxy conditions.
- WebRTC media success still depends on peer networking and STUN/TURN strategy; this change only improves signaling transport resilience.

## Customer-Lens UI/UX Review

Strengths:

- Notification card hierarchy is easy to scan.
- Unread markers are obvious.
- Clickthrough behavior is helpful and fast.
- Empty state is understandable.

Pain points:

- Vietnamese UI strings show encoding corruption in several labels and messages.
- Users do not get explicit feedback when realtime connectivity is degraded.
- The dropdown is functional but not yet "trust-building" for production because it hides transport state and failure recovery.

## Recommended Next UI/UX Improvements

- Fix UTF-8 encoding issues across candidate notification components.
- Show reconnecting/offline state for realtime features.
- Add a lightweight fallback message when a notification action opens stale data and refresh is being forced.
- Consider showing the notification category in plain language for non-technical users.

## Recommendation

The candidate realtime path is materially safer after the transport fallback fix, but production polish still needs encoding cleanup and clearer connectivity feedback.
