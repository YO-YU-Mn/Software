import { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:9000/advisor/ask";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "bot",
      text: "أهلاً بك في المستشار الأكاديمي. كيف أستطيع مساعدتك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!token) {
      setError('لم يتم العثور على التوكن. الرجاء تسجيل الدخول ثم إعادة المحاولة.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      author: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        const text = await response.text();
        const message = text || `خطأ من السيرفر: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        author: "bot",
        text: data.reply || "عذراً، لم أستطع الحصول على رد الآن.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Date.now() + 2,
        author: "bot",
        text: err.message.includes('Failed to fetch')
          ? 'تعذر الوصول إلى السيرفر. تأكد من تشغيل backend على http://localhost:9000'
          : err.message,
      };
      setError(err.message);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.wrapper}>
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div>
              <div style={styles.headerTitle}>مرشدك الأكاديمي الذكي</div>
              <div style={styles.headerSubtitle}>اسأل عن الجدول أو التسجيل أو المقررات</div>
            </div>
            <button style={styles.closeButton} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div style={styles.messages} ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={message.author === "bot" ? styles.botMessage : styles.userMessage}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div style={styles.inputRow}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا..."
              rows={2}
              style={styles.textarea}
              disabled={loading}
            />
            <button
              style={styles.sendButton}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? "جارٍ..." : "إرسال"}
            </button>
          </div>
          {error && <div style={styles.errorText}>{error}</div>}
        </div>
      )}

      <button style={styles.floatingButton} onClick={() => setOpen((value) => !value)}>
        <span style={styles.floatingButtonIcon}>🤖</span>
      </button>
      {!open && <div style={styles.floatingLabel}>مرشدك الأكاديمي الذكي</div>}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  floatingButton: {
    width: 64,
    height: 64,
    borderRadius: 999,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonIcon: {
    fontSize: 26,
    lineHeight: 1,
  },
  floatingLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    maxWidth: 140,
    backgroundColor: "rgba(255,255,255,0.98)",
    padding: "8px 12px",
    borderRadius: 18,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.18)",
  },
  chatWindow: {
    width: 400,
    maxWidth: "calc(100vw - 40px)",
    height: 560,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    boxShadow: "0 30px 60px rgba(15, 23, 42, 0.22)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: 16,
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: 800,
    fontSize: 20,
    color: "#111827",
    letterSpacing: "0.02em",
  },
  headerSubtitle: {
    fontFamily: "Inter, Arial, sans-serif",
    fontSize: 14,
    color: "#4b5563",
    marginTop: 6,
    lineHeight: 1.5,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#374151",
  },
  messages: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    backgroundColor: "#f9fafb",
  },
  botMessage: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "10px 14px",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  userMessage: {
    alignSelf: "flex-end",
    maxWidth: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 18,
    borderTopRightRadius: 4,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  inputRow: {
    borderTop: "1px solid #e5e7eb",
    padding: 16,
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  textarea: {
    flex: 1,
    resize: "none",
    minHeight: 56,
    maxHeight: 110,
    padding: 14,
    borderRadius: 18,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    outline: "none",
    fontFamily: "Inter, Arial, sans-serif",
    direction: "rtl",
    color: "#111827",
    backgroundColor: "#f8fafc",
  },
  sendButton: {
    minWidth: 100,
    padding: "14px 18px",
    borderRadius: 18,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)",
  },
  errorText: {
    padding: "0 16px 12px",
    color: "#b91c1c",
    fontSize: 13,
  },
};