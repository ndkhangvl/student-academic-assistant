import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatbotApi from "@/api/ChatbotApi";
import ReactMarkdown from "react-markdown";

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { from: "bot", text: "Vui lòng chờ trong giây lát" },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await ChatbotApi.ask(input);
      setMessages((prev) => {
        // Remove the last "Vui lòng chờ..." message then add the real response.
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
          <img src="/Logo_Dai_hoc_Can_Tho.png" className="w-10 h-10 rounded" />
          Đại học Cần Thơ
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="https://www.ctu.edu.vn/" target="_blank" className="hover:text-blue-600">Trang chủ</a>
          <a href="https://www.ctu.edu.vn/gioithieu.html" target="_blank" className="hover:text-blue-600">Giới thiệu</a>
          <a href="https://tuyensinh.ctu.edu.vn/" target="_blank" className="hover:text-blue-600">Tuyển sinh</a>
          <a href="https://www.ctu.edu.vn/tin-tuc-su-kien.html" target="_blank" className="hover:text-blue-600">Tin tức</a>
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
        className="relative w-3/4 max-w-4xl bg-background rounded-xl shadow-lg flex flex-col h-[600px] justify-center border"
        style={{ borderColor: "#1f5ca9" }}
      >
        <div
          className="text-white px-4 py-3 rounded-t-xl text-lg font-semibold flex items-center gap-2"
          style={{ backgroundColor: "#1f5ca9" }}
        >
          <img src="/Logo_Dai_hoc_Can_Tho.png" alt="CTU Logo" className="w-7 h-7 rounded" />
          <i>Trợ lý học vụ - Đại học Cần Thơ</i>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-card">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              {msg.from === "bot" && (
                <img src="/avt.jpg" alt="Bot Avatar" className="w-8 h-8 rounded-full border object-cover" />
              )}

              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm ml-2`}
                style={{
                  backgroundColor: msg.from === "bot" ? "#1f5ca9" : "#00afef",
                  color: "white",
                }}
              >
                {msg.from === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <form className="flex gap-2 px-4 py-3 bg-background border-t rounded-b-xl" onSubmit={handleSend}>
          <Input
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
