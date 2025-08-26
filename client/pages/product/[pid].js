import React, { useState, useEffect } from 'react'
import Carousel from '@/components/product/carousel'
import ProductDetailRight from '@/components/product/product-detail-right'
import ProductDetailDown from '@/components/product/product-detail-down'
import Recommend from '@/components/product/recommend'
import styles from '@/styles/product-styles/[pid].module.scss'
import { useRouter } from 'next/router'
import { useNameAsBreadcrumb } from '@/hooks/use-name-as-breadcrumb' // 導入麵包屑名稱傳遞用的 hook

export default function Detail() {
  const router = useRouter()
  const { pid } = router.query

  // 引用麵包屑名稱 hook 變數
  const { setSubTitle } = useNameAsBreadcrumb()

  const [product, setProduct] = useState({
    id: 0,
    product_name: '',
    price: 0,
    discount_price: 0,
    description: '',
    category_name: '',
    brand_name: '',
    pictures: '',
  })
  const [notFound, setNotFound] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  const getProduct = async (id) => {
    const url = `http://localhost:3005/api/products/${id}`

    try {
      const res = await fetch(url)
      const resData = await res.json()

      if (resData && resData.status === 'success') {
        setProduct(resData.data)
      } else {
        setNotFound(true)
        console.log('資料錯誤')
      }
    } catch (e) {
      setNotFound(true)
      console.error('無法取得資料:', e)
    }
  }

  // 設定前往頁面
  useEffect(() => {
    if (router.isReady && router.query.pid) {
      getProduct(router.query.pid)
    }
  }, [router.isReady, router.query.pid])

  // 設定麵包屑名稱
  useEffect(() => {
    if (product.product_name) {
      setSubTitle(product.product_name)
    }
  }, [product.product_name])




  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // 偵測螢幕寬度
    };

    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
      <div className="container">
        {notFound ? (
          <div className="mx-3 mb-5 fontDarkBrown h3Bold">找不到該商品</div>
        ) : (
          <div className="row mt-5">
            <div className={`col-md-6 ${styles.leftArea}`}>
              <div className="position-sticky" style={{ top: '2rem' }}>
                {product.pictures && (
                  <Carousel
                    pictures={product.pictures.split(',')}
                    brand_name={product.brand_name}
                  />
                )}

                {/* 在小尺寸時，將 ProductDetailRight 放在這裡 */}
                {isMobile && (
                  <ProductDetailRight
                    product_id={product.id}
                    product_name={product.product_name}
                    price={product.price}
                    discount_price={product.discount_price}
                    brand_name={product.brand_name}
                    sizes={product.sizes}
                  />
                )}

                <ProductDetailDown 
                description={product.description}
                product_id={product.id} />
                <Recommend product_id={product.id} />
              </div>
            </div>
            {/* 在大尺寸時，ProductDetailRight 仍然顯示在右側 */}
            {!isMobile && (
              <div className={`col-md-6 ${styles.rightArea}`}>
                <ProductDetailRight
                  product_id={product.id}
                  product_name={product.product_name}
                  price={product.price}
                  discount_price={product.discount_price}
                  brand_name={product.brand_name}
                  sizes={product.sizes}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
