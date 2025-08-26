// import MyNavbar from './my-navbar-nouse'
import MyNavbarBS5 from './my-navbar'
import MyFooter from './my-footer'
import Head from 'next/head'
import NextBreadCrumb from '@/components/common/next-breadcrumb'
import { useLoader } from '@/hooks/use-loader'
import { useRouter } from 'next/router'

export default function DefaultLayout({ title = 'Paganini', children }) {
  const { loader } = useLoader()
  const router = useRouter()
  // 定義顯示 HeaderWithImage 的路徑
  const showHeader = [
    '/product',
    '/course',
    '/blog',
    '/coupon',
    '/shop',
  ].includes(router.pathname)
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width " />
      </Head>
      <MyNavbarBS5 />
      <div className="d-flex flex-column">
        <main className="flex-grow-1 minHeight">
          {!showHeader && <div className="navHieght"></div>}
          <div className="container mt-3">
            <NextBreadCrumb isHomeIcon isChevron bgClass="" />
            {children}
          </div>
          {/* 全域的載入動畫指示器 */}
          {loader()}
        </main>
      </div>
      <MyFooter />
    </>
  )
}
