import { useState, useRef, useEffect } from "react"

const Index = () => {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
    ])
    const [input, setInput] = useState("")
    const messageEndRef = useRef(null)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (input.trim() === "") return
        setMessages([
            ...messages,
            { from: "user", text: input }
        ])
        setInput("")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
                {/* Header */}
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl text-lg font-semibold flex items-center gap-2">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".1" /><path d="M11.293 17.293l-1.293 1.293a1 1 0 01-1.414 0l-2.293-2.293a1 1 0 010-1.414l1.293-1.293M11 14v4h4a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h3m2-10h2M9 6h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Chat Bot
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 max-w-[70%] text-sm
                ${msg.from === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-900"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
                <form
                    className="flex gap-2 px-4 py-3 bg-white border-t rounded-b-xl"
                    onSubmit={handleSend}
                >
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập tin nhắn..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Index
