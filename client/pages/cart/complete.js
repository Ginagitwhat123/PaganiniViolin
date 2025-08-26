import React, { useRef, useEffect, useState } from 'react'
import styles from './cart.module.scss'
import Router from 'next/router'

function complete() {
  // ----- API 請求 -----
  // 設定讀取資料內容
  const [lastOrder, setLastOrder] = useState('')

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/orders/last`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.status === 'success') {
        console.log(result.data[0].order_code) // 確認抓到的資料內容
        setLastOrder(result.data[0].order_code) // 將資料設置到 data 狀態中
      }
    } catch (error) {
      console.error('無法取得資料:', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法取得進行中訂單資料，請稍後再試。',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const gotoproduct = () => {
    Router.push('/product')
  }

  const gotomyorders = () => {
    Router.push('/member-center/myorders')
  }

  // ----- 組件渲染 -----
  return (
    <div className={`${styles.minHeight} container my-5 fontDarkBrown`}>
      <div className="row align-items-start">
        {/* 標題區塊 */}
        <div className="col-12 col-md-auto mb-3 mb-md-0">
          <h4 className="h4Bold">購物車</h4>
        </div>

        {/* 步驟區塊 */}
        <div className="col">
          <div className="row">
            <div className="col-12 col-md-auto">
              <p className={`${styles.disabled} web-16px-B`}>
                <span className={`${styles.step}`}>01</span> 購物清單
              </p>
            </div>
            <div className="col-12 col-md-auto">
              <p className={`${styles.disabled} web-16px-B`}>
                <span className={`${styles.step}`}>02</span>
                填寫購買資料並付款
              </p>
            </div>
            <div className="col-12 col-md-auto">
              <p className="web-16px-B">
                <span className={`${styles.step} ${styles.focus}`}>03</span>{' '}
                訂單完成
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 表單和訂單明細 */}
      <div className={`${styles.bg} text-center fontDarkBrown`}>
        <h6 className="h6Bold mb-3">訂單成立，感謝您的訂購!</h6>
        <h6 className="mb-3">訂單編號: {lastOrder}</h6>
        <button className="btn btn-primary me-md-2" onClick={gotoproduct}>
          繼續選購
        </button>
        <button className="btn" onClick={gotomyorders}>
          前往訂單查詢
        </button>
      </div>
    </div>
  )
}

export default complete
