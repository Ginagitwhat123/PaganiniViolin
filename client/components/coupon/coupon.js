import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2' // 導入 SweetAlert2
import styles from './coupon.module.scss'
import { useAuth } from '@/hooks/use-auth';

const Coupon = ({ coupons, onCouponClaimed }) => {
  const { auth } = useAuth();

  const showLoginAlert = async () => {
    await Swal.fire({
      icon: 'warning',
        title: '請先登入',
        text: '請先登入會員後再領取優惠券',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
        },
    });
};

  // 格式化折扣
  const formatDiscount = (type, value) => {
    if (type === 1) {
      return `${value}元`
    } else if (type === 2) {
      const formattedValue = value.toString().replace(/0/g, '')
      return `${formattedValue}折`
    } else {
      return '未知折扣類型'
    }
  }
  // 處理領取優惠券
  const getCoupon = async (couponId) => {
    if (!auth.isAuth) {
      await showLoginAlert();
      return;
  }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mycoupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ couponId }),
      })

      const data = await response.json();

       if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '領取成功',
          text: '已發送至您的會員中心 > 優惠券專區',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        });
        onCouponClaimed(couponId)
        // 更新會員的優惠券列表，這裡可以根據實際情況進行調整
      } else if (data.status === 'error' && data.message === '您已經領取過此優惠券') {
        Swal.fire({
          icon: 'warning',
          title: '已領取過囉！',
          text: '你已經領取過此張優惠券，可至會員中心查看！',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '領取失敗Q_Q',
          text: '領取優惠券失敗，請稍後再試',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: '發生不可預期的錯誤',
        text: '發生錯誤，請稍後再試',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
      console.error('無法取得資料:', error)
    }
  }

  return (
    <>
      {coupons.map((coupon, index) => (
        <div key={index} className='col-xxl-4 col-lg-6 col-md-6 fontDarkBrown'>
        <div
        className={`${styles['coupon-item']} d-flex justify-content-between position-relative`}
        >
          <div className={styles['coupon-left']}>
            <h6 className={`h6Bold ${styles['coupon-title']}`}>{coupon.name}</h6>
            <p className={`web-16px-B ${styles['coupon-info']}`}>
            {coupon.info}
            {/* {coupon.info.length > 18 ? `${coupon.info.substring(0, 18)}...` : coupon.info} */}
            </p>
            <p className={`p-14pt-M ${styles['exp-date']}`}>{`有效期限：${coupon.end_date}`}</p>
            <button className={`btn ${styles['collect-btn']}`} onClick={() => getCoupon(coupon.id)}>立即領取</button>
          </div>
          <div className={styles['coupon-right']}>
            <div className={`h5Bold ${styles['discount']}`}>{formatDiscount(coupon.type, coupon.value)}</div>
            <div className={`p-14pt-M ${styles['discount-code']}`}>優惠碼</div>
            <div className={`web-16px-B ${styles['code']}`}>{coupon.sid}</div>
          </div>
        </div>
        </div>
      ))}
    </>
  )
}

export default Coupon
