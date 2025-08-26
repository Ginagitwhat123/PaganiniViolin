import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { IoPerson } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { BsList } from 'react-icons/bs'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignInAlt,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import style from './position.module.scss'

// 引入 AuthContext
import { useAuth } from '@/hooks/use-auth'
import HeaderWithImage from '../HeaderWithImage'

// 引入 購物車數量 hook
import { useOrderCoupon } from '@/hooks/order-coupon'

export default function MyNavbar() {
  const router = useRouter()
  const { auth, logout } = useAuth()
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // 定義顯示 HeaderWithImage 的路徑
  const showHeader = [
    '/product',
    '/course',
    '/blog',
    '/coupon',
    '/shop',
  ].includes(router.pathname)

  const { totalQuantity } = useOrderCoupon()

  // [會員中心登入檢查]
  const handleMemberCenterClick = (e) => {
    if (!auth.isAuth) {
      e.preventDefault()
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能進入會員中心。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      }).then(() => {
        setShow(false) // 關閉 Offcanvas
        router.push('/member/login') // 導航到登入頁面
      })
    } else {
      setShow(false) // 已登入則關閉 Offcanvas
    }
  }

  // [購物車登入檢查]
  const handleCartClick = (e) => {
    if (!auth.isAuth) {
      e.preventDefault()
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能查看購物車。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  // [登出功能]
  const handleLogout = () => {
    logout()
    router.push('/') // 登出後重定向到首頁
  }
  const handleNavigate = (event) => {
    handleClose() // 關閉 Offcanvas
  }
  return (
    <>
      {/* 有條件地渲染 HeaderWithImage */}
      <header className={`${style.posi}`}>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Button
              variant="link"
              onClick={handleShow}
              className="navbar-toggler"
            >
              <BsList className="hamburger fontLight" />
            </Button>
            <Link href="/homepage" className="navbar-brand logo">
              <img src="/images/Logo/logo-white.svg" alt="PAGANINI_LOGO" />
              <p className="fontLight">PAGANINI</p>
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav navbar-function">
                <li className="nav-item navItem">
                  <Link href="/product" className="nav-link navHover fontLight">
                    提琴商城
                  </Link>
                </li>
                <li className="nav-item navItem">
                  <Link href="/course" className="nav-link navHover fontLight">
                    音樂課程
                  </Link>
                </li>
                <li className="nav-item navItem">
                  <Link href="/blog" className="nav-link navHover fontLight">
                    部落格
                  </Link>
                </li>
                <li className="nav-item navItem">
                  <Link href="/coupon" className="nav-link navHover fontLight">
                    優惠券
                  </Link>
                </li>
                <li className="nav-item navItem">
                  <Link href="/shop" className="nav-link navHover fontLight">
                    門市據點
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link
                    href="/cart"
                    className="nav-link"
                    onClick={handleCartClick}
                    // style={{ position: 'relative' }} // 使購物車數量基於圖標定位
                  >
                    <IoMdCart className="nav-cart fontLight" />
                    {totalQuantity > 0 && ( // 只有數量大於 0 時才顯示數量
                      <div className="cartNumOutline">
                        <span className="cartNum">{totalQuantity}</span>
                      </div>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/member-center"
                    className="nav-link"
                    onClick={handleMemberCenterClick}
                  >
                    <IoPerson className="nav-person fontLight" />
                  </Link>
                </li>
                <li className="nav-item navItem">
                  {auth.isAuth ? (
                    <button
                      className="nav-link nav-login navHover fontLight"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/member/login"
                      className="nav-link nav-login navHover fontLight"
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <Link
              href="/cart"
              className="iconHover nav-link navbar-cart d-lg-none fontLight"
              onClick={handleCartClick}
              // style={{ position: 'relative' }} // 使購物車數量基於圖標定位
            >
              <IoMdCart className="nav-cart fontLight" />
              {totalQuantity > 0 && ( // 只有數量大於 0 時才顯示數量
                <div className="cartNumOutline">
                  <span className="cartNum">{totalQuantity}</span>
                </div>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {showHeader && (
        <div style={{ height: '380px' }}>
          <HeaderWithImage />
        </div>
      )}

      {/* 使用 React Bootstrap 的 Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton className="w-100 text-center">
          <Offcanvas.Title className="w-100 mt-5 ">
            Hi，{auth.isAuth ? auth.userData.member_name : '貴賓'}
          </Offcanvas.Title>
        </Offcanvas.Header>
        {/* 登出或登入/註冊按鈕 */}
        <div className="text-center mt-3">
          {auth.isAuth ? (
            <Button className="loginBtn" onClick={handleLogout}>
              登出
            </Button>
          ) : (
            <Link href="/member/login" passHref>
              <Button className="loginBtn">登入/註冊</Button>
            </Link>
          )}
        </div>

        <Offcanvas.Body>
          <div className="my-4 w-100 px-4">
            <hr className="m-0" />
          </div>

          <ul className="nav flex-column text-center align-items-center">
            <li className="nav-item my-2">
              <Link
                href={auth.isAuth ? '/member-center' : '#'}
                className="nav-link"
                onClick={handleMemberCenterClick}
              >
                會員中心
              </Link>
            </li>
            <li className="nav-item my-2">
              <Link href="/product" className="nav-link" onClick={handleClose}>
                提琴商城
              </Link>
            </li>
            <li className="nav-item my-2">
              <Link href="/course" className="nav-link" onClick={handleClose}>
                音樂課程
              </Link>
            </li>
            <li className="nav-item my-2">
              <Link href="/blog" className="nav-link" onClick={handleClose}>
                部落格
              </Link>
            </li>
            <li className="nav-item my-2">
              <Link href="/coupon" className="nav-link" onClick={handleClose}>
                優惠券
              </Link>
            </li>
          </ul>

          <div className="my-4 w-100 px-4">
            <hr className="m-0" />
          </div>

          <div className="text-center my-4">
            <p className="pt-2">10月3日 (二) 公休一日</p>
            <p>營業時間：10:00 AM - 17:00 PM</p>
            <Link href="/shop" passHref>
              <Button className="w-50 my-4 loginBtn" onClick={handleClose}>門市資訊</Button>
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <style jsx>{`
        .header {
          width: 100%;
          height: 500px;
          background-color: black;
        }
      `}</style>
    </>
  )
}
