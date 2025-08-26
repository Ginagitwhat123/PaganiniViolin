import React, { useState, useContext, createContext, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/use-auth'

const OrderCouponContext = createContext(null)

export const OrderCouponProvider = ({ children }) => {
  // 訂單詳情
  const [totalQuantity, setTotalQuantity] = useState(0) 
  const [totalPrice, setTotalPrice] = useState(0) // 儲存總金額計算結果
  const [coupon_id, setCoupon_id] = useState(null)
  const [discountedPrice, setDiscountedPrice] = useState(0) // 折扣後總金額
  const { auth } = useAuth()

  // 取得購物車勾選商品數的函式
  const fetchCheckedCount = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/cart/checkedCount', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      if (result.status === 'success') {
        const cartCheckedCount = result.data.checkedCount
        setTotalQuantity(cartCheckedCount) // 將 API 數據設為 totalQuantity 的初始值
      } else {
        handleError('無法取得購物車數量')
      }
    } catch (error) {
      handleError('無法取得購物車數量，請稍後再試', error)
    }
  }

  // 處理錯誤的共用函式
  const handleError = (message, error = null) => {
    if (error) console.error(message, error)
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: message,
      customClass: {
        title: 'swal2-custom-title',
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button',
      },
    })
  }

  // 重置所有狀態值
  const resetState = () => {
    setTotalQuantity(null)
    setTotalPrice(0)
    setCoupon_id(null)
    setDiscountedPrice(0)
  }

  // 使用 useEffect 處理狀態初始化與清空
  useEffect(() => {
    if (auth?.isAuth) {
      // 當使用者登入時取得購物車數據
      fetchCheckedCount()
    } else {
      // 當使用者登出時清空狀態
      resetState()
    }
  }, [auth?.isAuth]) // 監聽 `auth.isAuth` 的變化

  return (
    <OrderCouponContext.Provider
      value={{
        coupon_id,
        setCoupon_id,
        totalQuantity,
        setTotalQuantity,
        totalPrice,
        setTotalPrice,
        discountedPrice,
        setDiscountedPrice,
      }}
    >
      {children}
    </OrderCouponContext.Provider>
  )
}

export const useOrderCoupon = () => {
  const context = useContext(OrderCouponContext)
  if (!context) {
    throw new Error('useOrderCoupon 必須在 OrderCouponProvider 中使用')
  }
  return context
}
