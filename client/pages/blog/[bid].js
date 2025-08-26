import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './[bid].module.scss' // 確認文件名和路徑
import NextBreadCrumb from '@/components/common/next-breadcrumb'
import Pagination from '@/components/common/bs5-pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBookmark } from '@fortawesome/free-solid-svg-icons'
import Poster from '@/components/blog/common/poster/poster'
import { useNameAsBreadcrumb } from '@/hooks/use-name-as-breadcrumb' // 導入麵包屑名稱傳遞用的 hook

import {
  FaHeart,
  FaRegComment,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'

const API_URL = 'http://localhost:3005/api/blog'

const Blog = () => {
  const router = useRouter()
  const { bid } = router.query // 獲取路由參數

  // 引用麵包屑名稱 hook 變數
  const { setSubTitle } = useNameAsBreadcrumb()

  const [blogPost, setBlogPost] = useState(null)
  const [prevPost, setPrevPost] = useState(null)
  const [nextPost, setNextPost] = useState(null)
  const [loading, setLoading] = useState(true)

  // 根據 blogId 獲取文章詳細資料
  const fetchBlogDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`)
      const data = await response.json()

      if (data.blog) {
        setBlogPost(data.blog)
        setPrevPost(data.prevBlog)
        setNextPost(data.nextBlog)
      }
    } catch (error) {
      console.error('Error fetching blog details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bid) {
      setLoading(true)
      fetchBlogDetails(bid) // 根據 bid 獲取文章資料
    }
  }, [bid])

  // 設定麵包屑名稱
  useEffect(() => {
    if (blogPost && blogPost.title) {
      setSubTitle(blogPost.title)
    }
  }, [blogPost, setSubTitle])

  if (loading) {
    return <div>加載中...</div>
  }

  if (!blogPost) {
    return <div>找不到該文章</div>
  }

  const {
    title,
    content,
    displayTime,
    author_name, // 從後端資料中提取 author_name
    category_name,
    cover_img_url,
  } = blogPost

  return (
    <div className={styles.container}>
      {/* 麵包屑 */} {/* <NextBreadCrumb /> */}
      {/* 主要內容 */}
      <main className={styles.main}>
        <div className={styles.article}>
          <h1>{title}</h1>
          <div className={styles.posterAndDateAndType}>
            {/* 傳遞 author_name 給 Poster */}
            <Poster author_name={author_name} />
            <div className={styles.dot}></div>
            <p>{new Date(displayTime).toLocaleDateString()}</p>
            <div className={styles.dot}></div>
            <p>{category_name}</p>
          </div>

          {/* 文章內容，動態渲染 HTML 內容 */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* 分頁器 */}
      </main>
      {/* 上一篇和下一篇 */}
      <div className={styles.previousNext}>
        {/* 上一篇 */}
        {prevPost ? (
          <a href={`/blog/${prevPost.id}`} className={styles.previousBtn}>
            <div className={styles.previous}>
              <FaChevronLeft />
              上一篇
            </div>
            <p>{prevPost.title}</p>
          </a>
        ) : (
          <div className={styles.previousBtn}>
            <div className={styles.previous}>
              <FaChevronLeft />
              上一篇
            </div>
            <p>已無上一篇</p>
          </div>
        )}

        <div className={styles.line}></div>

        {/* 下一篇 */}
        {nextPost ? (
          <a href={`/blog/${nextPost.id}`} className={styles.nextBtn}>
            <div className={styles.next}>
              下一篇
              <FaChevronRight />
            </div>
            <p>{nextPost.title}</p>
          </a>
        ) : (
          <div className={styles.nextBtn}>
            <div className={styles.next}>
              下一篇
              <FaChevronRight />
            </div>
            <p>已無下一篇</p>
          </div>
        )}
      </div>
      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Blog
