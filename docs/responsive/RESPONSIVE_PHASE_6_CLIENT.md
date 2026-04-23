# Phase 6: Messaging — Chat Mobile UX

> **Scope:** `careergraph-client`  
> **Phụ thuộc:** Phase 1 (bottom nav, safe-area)  
> **Pattern áp dụng:** Custom (Chat Mobile UX)  
> **Có thể chạy song song với Phase 4, 5, 7**

---

## Mục tiêu

Redesign messaging cho mobile experience ngang tầm Messenger/WhatsApp:
- Mobile: full-screen toggle **inbox ↔ chat** (KHÔNG side-by-side)
- Back button từ chat → inbox
- Responsive bubble widths
- Chat list + chat window KHÔNG đồng thời hiện trên mobile

---

## Hiện trạng Analysis

### MessagesPage.jsx
```jsx
// Hiện tại
<div className="... px-2 pb-2 sm:px-4 lg:px-6">
  {/* Inbox sidebar + Chat window side-by-side từ md: */}
  <InboxSidebar className="w-full md:w-80 xl:w-96" />
  <ChatWindow className="flex-1" />
</div>
```

### ProfileDashboardLayout cho Messages
```jsx
<SideBar classNames="hidden lg:block lg:w-80 lg:flex-none lg:h-full" />
<main className="flex min-w-0 flex-1 lg:flex-[3]">
  {children}
</main>
```

### Current Mobile Behavior
- ProfileDashboard Sidebar: hidden trên \<lg (tốt — không cần sidebar trên messages mobile)
- InboxSidebar: `hidden md:flex` — **ẨN inbox trên mobile**
- ChatWindow: `flex-1` — chiếm full width
- **Vấn đề:** Trên mobile, user CHỈNH thấy ChatWindow, KHÔNG thấy inbox list!
- Không có cách navigate giữa threads trên mobile (trừ khi có toggle state)

---

## Files in scope

### 1. `src/features/messaging/pages/MessagesPage.jsx`

**Thay đổi — Full-screen Toggle Pattern:**

```jsx
// State
const [showChat, setShowChat] = useState(false);
const [selectedThread, setSelectedThread] = useState(null);

// Khi user tap thread trong InboxSidebar:
const handleSelectThread = (thread) => {
  setSelectedThread(thread);
  setShowChat(true); // Mobile: switch to chat view
};

// Khi user tap back button trong ChatWindow:
const handleBackToInbox = () => {
  setShowChat(false);
};
```

**Layout:**
```jsx
<div className="flex h-full min-h-0 ... px-2 pb-2 sm:px-4 lg:px-6">
  {/* Inbox — Full width on mobile, fixed width on desktop */}
  <div className={cn(
    "flex flex-col",
    // Mobile: full width khi showChat === false, ẩn khi showChat === true
    showChat ? "hidden md:flex" : "flex w-full",
    // Desktop: always show, fixed width
    "md:w-80 xl:w-96 md:flex-none"
  )}>
    <InboxSidebar onSelectThread={handleSelectThread} />
  </div>

  {/* Chat — Full width on mobile, flex on desktop */}
  <div className={cn(
    "flex flex-col min-w-0",
    // Mobile: full width khi showChat === true, ẩn khi showChat === false
    showChat ? "flex flex-1" : "hidden md:flex md:flex-1",
  )}>
    <ChatWindow
      thread={selectedThread}
      onBack={handleBackToInbox}
      showBackButton={showChat} // Chỉ pass cho mobile back button
    />
  </div>
</div>
```

**Mobile Flow:**
```
1. User mở /messages
   → showChat = false
   → InboxSidebar: visible (full-width)
   → ChatWindow: hidden

2. User tap thread
   → handleSelectThread(thread)
   → showChat = true
   → InboxSidebar: hidden
   → ChatWindow: visible (full-width)

3. User tap back button
   → handleBackToInbox()
   → showChat = false
   → Back to inbox list
```

---

### 2. `src/features/messaging/components/ChatWindow.jsx`

**Thêm back button cho mobile:**

```jsx
// Props nhận thêm: onBack, showBackButton
const ChatWindow = ({ thread, onBack, showBackButton, ...props }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        {/* Back button — chỉ hiện trên mobile khi đang trong chat */}
        {showBackButton && (
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100"
            aria-label="Back to inbox"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {/* Thread header: avatar, name, status */}
        {/* ... existing header content */}
      </div>

      {/* Messages area */}
      {/* ... existing messages */}

      {/* MessageInput */}
      {/* ... existing input — KHÔNG touch (đã excellent) */}
    </div>
  );
};
```

**Back button specs:**
- Icon: `ArrowLeft` từ lucide-react, size 20px
- Touch target: `p-2` + icon 20px = 36px visual, Phase 1 CSS ensures 44px
- Visibility: `md:hidden` — chỉ trên mobile
- Position: Trái cùng trong header, trước avatar

