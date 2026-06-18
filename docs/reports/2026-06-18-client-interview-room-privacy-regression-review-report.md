# Client Interview Room + Privacy Regression Review Report

- Date: 2026-06-18
- Scope: `careergraph-client`

## Review Summary

- No code change was required in `careergraph-client` for this fix set.
- Candidate room-entry rule remains correct:
  - candidate can only join within the existing early-access window
  - the current 15-minute early join behavior must remain unchanged

## What Was Re-checked

1. Candidate portal should not need any new UI for the cross-company privacy rule.
   - The rule is enforced server-side during scheduling.
2. Candidate interview room timing should still enforce early join window.
   - This fix must not accidentally open room access earlier than before.
3. Candidate notifications for cancelled interview depend on backend DB hotfix.
   - After backend SQL patch, candidate notification dropdown and interview list should refresh normally.

## Manual QA Suggestions

1. Candidate opens `My Interviews` before interview day:
   - cancelled interviews still appear as history when appropriate
2. Candidate opens online room more than 15 minutes early:
   - access remains blocked
3. Candidate joins inside allowed window:
   - access succeeds
4. HR cancels interview after SQL hotfix:
   - candidate receives and can open the cancellation notification

## Production Verdict

- Candidate-facing behavior remains stable.
- Main dependency is backend deployment order:
  - deploy SQL hotfix together with backend notification change
