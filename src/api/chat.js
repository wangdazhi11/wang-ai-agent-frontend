import axios from 'axios'
import { API_BASE_URL } from '../config/env.js'

export function ping() {
  return axios.get(`${API_BASE_URL}/health`).catch(() => null)
}