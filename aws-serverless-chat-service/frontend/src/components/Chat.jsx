import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { getMessages, createMessage } from '../api'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`

const MessageBubble = styled.div`
  max-width: 70%;
  margin: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${props => props.isOwn ? '#007bff' : '#e9ecef'};
  color: ${props => props.isOwn ? 'white' : 'black'};
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`

const InputContainer = styled.form`
  display: flex;
  padding: 20px;
  border-top: 1px solid #ddd;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`

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
`

function Chat({ userId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages()
        setMessages(data)
        scrollToBottom()
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const message = await createMessage({
        message: newMessage,
        userId,
      })
      setMessages([...messages, message])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.messageId}
            isOwn={msg.userId === userId}
          >
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
  )
}

export default Chat