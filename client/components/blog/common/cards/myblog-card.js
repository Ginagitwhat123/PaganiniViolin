import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { IoEye } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import styles from './card.module.scss'

const Card = ({
  title,
  content,
  created_at,
  category_name,
  blogId,
  coverImgUrl, // 用來傳遞封面圖片 URL
  onDelete, // 用來執行刪除操作的函數
}) => {
  // 點擊刪除按鈕的處理函式
  const handleDelete = () => {
    // 使用 onDelete 函数来处理删除逻辑
    onDelete(blogId)
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

  // 改進圖片路徑處理邏輯
  const getImgSrc = (url) => {
    if (!url) return '/blog/default-cover.png' // 添加默認圖片

    try {
      if (url.startsWith('blog_cover')) {
        return `http://localhost:3005/blog/${url}` // 從後端服務器加載
      }
      return `/blog/${url.replace(/^\/+/, '')}` // 移除 URL 開頭的多餘斜線
    } catch (error) {
      console.error('Error processing image URL:', error)
      return '/blog/default-cover.png' // 出錯時返回預設圖片
    }
  }

  // 移除 HTML 標籤，只保留純文本
  const getTextContent = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html')
    return doc.body.textContent || doc.body.innerText || ''
  }

  return (
    <div className={styles.card}>
      <img
        src={getImgSrc(coverImgUrl)} // 這裡使用的是封面圖片的處理函數
        className={styles.cardImgTop}
        alt={title || 'Blog Cover'}
      />
      <div className={styles.iconBg}>
        <FaTrashAlt
          className={styles.trashIcon}
          size={20}
          onClick={handleDelete} // 點擊刪除按鈕觸發 handleDelete
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          <h5 className={styles.cardTitle}>{title}</h5>
          {/* 使用 getTextContent 去掉 HTML 標籤 */}
          <p className={styles.cardText}>{getTextContent(content)}</p>
          <div className={styles.dateAndType}>
            <p className={styles.cardDate}>{formatDate(created_at)}</p>
            <p className={styles.cardType}>{category_name || '未分類'}</p>
          </div>
        </div>
        <div className={styles.btns}>
          <div className={`${styles.btn} ${styles.btnBorder}`}>
            <a href={`/blog/${blogId}`}>
              <IoEye size={20} />
              檢視
            </a>
          </div>
          <div className={`${styles.btn} ${styles.btnFill}`}>
            <a href={`/blog/myblog/edit/${blogId}`}>
              <AiFillEdit size={20} />
              編輯
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
