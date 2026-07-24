import axios from 'axios'
import { getToken, getTeacherToken } from './session.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach the right JWT token depending on which portal the request is for
api.interceptors.request.use((config) => {
  const isTeacherRequest = (config.url || '').includes('/teacher')
  const token = isTeacherRequest ? getTeacherToken() : getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
