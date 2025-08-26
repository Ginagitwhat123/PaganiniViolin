// components/blog/common/cards/myblog-cards.js

import React from 'react'
import Card from './myblog-card' // 确保正确导入 Card 组件
import styles from './cards.module.scss' // 确保正确导入样式

const Cards = ({ blogs, onDelete }) => {
  return (
    <div className={styles.cards}>
      {blogs.map((blog) => (
        <Card
          key={blog.id} // 使用 blog.id 作为 key
          title={blog.title} // 传递标题
          content={blog.content} // 传递内容
          created_at={blog.created_at} // 传递 created_at
          category_name={blog.category_name} // 传递 category_name
          blogId={blog.id} // 传递 blogId
          coverImgUrl={blog.cover_img_url} // 传递封面图片 URL
          userId={blog.user_id} // 假设这里有 user_id 传递
          onDelete={onDelete} // 传递 onDelete 给 Card 组件
        />
      ))}
    </div>
  )
}

export default Cards
