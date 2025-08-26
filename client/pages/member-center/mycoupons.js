import React, { useEffect, useState } from 'react'
import MemberCenterLayout from '@/components/MemberCenter/MemberCenterLayout'
import tabStyle from './tab.module.scss'
import UserCoupon from '@/components/coupon/user-coupon'
import Swal from 'sweetalert2'
import styles from '@/styles/member-center/mycoupons.module.scss'

// 每個 Tab 的內容子元件
function AllCoupons({ coupons }) {
  // 把已使用和已失效的優惠券排在後面
  const sortedCoupons = [...coupons].sort((a, b) => {
    const priorityA =
      a.status === 2 ? 0 : a.status === 3 || a.status === 4 ? 2 : 1
    const priorityB =
      b.status === 2 ? 0 : b.status === 3 || b.status === 4 ? 2 : 1
    return priorityA - priorityB
  })

  return (
    <div className={`${tabStyle.tabContent}`}>
      <div className={`${tabStyle.scroll}`}>
        <div className={`row ${styles['area']}`}>
          <UserCoupon coupons={sortedCoupons} />
        </div>
      </div>
    </div>
  )
}

function UnusedCoupons({ coupons }) {
  return (
    <div className={`${tabStyle.tabContent}`}>
      <div className={`${tabStyle.scroll}`}>
        <div className={`row ${styles['area']}`}>
          <UserCoupon coupons={coupons} />
        </div>
      </div>
    </div>
  )
}

function UsedCoupons({ coupons }) {
  return (
    <div className={`${tabStyle.tabContent}`}>
      <div className={`${tabStyle.scroll}`}>
        <div className={`row ${styles['area']}`}>
          <UserCoupon coupons={coupons} />
        </div>
      </div>
    </div>
  )
}

function ExpiredCoupons({ coupons }) {
  return (
    <div className={`${tabStyle.tabContent}`}>
      <div className={`${tabStyle.scroll}`}>
        <div className={`row ${styles['area']}`}>
          <UserCoupon coupons={coupons} />
        </div>
      </div>
    </div>
  )
}

function Tabs() {
  // 分頁切換狀態
  const [activeTab, setActiveTab] = useState('tab1')
  // 會員優惠券資料
  const [coupons, setCoupons] = useState([])
  const [claimedCoupons, setClaimedCoupons] = useState([])
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/mycoupons`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        if (result.status === 'success') {
          setCoupons(result.data) // 將資料設置到 data 狀態中
          console.log(result.data) // 確認抓到的資料內容
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }
    }
    fetchData()
  }, [])

  // 處理優惠券領取成功
  const handleCouponClaimed = (couponId) => {
    setClaimedCoupons([...claimedCoupons, { coupon_id: couponId }])
  }

  // 搜尋領取優惠券
  const handleClaimClick = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/mycoupons/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code: couponCode }),
        }
      )
      const result = await response.json()

      if (result.status === 'duplicate') {
        Swal.fire({
          icon: 'warning',
          title: '已領取過囉！',
          text: '你已經領取過此張優惠券囉！',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
        return
      }

      if (result.status === 'error') {
        Swal.fire({
          icon: 'error',
          title: '優惠券代碼有誤',
          text: '請確認優惠券代碼是否輸入正確',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
        return
      }

      handleCouponClaimed(result.coupon.id)
      Swal.fire({
        icon: 'success',
        title: '領取成功^ ^/',
        text: '優惠券領取成功！',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    } catch (error) {
      console.error('Error claiming coupon:', error)
      Swal.fire({
        icon: 'error',
        title: '領取失敗Q_Q',
        text: '領取優惠券失敗，請稍後再試',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  // 過濾 status 欄位為 2-未使用 的優惠券
  const unusedCoupons = coupons.filter((coupon) => coupon.status === 2)
  // 過濾 status 欄位為 3-已使用 的優惠券
  const usedCoupons = coupons.filter((coupon) => coupon.status === 3)
  // 過濾 status 欄位為 4-已失效 的優惠券
  const expiredCoupons = coupons.filter((coupon) => coupon.status === 4)

  // 根據 activeTab 狀態顯示對應的內容
  const renderContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <AllCoupons coupons={coupons} />
      case 'tab2':
        return <UnusedCoupons coupons={unusedCoupons} />
      case 'tab3':
        return <UsedCoupons coupons={usedCoupons} />
      case 'tab4':
        return <ExpiredCoupons coupons={expiredCoupons} />
      default:
        return null
    }
  }

  return (
    <MemberCenterLayout>
      <div className="container">
        <div className="d-flex">
          <input
            type="text"
            placeholder="請輸入優惠券代碼"
            className={styles.code}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button className={styles.btn} onClick={handleClaimClick}>
            領取
          </button>
        </div>
        <div className={`${tabStyle.tabBtns}`}>
          <button
            onClick={() => setActiveTab('tab1')}
            className={activeTab === 'tab1' ? tabStyle.active : ''}
          >
            全部
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={activeTab === 'tab2' ? tabStyle.active : ''}
          >
            未使用
          </button>
          <button
            onClick={() => setActiveTab('tab3')}
            className={activeTab === 'tab3' ? tabStyle.active : ''}
          >
            已使用
          </button>
          <button
            onClick={() => setActiveTab('tab4')}
            className={activeTab === 'tab4' ? tabStyle.active : ''}
          >
            已失效
          </button>
        </div>
        <div>{console.log(coupons)}</div>
        <div className={`${tabStyle.tabContent}`}>{renderContent()}</div>
      </div>
    </MemberCenterLayout>
  )
}

export default Tabs
