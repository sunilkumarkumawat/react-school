import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://socket.rusofterp.in", {
  transports: ["websocket"],
});

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const schoolId = "school_123";
  const senderId = "web_user_001";

  useEffect(() => {
    socket.emit("joinSchool", { schoolId });

    socket.on("newMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    const payload = {
      text: message,
      senderId,
      schoolId,
      receiverType: "all",
    };

    try {
      await axios.post("https://socket.rusofterp.in/api/chat/send", payload);
      socket.emit("sendMessage", payload);
      setMessage("");
    } catch (err) {
      alert("Failed to send message");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>📚 School Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender_id}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
