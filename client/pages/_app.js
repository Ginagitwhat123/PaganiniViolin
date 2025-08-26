// pages/_app.js
import { useEffect } from 'react'
import { LoaderProvider } from '@/hooks/use-loader'
import { CustomLoader } from '@/hooks/use-loader/components'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.scss'
import '@/styles/product.scss'
import '@/styles/loader.scss'
import '@/styles/footer.scss'
import '@/styles/nav.scss'
import '@/styles/minHeight.scss'

// 載入認証用context
import { AuthProvider } from '@/hooks/use-auth'

// 載入麵包屑context
import { BreadcrumbProvider } from '@/hooks/use-name-as-breadcrumb'

// 載入購物車context
import { CartProvider } from '@/hooks/use-cart-state'
import { OrderCouponProvider } from '@/hooks/order-coupon'

import DefaultLayout from '@/components/layout/default-layout'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  // 導入bootstrap的JS函式庫

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  const router = useRouter()
  const isHomePage = router.pathname === '/homepage' // 假設首頁路徑為 /homepage

  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  // 或`components/layout/default-layout.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    //google
    <AuthProvider>
      <LoaderProvider close={0.5} CustomLoader={CustomLoader} global={true}>
        <BreadcrumbProvider>
          <OrderCouponProvider>
            {isHomePage ? (
              // 若為首頁，直接渲染 Component，不使用 DefaultLayout
              <Component {...pageProps} />
            ) : (
              // 其他頁面則使用 DefaultLayout
              getLayout(<Component {...pageProps} />)
            )}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                icon: (
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: 'white', fontSize: '1.2rem' }}
                  />
                ),
                style: {
                  marginRight: '16px',
                  marginBottom: '16px',
                },
                // 可以為不同類型的 toast 設置不同樣式
                success: {
                  style: {
                    background: '#716657', // 成功提示的背景色
                    color: 'white',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444', // 錯誤提示的背景色
                    color: 'white',
                  },
                },
              }}
            />
          </OrderCouponProvider>
        </BreadcrumbProvider>
      </LoaderProvider>
    </AuthProvider>
  )
}
