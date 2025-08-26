import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/member-center/memberCenter.module.scss'

export default function MemberCenterLayout({ children }) {
  const router = useRouter()

  // 側邊欄導航項目
  const navItems = [
    { href: '/member-center', label: '會員資料' },
    { href: '/member-center/myorders', label: '訂單查詢' },
    { href: '/member-center/comments', label: '我的評價' },
    { href: '/member-center/likes', label: '收藏列表' },
    { href: '/member-center/mycoupons', label: '優惠券' },
  ]

  return (
    <div className={`${styles.wrapper}`}>
      <div className="container">
        <div className={`${styles.memberCenter} overflow-hidden ps-4`}>
          <div className="row w-100">
            {/* 側邊欄（大螢幕顯示） */}
            <div
              className={`${styles.memberNav} col-2 d-none d-xl-flex justify-content-center align-items-center`}
            >
              <nav className="nav flex-column text-center w-100">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link fontDarkBrown mb-5">
                    <h5
                      className={`${
                        router.pathname === item.href ? styles.active : ''
                      } h5Bold`}
                    >
                      {item.label}
                    </h5>
                  </Link>
                ))}
              </nav>
            </div>

            {/* 下拉選單（小螢幕顯示） */}
            <div className="col-12 d-xl-none mb-2 p-0 mx-0">
              <div className="dropdown w-100">
                <button
                  className={`btn btn-outline-primary dropdown-toggle w-100 ${styles.memberBtn}`}
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  會員中心
                </button>
                <ul
                  className="dropdown-menu w-100"
                  aria-labelledby="dropdownMenuButton"
                >
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.memberBtn} fontDarkBrown dropdown-item`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 主要內容區域 */}
            <div className={`col-xl-10 col-md-12 px-0 mx-0 ${styles.contentArea}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
