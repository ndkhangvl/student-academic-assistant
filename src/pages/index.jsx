import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatbotApi from "@/api/ChatbotApi";
import ReactMarkdown from "react-markdown";
import removeAccents from "remove-accents";

const Index = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hàm kiểm tra câu chào nâng cao
  const isGreeting = (text) => {
    if (!text) return false;

    let normalized = text.toLowerCase().trim();
    normalized = removeAccents(normalized);
    normalized = normalized.replace(/[!?.]/g, "");

    // Nếu câu quá dài hoặc chứa từ chuyên môn → không phải lời chào
    const informativeWords = [
      "cach",
      "lam",
      "viet",
      "trinh bay",
      "huong dan",
      "vi du",
      "la gi",
      "nghia la",
      "the nao",
      "khi",
      "bai",
    ];
    if (informativeWords.some((w) => normalized.includes(w))) return false;

    // Các mẫu chào thực tế
    const greetingPatterns = [
      /\b(xin\s*)?chao\b/,
      /\bchao\s*(ban|ai|anh|chi|em)?\b/,
      /\bhello\b/,
      /\bhi\b/,
      /\bhey\b/,
      /\balo\b/,
      /\bco\s*ai\s*khong\b/,
      /\bgood\s*(morning|afternoon|evening)\b/,
    ];

    // Nếu câu dài quá 6 từ → cũng không coi là chào
    const wordCount = normalized.split(/\s+/).length;
    if (wordCount > 6) return false;

    return greetingPatterns.some((pattern) => pattern.test(normalized));
  };

  // 💬 Hàm kiểm tra câu cảm ơn
  const isThankYou = (text) => {
    if (!text) return false;
    let normalized = removeAccents(text.toLowerCase().trim());
    normalized = normalized.replace(/[!?.]/g, "");

    const thankPatterns = [
      /\bcam\s*on\b/,
      /\bthank(s| you)?\b/,
      /\bcam on nhieu\b/,
      /\bcam on ban\b/,
      /\bcam on nhe\b/,
      /\bthanks a lot\b/,
      /\bthank u\b/,
    ];

    // nếu có thêm nội dung chuyên môn -> không phải cảm ơn
    const informativeWords = [
      "cach",
      "lam",
      "huong dan",
      "vi du",
      "la gi",
      "bai",
      "trinh bay",
    ];
    if (informativeWords.some((w) => normalized.includes(w))) return false;

    const wordCount = normalized.split(/\s+/).length;
    if (wordCount > 8) return false;

    return thankPatterns.some((pattern) => pattern.test(normalized));
  };

  const handleSend = async (e, forcedText = null) => {
    if (e) e.preventDefault();

    const textToSend = forcedText ?? input.trim();
    if (textToSend === "" || isLoading) return;

    const userMessage = { from: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (isGreeting(textToSend)) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Xin chào! 😊 Tôi là trợ lý học vụ ảo của Đại học Cần Thơ. Rất vui được hỗ trợ bạn hôm nay!",
        },
      ]);
      setIsLoading(false);
      return;
    }

    if (isThankYou(textToSend)) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Rất vui vì đã giúp được bạn! 😊 Chúc bạn học tập thật tốt nhé!",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Vui lòng chờ trong giây lát", isLoading: true },
      ]);

      const response = await ChatbotApi.ask(textToSend);

      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          {
            from: "bot",
            text: response.answer || "Xin lỗi, đã có lỗi xảy ra.",
          },
        ];
      });
    } catch {
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          { from: "bot", text: "Xin lỗi, đã có lỗi xảy ra." },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };


  const sendSuggestion = async (text) => {
  if (isLoading) return;

  setInput(text);

  setTimeout(() => {
    document.getElementById("chat-input").focus();
    handleSend(null, text);
  }, 50);
};

  const suggestions = [
    "Quy chế học vụ có những nội dung gì?",
    "Điều kiện xét tốt nghiệp của CTU là gì?",
    "Lộ trình học của tôi bị trễ thì xử lý thế nào?"
  ];
  return (
    <>
      <header className="w-full bg-white/70 backdrop-blur border-b border-border fixed top-0 left-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <a
            href="https://www.ctu.edu.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <img
              src="/Logo_Dai_hoc_Can_Tho.png"
              className="w-10 h-10 rounded"
            />
            Đại học Cần Thơ
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a
              href="https://www.ctu.edu.vn/"
              target="_blank"
              className="hover:text-blue-600"
            >
              Trang chủ
            </a>
            <a
              href="https://www.ctu.edu.vn/gioithieu.html"
              target="_blank"
              className="hover:text-blue-600"
            >
              Giới thiệu
            </a>
            <a
              href="https://tuyensinh.ctu.edu.vn/"
              target="_blank"
              className="hover:text-blue-600"
            >
              Tuyển sinh
            </a>
            <a
              href="https://www.ctu.edu.vn/tin-tuc-su-kien.html"
              target="_blank"
              className="hover:text-blue-600"
            >
              Tin tức
            </a>
          </nav>
        </div>
      </header>

      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative pt-20"
        style={{
          backgroundImage: "url('/RLC1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div
          className="relative desktop:w-3/4 w-full max-w-4xl bg-background rounded-xl shadow-lg flex flex-col h-[600px]  justify-center border"
          style={{ borderColor: "#1f5ca9" }}
        >
          <div
            className="text-white px-4 py-3 rounded-t-xl text-lg font-semibold flex items-center gap-2"
            style={{ backgroundColor: "#1f5ca9" }}
          >
            <img
              src="/Logo_Dai_hoc_Can_Tho.png"
              alt="CTU Logo"
              className="w-7 h-7 rounded"
            />
            <i>Trợ lý học vụ - Đại học Cần Thơ</i>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-card">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.from === "bot" && (
                  <img
                    src="/avt.jpg"
                    alt="Bot Avatar"
                    className="w-8 h-8 rounded-full border object-cover"
                  />
                )}

                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ml-2`}
                  style={{
                    backgroundColor: msg.from === "bot" ? "#1f5ca9" : "#00afef",
                    color: "white",
                  }}
                >
                  {msg.isLoading ? (
                    <span className="animate-pulse">
                      {msg.text} {" "}
                      <span className="inline-block w-3 text-center animate-bounce">...</span>
                    </span>
                  ) : (
                    msg.from === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 py-3 flex gap-3 flex-wrap">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => sendSuggestion(s)}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2 px-4 py-3 bg-background border-t rounded-b-xl"
            onSubmit={handleSend}
          >
            <Input
              id="chat-input"
              type="text"
              className="flex-1"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#1f5ca9",
                color: "white",
              }}
            >
              Gửi
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Index;