---

### 3. `src/features/messaging/components/MessageBubble.jsx`

**Hiện trạng:**
```jsx
<div className="max-w-[85%] sm:max-w-[82%] ...">
  {/* Message content */}
</div>
```

**Thay đổi — thêm breakpoints:**
```diff
- <div className="max-w-[85%] sm:max-w-[82%] ...">
+ <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ...">
```

| Viewport | max-width | Lý do |
|----------|-----------|-------|
| Mobile (\<640px) | 90% | Tận dụng tối đa screen nhỏ |
| sm (640-767px) | 85% | Landscape phones |
| md (768-1023px) | 75% | Tablets — more breathing room |
| lg (1024px+) | 65% | Desktop — standard chat pattern |

---

### 4. `src/components/ProfileDashboard/Sidebar.jsx` — Messages context

**Hiện trạng:**
```jsx
// Trong ProfileDashboardLayout, messages page:
<SideBar classNames="hidden lg:block lg:w-80 lg:flex-none lg:h-full" />
```

**KHÔNG thay đổi** — ProfileDashboard Sidebar đã ẩn trên mobile cho messages. Đúng pattern.

---

## Không làm trong Phase 6

- ❌ Không touch MessageInput (đã excellent — safe-area + keyboard detection)
- ❌ Không thay đổi socket logic (connect, disconnect, events)
- ❌ Không đổi ThreadCard component (đã GOOD — 44px touch targets)
- ❌ Không đổi message sending/receiving logic
- ❌ Không thêm swipe gestures (swipe back, swipe to reply)
- ❌ Không thêm typing indicators (feature, không responsive)
- ❌ Không đổi message reactions
- ❌ Không touch job context selector

---

## QA Checklist — Phase 6

### iPhone SE (375×667) — Portrait — CRITICAL
- [ ] Mở /messages → InboxSidebar full-width, NO ChatWindow visible
- [ ] Tap thread → ChatWindow full-width, InboxSidebar HIDDEN
- [ ] Back button visible trên ChatWindow header
- [ ] Tap back → InboxSidebar visible, ChatWindow HIDDEN
- [ ] Messages load correctly sau navigate
- [ ] MessageInput keyboard detection VẪN hoạt động
- [ ] Message bubbles max-width 90% trên mobile
- [ ] Bottom nav (Phase 1) accessible từ inbox view
- [ ] Thread selection state preserved khi navigate
- [ ] Unread badge updates khi nhận message mới

### iPhone 15 (393×852)
- [ ] Same as iPhone SE
- [ ] Long thread list scrollable
- [ ] Chat scrollable to latest message

### iPad (768×1024)
- [ ] Side-by-side layout: InboxSidebar (w-80) + ChatWindow (flex-1)
- [ ] Back button HIDDEN (md:hidden)
- [ ] Selecting thread updates ChatWindow inline (không full-screen switch)
- [ ] Bubbles max-width 75%

### Desktop (1440px)
- [ ] Side-by-side same as hiện tại
- [ ] Back button HIDDEN
- [ ] Bubbles max-width 65%
- [ ] ProfileDashboard Sidebar hiện bên trái
- [ ] KHÔNG regression

### Edge cases
- [ ] Empty inbox → empty state message full-width
- [ ] No thread selected (desktop) → placeholder/empty chat
- [ ] Real-time message received while on mobile inbox → badge updates
- [ ] Navigate away from /messages → state reset on return
- [ ] Browser back button behavior: chat → inbox (nếu dùng pushState)

---

## Implementation Notes

### URL state (optional, recommended):
Thay vì chỉ dùng local state, có thể dùng URL search params:
```
/messages           → inbox view
/messages?thread=123 → chat view
```

**Pro:** Browser back button hoạt động tự nhiên (chat → inbox)
**Con:** Thêm complexity, cần sync state với URL

**QUYẾT ĐỊNH:** Dùng local state cho v1. URL state là enhancement cho sau.

### Animation:
- Mobile switch: **NO animation** — instant switch giữa inbox ↔ chat
- Lý do: Messaging cần feel instant, animation giữa views feels slow
- Exception: nếu muốn, thêm `translate-x` slide riêng — nhưng KHÔNG priority

### Realtime considerations:
- Khi user đang ở mobile inbox view và nhận message mới:
  - ThreadCard badge update ✅ (socket event → state update)
  - KHÔNG auto-switch sang chat view
- Khi user đang ở mobile chat view và nhận message trên thread khác:
  - Không thấy trực tiếp, nhưng badge counts update cho khi quay lại inbox

### Prop drilling vs context:
- `onSelectThread`, `onBack`, `showBackButton` — simple prop drilling đủ
- MessagesPage là parent duy nhất — không cần Context cho messaging state
- Nếu sau này cần complex state → Zustand store for messaging
