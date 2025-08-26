import React from 'react'
import { useRouter } from 'next/router'

const HeaderWithImage = () => {
  const router = useRouter()

  // 根據路由選擇不同的背景圖片和內容
  let backgroundImage, title, engTitle, introduce
  if (router.pathname === '/product') {
    backgroundImage = '/homepage/product.png'
    title = '商品'
    engTitle = 'Product'
    introduce = null
  } else if (router.pathname === '/course') {
    backgroundImage = '/homepage/course-index.png'
    title = '課程'
    engTitle = 'Course'
    introduce = null
  } else if (router.pathname === '/blog') {
    backgroundImage = '/homepage/blog-img3.png'
    title = '部落格'
    engTitle = 'Blog'
    introduce = null
  } else if (router.pathname === '/shop') {
    backgroundImage = '/homepage/shop.png'
    title = '門市據點'
    engTitle = 'Shop'
    introduce = null
  } else if (router.pathname === '/coupon') {
    backgroundImage = '/homepage/coupon.png'
    title = '優惠券'
    engTitle = 'Coupon'
    introduce = null
  } else {
    backgroundImage = '/homepage/product.png'
    title = '商品'
    engTitle = 'Product'
    introduce = null
  }

  return (
    <div className="header d-flex align-items-center">
      <div className="container text-light">
        <div className="row">
          <div className="col-12 col-md-4 text-end">
            {engTitle && <h1 className="display-4">{engTitle}</h1>}
            {title && <h4 className="mt-3">{title}</h4>}
          </div>
          {introduce && (
            <div className="col-10 col-md-5 mt-4 ms-3">
              <h6 className="lead">{introduce}</h6>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .header {
          width: 100%;
          height: 380px;
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
        }
        h1 {
          font-family: 'Bodoni Moda', serif;
          font-size: 5rem;
        }
        h4 {
          font-size: 1.8rem;
          font-weight: 500;
        }
        h6 {
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .header {
            height: 280px;
          }
          h1 {
            font-size: 2rem;
          }
          h4 {
            font-size: 1rem;
          }
          h6 {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  )
}

export default HeaderWithImage
