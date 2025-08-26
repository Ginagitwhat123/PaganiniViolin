import React, { useState, useEffect } from 'react'
import styles from '@/styles/coupon.module.scss'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Coupon from '@/components/coupon/coupon'
import { useAuth } from '@/hooks/use-auth';

const CouponPage = () => {
  const [data, setData] = useState([])
  const [claimedCoupons, setClaimedCoupons] = useState([])
  const [couponCode, setCouponCode] = useState('');
  const router = useRouter();

  // 確認是否登入
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

  // 加載所有優惠券資料
  const fetchAllCoupons = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/coupon')
      const result = await response.json()
      if (result.status === 'success') {
        setData(result.data.coupon)
      }
    } catch (error) {
      console.error('Error fetching all coupons:', error)
    }
  }

  // 獲取會員已領取的優惠券
  const fetchClaimedCoupons = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/mycoupons', {
        credentials: 'include',
       
      })
      const result = await response.json()
      setClaimedCoupons(result.data || [])
    } catch (error) {
      console.error('Error fetching claimed coupons:', error)
    }
  }

  useEffect(() => {
    fetchAllCoupons()
    fetchClaimedCoupons()
  }, [])

  useEffect(() => {
  }, [data, claimedCoupons])

  // 過濾 object 欄位為 1 的優惠券
  // 把 claimedCoupons 的 coupon_id 收集到一個 Set 中
const claimedCouponIds = new Set(claimedCoupons.map(claimed => claimed.coupon_id))

// 使用 Set 來過濾來顯示有效期限內的優惠券
const today = new Date()
const filteredCoupons = data.filter(
  coupon => coupon.object === 1 && 
  !claimedCouponIds.has(coupon.id)&&
  new Date(coupon.start_date) <= today &&
  new Date(coupon.end_date) >= today
)
// 處理優惠券領取成功
const handleCouponClaimed = (couponId) => {
  setClaimedCoupons([...claimedCoupons, { coupon_id: couponId }])
}

// 搜尋領取優惠券
const handleClaimClick = async () => {
  if (!auth.isAuth) {
    await showLoginAlert();
    return;
  }
  try {
    const response = await fetch('http://localhost:3005/api/mycoupons/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code: couponCode }),
    });
    const result = await response.json();

    if (result.status === 'duplicate') {
      Swal.fire({
        icon: 'warning',
        title: '已領取過囉！',
        text: '你已經領取過此張優惠券，可至會員中心查看！',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      });
      return;
    }

    if (result.status === 'error') {
      Swal.fire({
        icon: "error",
        title: '優惠券代碼有誤',
        text: '請確認優惠券代碼是否輸入正確',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      });
      return;
    }

    

    handleCouponClaimed(result.coupon.id);
    Swal.fire({
      icon: 'success',
      title: '領取成功\^ ^/',
      text: '優惠券領取成功，將跳轉至會員中心！',
      customClass: {
        title: 'swal2-custom-title', // 自定義標題樣式
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
      },
    }).then(() => {
      router.push('/member-center/mycoupons');
    });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    Swal.fire({
      icon: 'error',
      title: '領取失敗Q_Q',
      text: '領取優惠券失敗，請稍後再試',
      customClass: {
        title: 'swal2-custom-title', // 自定義標題樣式
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
      },
    });
  }
};
  
  return (

    <div className="container">
      <div className={`d-flex flex-column align-items-center ${styles.title}`}>
        <h3>優惠券專區</h3>
        <p>每筆訂單可使用一筆折扣，更多詳情請參考優惠券</p>
        <div className={`fontDarkBrown ${styles['search']}`}>
          <input
            type="text"
            placeholder="請輸入優惠券代碼"
            className={styles.code}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className="btn" onClick={handleClaimClick}>領取</button>
        </div>
      </div>
      <hr />
      <div className="coupon">
        <div className="row">
            <Coupon coupons={filteredCoupons} onCouponClaimed={handleCouponClaimed} />
        </div>
      </div>
    </div>
  )
}

export default CouponPage

