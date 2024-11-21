import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { getMessages, createMessage } from "../api";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  margin: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.isOwn ? "#007bff" : "#e9ecef")};
  color: ${(props) => (props.isOwn ? "white" : "black")};
  align-self: ${(props) => (props.isOwn ? "flex-end" : "flex-start")};
`;

const InputContainer = styled.form`
  display: flex;
  padding: 20px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 초기 메시지 로딩 및 폴백
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadInitialMessages();

    // WebSocket이 끊어졌을 때만 폴링 시작
    const interval = !ws && setInterval(loadInitialMessages, 3000);
    return () => interval && clearInterval(interval);
  }, [ws]);

  // WebSocket 연결
  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket(import.meta.env.VITE_WS_URL);

      websocket.onopen = () => {
        console.log("WebSocket Connected");
        setWs(websocket);
      };

      websocket.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(null);
        // 재연결 시도
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };
    };

    connectWebSocket();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        message: newMessage,
        userId,
      };
      
      // WebSocket을 통해 메시지 전송
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(messageData));
        setNewMessage("");
        scrollToBottom();
      } else {
        console.error("WebSocket is not connected");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageBubble key={msg.messageId} isOwn={msg.userId === userId}>
            <strong>{msg.userId}</strong>: {msg.message}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </InputContainer>
    </ChatContainer>
  );
}

export default Chat;
