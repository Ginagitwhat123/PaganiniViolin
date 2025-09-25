import axios from 'axios'
import { apiBaseUrl } from '@/configs'

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 8000,
})

// 設定攔截器，自動加上 Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') // 從 localStorage 取出 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// fetcher for swr
export const fetcher = (url) => axiosInstance.get(url).then((res) => res.data)
// export const fetchWithToken = (url, token) => 
//   axiosInstance.get(url, {
//     headers: { Authorization: `Bearer ${token}` }
//   }).then((res) => res.data)

export const fetcherWithObject = ({ url, args }) => {
  const extraParams = new URLSearchParams(args)
  const andSymbol = extraParams.toString() ? '&' : ''

  const combinedUrl = url + andSymbol + extraParams.toString()

  console.log(combinedUrl)

  axiosInstance.get(combinedUrl).then((res) => res.data)
}

export default axiosInstance
