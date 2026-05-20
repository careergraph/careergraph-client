# Phase 7: Interview Room — Mobile Video Experience

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (safe-area)  
> **Pattern áp dụng:** Custom (Video Layout), 3e (Touch)  
> **Có thể chạy song song với Phase 4, 5, 6**

---

## Mục tiêu

Make Interview Room usable trên mobile:
- Mobile portrait: stack video (remote lớn, local nhỏ overlay)
- Landscape: side-by-side hoặc PiP pattern
- Control bar: touch-friendly 44px buttons, safe-area bottom
- Loading/error overlays responsive

---

## Hiện trạng Analysis

### InterviewRoom.jsx (Fragment layout — NO navbar, NO bottom nav)

```jsx
<div className="flex flex-col h-screen bg-black text-white">
  <div className="flex flex-1">
    {/* Video streams */}
  </div>
  <div className="bg-slate-900 p-4 flex items-center justify-center gap-4">
    {/* Control bar: camera, mic, screen share, disconnect */}
  </div>
</div>
```

**Vấn đề:**
1. Control buttons `px-4 py-2.5` ≈ 40px — dưới 44px
2. Không có safe-area-inset-bottom trên control bar
3. Không có safe-area-inset-top cho status bar overlay
4. Video layout không optimize cho portrait mobile
5. Screen share button — không có mobile alternative (mobile không share screen)
6. Loading/error states: buttons `px-4 py-2.5` dưới 44px
7. Không có landscape orientation detection

---

## Files in scope

### 1. `src/pages/InterviewRoom.jsx`

#### 1a. Control Bar — Safe Area + Touch Targets

**Hiện trạng:**
```jsx
<div className="bg-slate-900 p-4 flex items-center justify-center gap-4">
  <button className="px-4 py-2.5 text-sm rounded-full bg-slate-700">
    <Camera size={20} />
  </button>
  {/* ... more buttons */}
  <button className="px-4 py-2.5 text-sm rounded-full bg-red-600">
    Disconnect
  </button>
</div>
```

**Thay đổi:**
```diff
- <div className="bg-slate-900 p-4 flex items-center justify-center gap-4">
+ <div className="bg-slate-900 px-4 pt-3 flex items-center justify-center gap-3 sm:gap-4"
+   style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
```

**Control buttons:**
```diff
- <button className="px-4 py-2.5 text-sm rounded-full bg-slate-700">
+ <button className="p-3 sm:px-4 sm:py-2.5 text-sm rounded-full bg-slate-700">
```
- Mobile: `p-3` (12px) + icon 20px + 12px = 44px ✅
- Desktop: `px-4 py-2.5` — giữ nguyên (text + icon layout)

**Screen share button — hide trên mobile:**
```diff
- <button className="... "><Monitor size={20} /> Share Screen</button>
+ <button className="hidden sm:flex ... "><Monitor size={20} /> Share Screen</button>
```
> Mobile browsers không support screen sharing trong WebRTC context — ẩn để tránh confusion.

#### 1b. Video Layout — Mobile Portrait

**Concept:**
```
MOBILE PORTRAIT:              DESKTOP / LANDSCAPE:
┌─────────────────┐           ┌──────────────────────┐
│                 │           │                      │
│  Remote Video   │           │  Remote      Local   │
│  (full width)   │           │  (2/3)       (1/3)   │
│                 │           │                      │
│         ┌─────┐│           │                      │
│         │Local││           │                      │
│         │PiP  ││           └──────────────────────┘
│         └─────┘│           │   [🎤] [📷] [☎️]    │
│─────────────────│           └──────────────────────┘
│ [🎤] [📷] [☎️] │
└─────────────────┘
```

**Thay đổi video container:**
```diff
  <div className="flex flex-1">
-   {/* Current: side-by-side or custom */}
+   <div className="relative flex flex-1 flex-col sm:flex-row">
+     {/* Remote video — main */}
+     <div className="flex-1 bg-black">
+       <video ref={remoteVideoRef} className="h-full w-full object-cover" />
+     </div>
+     {/* Local video — PiP on mobile, side on desktop */}
+     <div className={cn(
+       "bg-slate-800",
+       // Mobile: PiP overlay
+       "absolute bottom-4 right-4 w-28 h-36 rounded-xl overflow-hidden shadow-lg",
+       "sm:static sm:absolute-none",
+       // Desktop: side panel
+       "sm:relative sm:w-1/3 sm:h-auto sm:rounded-none sm:shadow-none"
+     )}>
+       <video ref={localVideoRef} className="h-full w-full object-cover" />
+     </div>
+   </div>
```

**Mobile PiP specs:**
- Position: `absolute bottom-4 right-4`
- Size: `w-28 h-36` (112×144px) — 9:16 ratio thumbnail
- Border radius: `rounded-xl` (12px)
- Shadow: `shadow-lg` — distinguish from background
- Draggable: Future enhancement (KHÔNG implement trong phase này)

