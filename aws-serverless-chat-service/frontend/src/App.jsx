import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Chat from './components/Chat'
import UserSetup from './components/UserSetup'

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  const handleUserSetup = (newUserId) => {
    localStorage.setItem('userId', newUserId)
    setUserId(newUserId)
  }

  return (
    <AppContainer>
      {!userId ? (
        <UserSetup onUserSetup={handleUserSetup} />
      ) : (
        <Chat userId={userId} />
      )}
    </AppContainer>
  )
}

export default App
