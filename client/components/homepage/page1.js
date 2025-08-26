'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faUser,
  faRightFromBracket,
  faSignInAlt, // 新增的登入圖示
} from '@fortawesome/free-solid-svg-icons'
import { faSoundcloud } from '@fortawesome/free-brands-svg-icons'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/use-auth'
import styles from './page1.module.scss'
import { useRouter } from 'next/router'

export default function Page1(props) {
  const { auth, logout } = useAuth() // 取得登入狀態和登出方法

  // [購物車登入檢查]
  const handleCartClick = (e) => {
    if (!auth.isAuth) {
      e.preventDefault()
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能查看購物車。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
    }
  }

  // [會員中心登入檢查]
  const handleMemberCenterClick = (e) => {
    if (!auth.isAuth) {
      e.preventDefault()
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能進入會員中心。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
    }
  }

  return (
    <>
      <section id="page1" className={`container-fluid  ${styles.web}`}>
        <div className="row">
          {/* 左側邊欄 */}
          <nav
            className={` ${styles.sidebar} ${styles['col-md-custom-25']} p-0 ${styles.navContent}`}
          >
            <div></div>
            <div className="text-center">
              <Image
                src="/homepage/BlackLogo.svg"
                alt="音樂工作室 Logo"
                width={150}
                height={150}
                className={styles.imgFluid}
              />
            </div>

            <ul className="nav flex-column text-center">
              <li className={`nav-item mb-4 h6Bold ${styles.navHover} `}>
                <a
                  href="/product"
                  className={`${styles.navLink} fontDarkBrown`}
                >
                  提琴商城 PRODUCTS
                </a>
              </li>
              <li className={`nav-item mb-4 h6Bold ${styles.navHover} `}>
                <a
                  href="/course"
                  className={`${styles.navLink} fontDarkBrown `}
                >
                  音樂課程 COURSE
                </a>
              </li>
              <li className={`nav-item mb-4 h6Bold ${styles.navHover} `}>
                <a href="/blog" className={`${styles.navLink} fontDarkBrown`}>
                  部落格 BLOG
                </a>
              </li>
              <li className={`nav-item mb-4 h6Bold ${styles.navHover} `}>
                <a href="/coupon" className={`${styles.navLink} fontDarkBrown`}>
                  優惠券 COUPON
                </a>
              </li>
              <li className={`nav-item h6Bold ${styles.navHover} `}>
                <a href="/shop" className={`${styles.navLink} fontDarkBrown`}>
                  門市據點 LOCATIONS
                </a>
              </li>
            </ul>

            {/* 線條 */}
            <div className="mx-4 m-0">
              <hr className="m-0" />
            </div>

            {/* icon */}
            <div className="mx-auto d-flex justify-content-center">
              {/* [購物車按鈕] 添加登入檢查 */}
              <a
                href="/cart"
                className="text-decoration-none"
                onClick={handleCartClick}
              >
                <div className={`${styles.iconBox} mx-2 fontDarkBrown`}>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className={styles.iconHover}
                  />
                </div>
              </a>

              {/* [會員中心按鈕] 添加登入檢查 */}
              <a
                href="/member-center"
                className="text-decoration-none"
                onClick={handleMemberCenterClick}
              >
                <div className={`${styles.iconBox} mx-2 fontDarkBrown`}>
                  <FontAwesomeIcon icon={faUser} className={styles.iconHover} />
                </div>
              </a>
            </div>

            {/* 登入名稱和登入/登出按鈕 */}
            <div className="d-flex align-items-center justify-content-center">
              {auth.isAuth && (
                <p
                  className={`${styles.userText} m-0 font-dark-brown fontDarkBrown h6Bold`}
                >
                  Hi，{auth.userData.member_name}
                </p>
              )}

              {auth.isAuth ? (
                <a
                  href="#user"
                  className="text-decoration-none ms-2"
                  onClick={logout}
                >
                  <div className={styles.iconBox2}>
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className={`fontDarkBrown ms-2 ${styles.logOutHover}`}
                    />
                  </div>
                </a>
              ) : (
                <Link href="/member/login" className="text-decoration-none">
                  <div className={`${styles.navHover}`}>
                    {/* 移除額外的 <a> 元素 */}
                    <span
                      className={`h6Bold fontDarkBrown m-0 p-0 text-decoration-none`}
                    >
                      登入/註冊
                    </span>
                  </div>
                </Link>
              )}
            </div>
            {/* 營業時間 */}
            <div
              className={`${styles.dateBg} d-flex align-items-center justify-content-center `}
            >
              <div className="text-center">
                <h6 className="mb-4 fontDarkBrown web-16px-B">
                  10月3日 (六) 公休一日
                  <br />
                  營業時間: 10:00 AM - 17:00 PM
                </h6>
                <button
                  className={`btn w-100 ${styles.page1Btn} web-16px-B ${styles.btnHover}`}
                >
                  <a href="/shop" className="text-decoration-none">
                    門市據點
                  </a>
                </button>
              </div>
            </div>
          </nav>

          {/* 右側內容 */}
          <div
            className={` ${styles['col-md-custom-95']} ${styles.mainContent} position-relative`}
          >
            <Image
              src="/homepage/page1-bg-img.png"
              alt="背景圖片"
              layout="fill"
              objectFit="cover"
              className="position-absolute"
            />
            <div className="position-relative">
              <div className="sound mx-3 position-absolute top-0 mt-3 end-0 fontLight">
                <span>
                  <FontAwesomeIcon
                    icon={faSoundcloud}
                    className="me-2 fontLight"
                  />
                  on off
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
