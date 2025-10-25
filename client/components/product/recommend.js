import React, { useState, useEffect } from 'react'
import styles from '@/styles/product-styles/recommend.module.scss'
import { useRouter } from 'next/router'
import ProductCard from '@/components/product/product-card'

export default function Recommend() {
  const router = useRouter()
  const [recommendProducts, setRecommendProducts] = useState([])
  

  useEffect(() => {
    const fetchRecommendProducts = async () => {
      if (!router.query.pid) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/recommend/${router.query.pid}`);
        const data = await response.json();

        if (data.status === 'success') {
          setRecommendProducts(data.data);
        }
      } catch (error) {
        console.error('無法取得推薦商品:', error);
      }
    };

    if (router.isReady) {
      fetchRecommendProducts();
    }
  }, [router.isReady, router.query.pid]);

  const handleCardClick = (id) => {
    router.push(`/product/${id}`)
  }

  return (
    <>
      <div className={`${styles.recommendTitle} fontDarkBrown web-16px-B`}>其他相似商品</div>
      <div className={`${styles.recommendDiv} row`}>
      {recommendProducts.map((product) => {
          // 將圖片字串分割成陣列並篩選
          const pictures = product.pictures ? product.pictures.split(',') : [];
          const defaultPic = pictures.find((pic) => pic.includes('-1.'));
          const hoverPic = pictures.find((pic) => pic.includes('-2.'));

          return (
            <div key={product.id} className="col-6">
            <ProductCard
                brand_name={product.brand_name}
                product_name={product.product_name}
                price={product.price}
                discount_price={product.discount_price}
                defaultPic={defaultPic}
                hoverPic={hoverPic}
                product_id={product.id}
                handleCardClick={() => handleCardClick(product.id)}
                cardPic = {styles.recommendCardImg}
                priceArea = {styles.priceDiv}
                CardPrice = {styles.recommendCardPrice}
                discountPrice = {styles.recommendCardDiscountPrice}
              />
          </div>
        )
      })}
      </div>
    </>
  )
}
