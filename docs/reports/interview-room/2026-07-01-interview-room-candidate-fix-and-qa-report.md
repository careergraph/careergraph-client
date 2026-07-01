# Candidate Interview Room Fix And QA Report

Date: 2026-07-01
Repo: `careergraph-client`

## Scope

Stabilize candidate-side reconnect behavior after the candidate is kicked from an interview room and later re-approved by HR.

## Code Change Applied

File: `src/hooks/useWebRTC.js`

- Cleared `pendingCandidates.current` inside `closePeer()`.

Relevant lines after fix:

- `closePeer()` around line 36

## Root Cause Observed On Client Side

When a previous peer session was closed after kick, stale ICE candidates could survive in memory and interfere with the next room admission attempt. Combined with backend/readmit mismatch, this produced symptoms such as:

- candidate and HR approved but unable to see each other,
- media only restored after `F5`.

## Functional QA Assessment

Expected corrected flow:

1. Candidate joins room and waits for HR approval.
2. HR admits candidate and media connection works.
3. HR kicks candidate.
4. Candidate re-enters the room URL and sends a new join request.
5. HR admits again.
6. Candidate sees HR without needing page refresh.

## UI / UX Review

Production-readiness: usable, but one communication gap remains.

- Strength: waiting approval, kicked, and room ended are clearly distinguished.
- Concern: after a kick, the user has no precise hint whether rejoin is allowed or whether they should wait for HR instruction.
- Suggestion for later, not included in this patch:
  show a short helper text on the kicked screen such as "Bạn có thể vào lại nếu HR cho phép."

## Verification

- Local build could not be executed here because `npm` is not available in PATH.
- Static review completed against the updated RTC and API flow.

## Summary

This repo needed only a minimal cleanup change. The main business-logic mismatch was fixed in `careergraph-api`, while this client patch reduces reconnect fragility and keeps impact low.
