import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Page1 from '@/components/homepage/page1'
import Page2 from '@/components/homepage/page2'
import Page3 from '@/components/homepage/page3'
import Page4 from '@/components/homepage/page4'
import Page5 from '@/components/homepage/page5'
import StayInTouch from '@/components/homepage/page6'
import MyNavbar from '@/components/layout/default-layout/my-navbar/index'
import MyFooter from '@/components/layout/default-layout/my-footer'
import BackToTopButton from '@/components/layout/default-layout/back-to-top'
import { useLoader } from '@/hooks/use-loader'

export default function Home({ title = 'Paganini' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const { loader } = useLoader()

  const page1Ref = useRef(null)
  const page2Ref = useRef(null)

  useEffect(() => {
    // 檢查螢幕寬度是否小於等於 540px
    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 720)
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const page1 = page1Ref.current
      const page2 = page2Ref.current

      if (!page1 || !page2) return

      const scrollPosition = window.scrollY
      const page1Height = page1.offsetHeight

      if (!isSmallScreen) {
        // 大於 540px 時啟用滑動效果
        if (scrollPosition > page1Height * 0.1) {
          page2.style.transform = 'translateY(-70vh)'
        } else {
          page2.style.transform = 'translateY(0)'
        }
      } else {
        // 小於等於 540px 時移除 transform
        page2.style.transform = 'translateY(0)'
      }

      const halfwayPoint = page1Height / 2
      setIsVisible(scrollPosition >= halfwayPoint)
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [isSmallScreen])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width " />
      </Head>
      {loader()}
      <div id="page1" ref={page1Ref}>
        <Page1 />
      </div>
      <div
        id="sticky-header"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
      >
        <MyNavbar />
      </div>
      <div
        id="page2"
        ref={page2Ref}
        style={{
          position: 'relative',
          top: 0,
          zIndex: 100,
          transition: 'transform 1s ease',
        }}
      >
        <Page2 />
        <Page3 />
      </div>
      {/* 動態調整 marginTop */}
      <div style={{ marginTop: isSmallScreen ? '0' : '-670px' }}>
        <Page4 />
      </div>
      <Page5 />
      <StayInTouch />
      <BackToTopButton />
      <MyFooter />
    </>
  )
}
