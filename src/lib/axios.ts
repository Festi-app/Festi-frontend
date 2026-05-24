import axios from 'axios'
import { API_BASE } from '../constants/endpoints'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('festi_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
