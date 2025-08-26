import React, { useState, useEffect } from 'react'
import styles from '@/styles/product-styles/ProductCard.module.scss'
import Image from 'next/image'
import ProductLikeIcon from '@/components/product-like/like-icon'

export default function ProductCard({
  brand_name,
  product_name,
  price,
  discount_price,
  defaultPic,
  hoverPic,
  product_id,
  handleCardClick,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <div className={`${styles.productCard} card`}>
        <Image
          src={`/product-pics/${brand_name}/${
            isHovered && hoverPic ? hoverPic : defaultPic
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          width={260}
          height={260}
          style={{
            backgroundColor: '#fff',
            border: '1px solid #716657',
            borderRadius: '5px',
            width: '100%',
            // height: '330px',
            objectFit: 'contain',
            cursor: 'pointer',
          }}
          alt="商品照片"
          onClick={handleCardClick}
          className={styles.cardPic}
        />

        <ProductLikeIcon
          product_id={product_id}
          className={styles.FavoriteIconSm}
        />
        <ProductLikeIcon
          product_id={product_id}
          className={styles.FavoriteIconMd}
        />
        <div className={styles.cardBody}>
          <div className={`${styles.cardText} card-text position-relative`}>
            <div className="text">
              <h5
                className={`${styles.productName} card-title`}
                onClick={handleCardClick}
                style={{ cursor: 'pointer' }}
              >
                {product_name}
              </h5>

              <h6 className={styles.modelName}>{brand_name}</h6>
            </div>
            <ProductLikeIcon
              product_id={product_id}
              className={styles.FavoriteIconLg}
            />
          </div>

          <hr className="m-1" />
          <div className={styles.priceDiv}>
            {discount_price ? (
              <>
                <p className={`${styles.price} card-text web-16px-md mb-0`}>
                  NT ${discount_price.toLocaleString()}
                </p>
                <p className={`${styles.discountPrice} card-text mb-0`}>
                  NT ${price.toLocaleString()}
                </p>
              </>
            ) : (
              <p className={`${styles.price} card-text web-16px-md mb-0`}>
                NT ${price.toLocaleString()}
              </p>
            )}
          </div>
          <div
            className={`${styles.cartBtn} btn web-16px-md`}
            onClick={handleCardClick}
          >
            前往選購商品
          </div>
        </div>
      </div>
    </>
  )
}
