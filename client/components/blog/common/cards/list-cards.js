// components/blog/common/cards/list-cards.js

import React from 'react'
import Card from './list-card'
import styles from './cards.module.scss'

const Cards = ({ blogs }) => {
  // 可以加入 console.log 來檢查收到的數據
  console.log('Blogs data:', blogs)

  return (
    <div className={styles.cards}>
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          title={blog.title}
          content={blog.content}
          created_at={blog.created_at}
          category_name={blog.category_name} // 確保這是從後端返回的正確分類名稱
          blogId={blog.id}
          coverImgUrl={blog.cover_img_url} // 添加封面圖片
          author_name={blog.author_name} // 改為從後端返回的作者名稱
        />
      ))}
    </div>
  )
}

export default Cards
