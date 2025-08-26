import { useState, useEffect } from "react";

const [data, setData] = useState([])

  // 呼叫 API 取得資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/product')
        const result = await response.json() 
        if (result.status === 'success') {
          setData(result.data.shop)
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }
    }
    fetchData()
  }, [])  