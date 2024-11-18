import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const getMessages = async () => {
  const response = await axios.get(`${API_URL}/messages`)
  return response.data
}

export const createMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/messages`, messageData)
  return response.data
}