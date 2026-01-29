import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import { Send, GraduationCap } from "lucide-react";

const Shortlist = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "admin", text: "Welcome to your profile updates!", time: "10:00 AM" },
    { id: 2, sender: "student", text: "Thank you sir 🙏", time: "10:02 AM" },
    { id: 3, sender: "update", text: "Your course registration has been approved 🎉", time: "10:05 AM" },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "student", text: newMsg, time: "Now" },
    ]);
    setNewMsg("");
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Sidebar */}
      <ProfileCard />

      {/* Right Side Content */}
      <div className="flex-1 mt-6 md:mt-0 md:ml-6 bg-white rounded-3xl shadow-2xl p-6">
        {/* Conversation Component */}
        <div className="flex flex-col h-[500px] rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
          {/* Header */}
          <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl shadow-md">
            <div className="bg-white/20 p-2 rounded-full">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-wide">Conversation</h2>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 backdrop-blur-sm">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col items-center">
                {msg.sender === "update" ? (
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-900 px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg">
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className={`flex items-start max-w-[75%] ${
                      msg.sender === "student" ? "ml-auto justify-end" : "mr-auto justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-lg text-sm leading-relaxed transition-all duration-300 ${
                        msg.sender === "student"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                          : "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
                <span className="text-[11px] text-gray-500 mt-1 italic">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-b-3xl shadow-inner">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-none bg-gray-100 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shortlist;