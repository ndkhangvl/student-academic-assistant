import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatbotApi from "@/api/ChatbotApi";

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
    } catch (err) {
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
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-full max-w-md bg-background rounded-xl shadow-lg flex flex-col h-[600px] justify-center border border-border">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-xl text-lg font-semibold flex items-center gap-2">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".1" />
            <path
              d="M11.293 17.293l-1.293 1.293a1 1 0 01-1.414 0l-2.293-2.293a1 1 0 010-1.414l1.293-1.293M11 14v4h4a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h3m2-10h2M9 6h6"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Chat Bot
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-card">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm
                ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <form
          className="flex gap-2 px-4 py-3 bg-background border-t rounded-b-xl"
          onSubmit={handleSend}
        >
          <Input
            type="text"
            className="flex-1"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Gửi
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
