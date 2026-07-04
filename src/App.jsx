import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // store chat messages
  const [showDropdown, setShowDropdown] = useState(false); // for + button dropdown
  const [popupMessage, setPopupMessage] = useState(""); // popup text
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const [awaitingLevel, setAwaitingLevel] = useState(false); // waiting for level selection
  const [uploadedScreenshot, setUploadedScreenshot] = useState(null); // store uploaded file
  const [loading, setLoading] = useState(false); // bot typing indicator
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Handle normal chat send
  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");

    if (textareaRef.current) textareaRef.current.focus();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { text: data.reply || "No response from server", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching Azure response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Error Azure API is not Connected Properly", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle screenshot upload
  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedScreenshot(file); // store uploaded file
    setAwaitingLevel(true); // show level selection popup
    setPopupMessage("Screenshot uploaded successfully! Choose explanation level.");
    setPopupType("success");

    setTimeout(() => setPopupMessage(""), 2000);
    e.target.value = "";
  };

  // Handle level selection
  const handleLevelSelect = async (level) => {
    if (!uploadedScreenshot) return;

    setAwaitingLevel(false);
    const formData = new FormData();
    formData.append("screenshot", uploadedScreenshot);
    formData.append("level", level);

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-screenshot`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.gptReply || "No GPT response", sender: "bot" },
      ]);
    } catch (err) {
      console.error(err);
      setPopupMessage("Error analyzing screenshot");
      setPopupType("error");
      setTimeout(() => setPopupMessage(""), 2000);
    } finally {
      setLoading(false);
      setUploadedScreenshot(null);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-x-hidden">
      {/* Top popup message */}
      {popupMessage && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-4xl shadow-lg z-50 ${
            popupType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {popupMessage}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Azure ChatGPT
            </h1>
            <p className="text-gray-400 text-lg">How can I help you today?</p>
          </div>

          {/* Input Box (centered for welcome) */}
          <div className="flex justify-center w-full p-2">
            <div className="relative w-full max-w-3xl flex items-center">
              {/* Plus Button */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className="absolute left-1 flex items-center justify-center 
                             text-gray-400 hover:text-gray-200 hover:bg-zinc-700 rounded-full w-10 h-10 text-xl transform hover:scale-105 -translate-y-5"
                >
                  <span className="flex items-center justify-center w-full h-full">+</span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute -top-20 left-5 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50 w-48">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      onClick={() => document.getElementById("screenshotInput").click()}
                    >
                      Upload Screenshot
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  id="screenshotInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
              </div>

              {/* Expandable Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=" Type your message..."
                className="w-full max-w-3xl pl-13 pr-20 py-3 rounded-4xl border border-zinc-700 
                         bg-zinc-900 text-white placeholder-gray-400 
                         focus:outline-none focus:ring-1 focus:ring-gray-500
                         resize-none overflow-hidden"
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                className="absolute right-1 flex items-center justify-center 
                           bg-white text-black rounded-full w-10 h-10 transform hover:scale-105"
              >
                <ArrowUpIcon className="w-5 h-5 rotate-360"/>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // After first message -> Chat mode
        <div className="flex flex-col flex-1">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-lg w-fit break-words whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-zinc-700 text-white self-end ml-auto"
                    : "bg-zinc-800 text-gray-200 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Bot typing spinner bubble */}
            {loading && (
              <div className="p-3 rounded-2xl max-w-lg w-fit bg-black text-gray-200 self-start mr-auto flex items-center space-x-2">
                <div className="w-5 h-5 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                <span>Bot is typing...</span>
              </div>
            )}

            {/* Auto scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box (stuck to bottom) */}
          <div className="flex justify-center w-full p-2">
            <div className="relative w-full max-w-3xl flex items-center">
              {/* Plus Button */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className="absolute left-1 flex items-center justify-center 
                             text-gray-400 hover:text-gray-200 hover:bg-zinc-700 rounded-full w-10 h-10 text-xl transform hover:scale-105 -translate-y-5"
                >
                  <span className="flex items-center justify-center w-full h-full">+</span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute -top-20 left-5 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-lg z-50 w-48 text-white">
                    <button
                      className="w-full text-center px-4 py-2 hover:bg-zinc-700 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-2xl"
                      onClick={() => document.getElementById("screenshotInput").click()}
                    >
                      Upload Screenshot
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  id="screenshotInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
              </div>

              {/* Expandable Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=" Type your message..."
                className="w-full max-w-3xl pl-13 pr-20 py-3 rounded-4xl border border-zinc-700 
                         bg-zinc-900 text-white placeholder-gray-400 
                         focus:outline-none focus:ring-1 focus:ring-gray-500
                         resize-none overflow-hidden"
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                className="absolute right-1 flex items-center justify-center 
                           bg-white text-black rounded-full w-10 h-10 transform hover:scale-105"
              >
                <ArrowUpIcon className="w-5 h-5 rotate-360"/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level selection popup */}
      {awaitingLevel && (
        <div className="fixed bottom-40 left-1/2 transform -translate-x-1/2 bg-zinc-900 p-4 rounded-xl shadow-lg z-50 flex space-x-4  hover:shadow-zinc-800">
          <button
            className="bg-blue-600 px-3 py-2 rounded-4xl hover:bg-blue-500 shadow-xs hover:shadow-blue-500 font-semibold"
            onClick={() => handleLevelSelect(1)}
          >
            Answer Only
          </button>
          <button
            className="bg-green-600 px-3 py-2 rounded-4xl hover:bg-green-500 shadow-xs hover:shadow-green-500 font-semibold"
            onClick={() => handleLevelSelect(2)}
          >
            One Sentence
          </button>
          <button
            className="bg-purple-600 px-3 py-2 rounded-4xl hover:bg-purple-500 shadow-xs hover:shadow-purple-500 font-semibold"
            onClick={() => handleLevelSelect(3)}
          >
            Detailed
          </button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <footer className="text-gray-500 font-semibold text-sm">
          ChatGPT can make mistakes. Check important info.
        </footer>
      </div>
    </div>
  );
};

export default App;