#### 1c. Loading/Error States — Button Touch Targets

```diff
{/* Error state buttons */}
- <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm ...">
+ <button className="inline-flex items-center gap-2 px-5 py-3 text-sm ...">
    <RefreshCcw size={16} /> Try Again
  </button>
```

`py-3` (12px) + text ≈ 44px ✅

#### 1d. Fullscreen Loading Overlay — Safe Area

```diff
- <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
+ <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
+   style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
```

#### 1e. Room code display — responsive

Nếu hiện room code:
```diff
- <p className="text-xs text-slate-400">Room: {roomCode}</p>
+ <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">Room: {roomCode}</p>
```

---

## Không làm trong Phase 7

- ❌ Không đổi WebRTC connection logic (signaling, ICE, STUN/TURN)
- ❌ Không đổi socket connections
- ❌ Không touch interview scoring/evaluation
- ❌ Không thêm virtual background
- ❌ Không thêm screen recording
- ❌ Không thêm chat trong room (text chat)
- ❌ Không implement draggable PiP (future)
- ❌ Không touch MyInterviews page (Phase 5)
- ❌ Không thêm landscape lock orientation API

---

## QA Checklist — Phase 7

### iPhone SE (375×667) — Portrait
- [ ] Remote video: full-width, chiếm hầu hết viewport
- [ ] Local video: PiP overlay, bottom-right, 112×144px
- [ ] Local PiP: rounded corners, shadow visible
- [ ] Control bar: buttons ≥ 44px touch area
- [ ] Control bar: safe-area-inset-bottom có effect
- [ ] Screen share button: HIDDEN trên mobile
- [ ] Disconnect button: visible, red, easy to tap
- [ ] Loading overlay: centered, safe-area-top padding
- [ ] Error state buttons: ≥ 44px touch area
- [ ] No horizontal scroll
- [ ] Video auto-plays (WebRTC standard behavior)

### iPhone 15 (393×852) — Portrait
- [ ] Same as iPhone SE
- [ ] More vertical space → remote video taller

### iPhone (any) — Landscape
- [ ] Video layout adapts (remote takes more width)
- [ ] PiP still visible, not overlapping controls
- [ ] Control bar accessible at bottom
- [ ] Safe-area-inset-bottom for landscape home indicator

### iPad (768×1024) — Portrait
- [ ] Side-by-side layout: remote (2/3) + local (1/3)
- [ ] Screen share button visible
- [ ] Control bar bigger gap (`sm:gap-4`)
- [ ] Buttons: desktop sizing (`sm:px-4 sm:py-2.5`)

### Desktop (1440px)
- [ ] Side-by-side layout giữ nguyên
- [ ] All controls functional
- [ ] Screen share button visible
- [ ] KHÔNG regression visual

### WebRTC Specifics
- [ ] Camera permission prompt → không bị control bar che
- [ ] Microphone toggle → visual feedback (icon change)
- [ ] Camera toggle → video shows/hides
- [ ] Disconnect → navigate away cleanly
- [ ] Network disconnect → error state displays properly

---

## Implementation Notes

### CSS `absolute` vs Tailwind on PiP:
```jsx
// PiP approach — absolute inside relative video container
className={cn(
  // Base: PiP overlay
  "absolute bottom-4 right-4 w-28 h-36 rounded-xl overflow-hidden shadow-lg z-10",
  // Desktop override: static side panel
  "sm:static sm:w-1/3 sm:h-auto sm:rounded-none sm:shadow-none sm:z-auto"
)}
```

> **Issue:** Tailwind `sm:static` phải override `absolute`. Verify specificity.  
> Nếu conflict: wrap trong responsive div hoặc dùng 2 separate elements with `hidden/flex`.

### Alternative approach (2 elements):
```jsx
{/* Mobile PiP */}
<div className="absolute bottom-4 right-4 w-28 h-36 rounded-xl overflow-hidden shadow-lg sm:hidden z-10">
  <video ref={localVideoRef} className="h-full w-full object-cover" />
</div>

{/* Desktop side panel */}
<div className="hidden sm:block relative w-1/3 bg-slate-800">
  <video ref={localVideoRef} className="h-full w-full object-cover" />
</div>
```

> **Vấn đề:** 2 video elements cùng ref → cần clone ref hoặc dùng conditional render.  
> **QUYẾT ĐỊNH:** Dùng conditional render approach — cleaner:

```jsx
const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
// OR useSyncExternalStore with matchMedia for reactivity
```

### Performance note:
- Video elements should NOT re-mount khi resize (stream disconnect)
- Prefer CSS-only responsive over conditional render nếu có thể
- Test: resize browser → video stream vẫn connected
