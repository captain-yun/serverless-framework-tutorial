import { useState } from 'react'
import styled from '@emotion/styled'

const SetupContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

function UserSetup({ onUserSetup }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      onUserSetup(username)
    }
  }

  return (
    <SetupContainer>
      <form onSubmit={handleSubmit}>
        <h2>Enter your username</h2>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Button type="submit">Start Chatting</Button>
      </form>
    </SetupContainer>
  )
}

export default UserSetup