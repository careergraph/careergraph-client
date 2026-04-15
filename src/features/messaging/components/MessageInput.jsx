import { useCallback, useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";

const MAX_TEXTAREA_HEIGHT = 140;
const TYPING_STOP_DELAY = 2800;

export function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
}) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      onTypingStop?.();
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [onTypingStop]);

  const resizeTextarea = useCallback(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      MAX_TEXTAREA_HEIGHT
    )}px`;
  }, []);

  const scheduleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      stopTyping();
    }, TYPING_STOP_DELAY);
  }, [stopTyping]);

  const handleChange = useCallback(
    (nextValue) => {
      setValue(nextValue);
      resizeTextarea();

      const hasMeaningfulContent = nextValue.trim().length > 0;

      if (hasMeaningfulContent && !isTypingRef.current) {
        onTypingStart?.();
        isTypingRef.current = true;
      }

      if (!hasMeaningfulContent) {
        stopTyping();
        return;
      }

      scheduleTypingStop();
    },
    [onTypingStart, resizeTextarea, scheduleTypingStop, stopTyping]
  );

  const submitMessage = useCallback(async () => {
    const payload = value.trim();

    if (!payload || disabled || isSending) {
      return;
    }

    setIsSending(true);
    stopTyping();

    try {
      const sent = await onSend(payload);

      if (sent) {
        setValue("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.focus();
        }
      }
    } finally {
      setIsSending(false);
    }
  }, [disabled, isSending, onSend, stopTyping, value]);

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  useEffect(() => {
    if (!window.visualViewport) {
      return;
    }

    const viewport = window.visualViewport;

    const updateKeyboardInset = () => {
      const inset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      );

      setKeyboardInset(inset > 60 ? inset : 0);
    };

    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    updateKeyboardInset();

    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
    };
  }, []);

  return (
    <div
      className="border-t border-slate-200 bg-white px-3 pt-2"
      style={{
        paddingBottom: `calc(env(safe-area-inset-bottom) + ${keyboardInset}px)`,
      }}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submitMessage();
            }
          }}
          placeholder={placeholder}
          className="min-h-11 max-h-35 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          disabled={disabled || isSending}
        />

        <Button
          type="button"
          className="h-11 min-w-11 shrink-0 rounded-xl px-3"
          onClick={() => {
            void submitMessage();
          }}
          disabled={disabled || isSending || value.trim().length === 0}
        >
          <SendHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Gửi</span>
        </Button>
      </div>
    </div>
  );
}

export default MessageInput;
