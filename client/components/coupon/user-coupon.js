import React, { useState, useEffect } from 'react'
import styles from './user-coupon.module.scss'

const Coupon = ({ coupons }) => {
  const formatDiscount = (type, value) => {
    if (type === 1) {
      return `${value} 元`
    } else if (type === 2) {
      const formattedValue = value.toString().replace(/0/g, '')
      return `${formattedValue} 折`
    } else {
      return '未知折扣類型'
    }
  }

  return (
    <>
      {coupons.map((coupon, index) => (
        <div className={`col-md-6 fontDarkBrown ${styles['coupon']}`}>
          <div
            key={index}
            className={`${styles['coupon-item']}  position-relative `}
          >
            <div className={styles['coupon-left']}>
              <h6 className={`h6Bold ${styles['coupon-title']}`}>
                {coupon.name}
              </h6>
              <div className={`${styles['coupon-info']}`}>
              <p className={`web-16px-M`}>
                {coupon.info}
                {/* {coupon.info.length > 18 ? `${coupon.info.substring(0, 10)}...` : coupon.info} */}
              </p>
              </div>
              <p className={`p-14pt-B ${styles['exp-date']}`}>
                {`有效期限：${
                  coupon.end_date === '0000-00-00' || coupon.end_date === null
                    ? coupon.expiration_date
                    : coupon.end_date
                }`}
              </p>
            </div>
            <div className={styles['coupon-right']}>
              <div className={`h5Bold ${styles['discount']}`}>
                {formatDiscount(coupon.type, coupon.value)}
              </div>
              <div className={`p-14pt-M ${styles['coupon-label']}`}>優惠碼</div>
              <div className={`p-14pt-B ${styles['code-code']}`}>
                {coupon.sid}
              </div>
            </div>
            {coupon.status === 3 && (
              <>
                <div className={styles['overlay']}></div>
                <div className={styles['stamp']}>
                  <img src="/images/coupon/used.png" alt="已使用" />
                </div>
              </>
            )}
            {coupon.status === 4 && (
              <>
              <div className={styles['overlay']}></div>
              <div className={styles['stamp']}>
                <img src="/images/coupon/expired.png" alt="已失效" />
              </div>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default Coupon
