import React, { useState, useEffect } from 'react'
import styles from '@/styles/product-styles/recommend.module.scss'
import { useRouter } from 'next/router'
import ProductLikeIcon from '@/components/product-like/like-icon'
import Link from 'next/link'

export default function Recommend({ product_id }) {
  const router = useRouter()
  const [recommendProducts, setRecommendProducts] = useState([])
  const [hoveredProductId, setHoveredProductId] = useState(null);

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
              <div
                className={`${styles.recommenCard} card`}
                
              >
              <Link href={`/product/${product.id}`}>
                <img
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                  src={
                    hoveredProductId === product.id && hoverPic
                      ? `/product-pics/${product.brand_name}/${hoverPic}`
                      : `/product-pics/${product.brand_name}/${defaultPic}`
                  }
                className={`${styles.recommendCardImg} card-img-top`}
                alt={product.product_name}
                style={{
                  cursor: 'pointer',
                }}
              />
              </Link>
              <ProductLikeIcon product_id={product.id} className={styles.recommendFavoriteIconSm} />
              <div className={`${styles.cardBody} card-body`}>
                <div className={`${styles.cardText} card-text position-relative`}>
                  <div className={styles.textArea}>
                    <Link 
                      href={`/product/${product.id}`}
                      className={`${styles.productName} card-title`} 
                      style={{
                        cursor: 'pointer', textDecoration: 'none'
                      }}>{product.product_name}</Link>
                      <h6 className={`${styles.brandName} product-model`}>{product.brand_name}</h6>
                      <ProductLikeIcon product_id={product.id} className={styles.recommendFavoriteIconLg} />
                  </div>
                </div>
                <hr className="m-0" />
                <div className={styles.priceDiv}>
                  <p className={`${styles.recommendCardPrice} card-text`}>
                    NT {product.price.toLocaleString()}
                  </p>
                  {product.discount_price && (
                    <p className={`${styles.recommendCardDiscountPrice} card-text`}>
                      NT {product.discount_price.toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  className={`${styles.cartBtnSm} btn`}
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  前往選購商品
                </button>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </>
  )
}
