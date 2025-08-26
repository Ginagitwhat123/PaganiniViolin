import React, { useState, useEffect } from 'react'
import styles from '@/styles/product-styles/product-detail-down.module.scss'

export default function ProductDetailDown({ description, product_id }) {
  const [activeTab, setActiveTab] = useState('product')
  const [reviews, setReviews] = useState([]) // 儲存評價資料
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [sortOption, setSortOption] = useState('latest') // 排序選項

  // 呼叫後端 API 獲取評價數據
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/comments/product/${product_id}?sort=${sortOption}`
        );
        const result = await response.json();

        if (result.status === 'success') {
          setReviews(result.data.reviews);
          setAverageRating(result.data.averageRating || 0);
          setTotalReviews(result.data.totalReviews);
        }
      } catch (error) {
        console.error('無法取得評價資料:', error);
      } 
    };

    fetchReviews();
  }, [product_id, sortOption]);

  // 隱藏中間部分的帳號字元
  const formatNickname = (nickname) => {
    if (!nickname) return '匿名用戶'; // 若無名稱則返回匿名
    const length = nickname.length;
    if (length <= 3) return nickname; // 短名稱不隱藏
    const start = nickname.slice(0, 2); // 前3字
    const end = nickname.slice(-2); // 後2字
    return `${start}${'*'.repeat(length - 4)}${end}`;
  };

  return (
    <>
      <ul className={`${styles.navUnderline} nav nav-underline`}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'product' ? 'active tab-active' : ''
              } ${styles.navLink}`}
            onClick={() => setActiveTab('product')}
          >
            商品介紹
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'rating' ? 'active tab-active' : ''
              } ${styles.navLink}`}
            onClick={() => setActiveTab('rating')}
          >
            顧客評價
          </button>
        </li>
      </ul>

      {/* 商品介紹內容區塊 */}
      {activeTab === 'product' && (

        <div className={`${styles.description} fontDarkBrown web-16px-md pe-5`} style={{ whiteSpace: 'pre-line' }}>

          {description}
        </div>
      )}

      {/* 顧客評價內容區塊 */}
      {activeTab === 'rating' && (
        <div className={styles.ratingDiv}>
          <div className={styles.ratingTopArea}>
            <div className={styles.score}>{Number(averageRating).toFixed(1)}</div>
            <div className={styles.scoreStarArea}>
              {Array.from({ length: 5 }, (_, index) => (
                <i
                  key={index}
                  className={`${index < Math.round(averageRating) ? styles.scoreStar : styles.emptyStar} bi bi-star-fill`}
                />
              ))}
              <p className={`${styles.noReviews} fontDarkBrown`}>
                {totalReviews > 0 ? `${totalReviews} 則評價` : '尚無評價'}
              </p>
            </div>
            {totalReviews > 0 && (
              <div className={styles.ratingFilterArea}>
                <select
                  className={`${styles.ratingSelect} form-select fontDarkBrown`}
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="latest">最新評價</option>
                  <option value="oldest">最舊評價</option>
                  <option value="high">評分由高到低</option>
                  <option value="low">評分由低到高</option>
                </select>
              </div>
            )}
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.ratingDownArea}>
                <div className={styles.ratingComment}>
                  <div className={`${styles.ratingUser} fontDarkBrown`}>
                  {formatNickname(review.nickname)}
                  </div>
                  <div className={styles.userStar}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={index}
                        className={`bi bi-star-fill ${index < review.rating ? styles.scoreStar : styles.emptyStar}`}
                      />
                    ))}
                  </div>
                  <div className={`${styles.ratingDetail} fontDarkBrown`}>
                    {review.comment}
                  </div>
                  <div className={`${styles.ratingDate} fontDarkBrown`}>
                    {new Date(review.created_at).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : ""}
        </div>
      )}
    </>
  )
}
