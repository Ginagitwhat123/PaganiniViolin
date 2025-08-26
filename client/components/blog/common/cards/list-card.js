import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import styles from './card.module.scss'
import Poster from '../poster/poster'

const Card = ({
  title,
  content,
  created_at,
  category_name,
  blogId,
  coverImgUrl = '', // 提供默認值避免 undefined
  author_name,
}) => {
  // 改進圖片路徑處理邏輯
  const getImgSrc = (url) => {
    if (!url) return '/blog/default-cover.png' // 添加默認圖片

    try {
      // 如果圖片名稱以 'blog_cover' 開頭，則從後端的 'public/blog' 路徑加載
      if (url.startsWith('blog_cover')) {
        return `http://localhost:3005/blog/${url}` // 從後端服務器加載
      }

      // 如果是其他圖片，則假設它是相對於前端的靜態路徑
      return `/blog/${url.replace(/^\/+/, '')}` // 移除 URL 開頭的多餘斜線
    } catch (error) {
      console.error('Error processing image URL:', error)
      return '/blog/default-cover.png' // 出錯時返回預設圖片
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date
        .toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-')
    } catch (error) {
      console.error('Date formatting error:', error)
      return ''
    }
  }

  // 移除 HTML 標籤，只保留純文本
  const getTextContent = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html')
    return doc.body.textContent || doc.body.innerText || ''
  }

  return (
    <div className={styles.card}>
      {/* 處理圖片路徑，並設置錯誤處理 */}
      <img
        src={getImgSrc(coverImgUrl)} // 這裡用我們的圖片處理函數
        className={styles.cardImgTop}
        alt={title || 'Blog Cover'}
        onError={(e) => {
          // 如果圖片加載失敗，設置默認圖片
          e.target.src = '/blog/default-cover.png'
          e.target.alt = 'Default Cover'
        }}
      />
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          <div className={styles.posterAndSave}>
            <Poster author_name={author_name} />
          </div>
          <h5 className={styles.cardTitle}>{title || '無標題'}</h5>
          {/* 使用 getTextContent 去掉 HTML 標籤 */}
          <p className={styles.cardText}>
            {getTextContent(content) || '無內容'}
          </p>
          <div className={styles.dateAndType}>
            <p className={styles.cardDate}>{formatDate(created_at)}</p>
            <p className={styles.cardType}>{category_name || '未分類'}</p>
          </div>
        </div>
        <div className={`${styles.btn} ${styles.btnFill}`}>
          <a
            href={`/blog/${blogId}`}
            onClick={(e) => {
              if (!blogId) {
                e.preventDefault()
                console.error('Blog ID is missing')
              }
            }}
          >
            前往文章
          </a>
        </div>
      </div>
    </div>
  )
}

export default Card
