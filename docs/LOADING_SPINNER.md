# LoadingSpinner Component

Component hiển thị loading animation với 3 dots bounce theo brand colors của CareerGraph (indigo → purple → pink).

## 📍 Location
`src/components/Feedback/LoadingSpinner.jsx`

## 🎯 Use Cases

### 1. Overlay Loading (Fullscreen)
Khi cần loading overlay che toàn bộ container/page:

```jsx
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";

// Trong component
{isLoading && (
  <LoadingSpinner 
    message="Đang tải dữ liệu..." 
    variant="overlay" 
  />
)}
```

**Kết quả:** Overlay fullscreen với backdrop blur, spinner ở giữa màn hình.

---

### 2. Inline Loading
Khi cần loading spinner inline trong một section:

```jsx
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";

// Trong component
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner 
        message="Đang tải thông tin..." 
        variant="inline"
        size="lg"
      />
    </div>
  );
}
```

**Kết quả:** Chỉ hiển thị spinner và message, không có backdrop.

---

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"Đang tải..."` | Text hiển thị dưới spinner |
| `variant` | `"overlay"` \| `"inline"` | `"overlay"` | Kiểu hiển thị |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Kích thước của dots |

---

## 🎨 Variants

### Overlay
```jsx
<LoadingSpinner variant="overlay" />
```
- ✅ Fullscreen backdrop với blur
- ✅ Z-index cao (z-10)
- ✅ Dùng cho: Modal loading, page loading, form submission

### Inline
```jsx
<LoadingSpinner variant="inline" />
```
- ✅ Không có backdrop
- ✅ Chỉ hiển thị spinner + message
- ✅ Dùng cho: Section loading, card loading, list loading

---

## 📏 Sizes

### Small (sm)
```jsx
<LoadingSpinner size="sm" />
```
Dots: 8px (w-2 h-2)

### Medium (md) - Default
```jsx
<LoadingSpinner size="md" />
```
Dots: 12px (w-3 h-3)

### Large (lg)
```jsx
<LoadingSpinner size="lg" />
```
Dots: 16px (w-4 h-4)

---

## 💡 Examples

### Example 1: Page Loading
```jsx
export default function JobDetailPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          message="Đang tải thông tin công việc..." 
          variant="inline"
          size="lg"
        />
      </div>
    );
  }
  
  return <div>Content...</div>;
}
```

---

### Example 2: Form Submission Overlay
```jsx
export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  
  return (
    <div className="relative">
      {submitting && (
        <LoadingSpinner 
          message="Đang đăng nhập..." 
          variant="overlay"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

---

### Example 3: PDF Preview Loading
```jsx
export default function PdfPreview() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  return (
    <div className="relative h-full">
      {isGenerating && (
        <LoadingSpinner 
          message="Đang cập nhật CV..." 
          variant="overlay"
        />
      )}
      
      <PDFViewer>...</PDFViewer>
    </div>
  );
}
```

---

### Example 4: List Loading (Small)
```jsx
export default function NotificationList() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="p-4">
        <LoadingSpinner 
          message="Đang tải thông báo..." 
          variant="inline"
          size="sm"
        />
      </div>
    );
  }
  
  return <ul>...</ul>;
}
```

---

## 🎨 Animation Details

- **Animation:** `animate-bounce` (Tailwind built-in)
- **Timing:** 
  - Dot 1: 0ms delay (indigo-600)
  - Dot 2: 150ms delay (purple-600)
  - Dot 3: 300ms delay (pink-600)
- **Colors:** Brand gradient (indigo → purple → pink)

---

## ✅ Used In

- ✅ `JobDetail.jsx` - Trang chi tiết công việc
- ✅ `PdfPreview.jsx` - CV Builder PDF preview
- 📌 Có thể dùng thêm cho: Login, Register, Profile, Upload, etc.

---

## 🔄 Migration Guide

### Before (Old code)
```jsx
<div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
<p className="mt-4 text-slate-600">Đang tải...</p>
```

### After (New component)
```jsx
<LoadingSpinner message="Đang tải..." variant="inline" size="lg" />
```

**Benefits:**
- 🎯 Consistent design across app
- 🔧 Easy to maintain and update
- 📦 Reusable và DRY principle
- 🎨 Brand colors consistency

---

Happy coding! 🚀
