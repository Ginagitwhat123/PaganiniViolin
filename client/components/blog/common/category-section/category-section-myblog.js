import React, { useState, useEffect } from 'react'
import FilterTitle from '../titles/filter-title'
import CategoryRadio from './category-radio'
import styles from './category-section.module.scss'
import { useAuth } from '@/hooks/use-auth' // 引入 useAuth 钩子获取用户信息

import { FaChevronDown, FaChevronUp } from 'react-icons/fa' // 引入箭頭圖標

const CategorySection = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    '所有類別', // 這個選項將清除所有類別篩選
    '教學',
    '保養',
    '選購指南',
    '小百科',
    '檢定考試',
    '學習經驗分享',
  ]

  const [categoryCounts, setCategoryCounts] = useState({}) // 存儲每個類別的文章數量
  const [loading, setLoading] = useState(true) // 控制加載狀態
  const [isCollapsed, setIsCollapsed] = useState(true) // 控制收合/展開狀態
  const [isMobile, setIsMobile] = useState(false) // 用來判斷是否是小螢幕設備

  const { auth } = useAuth() // 獲取用戶認證信息
  const userID = auth ? auth.userData.ID : null // 獲取用戶ID

  // 監聽視窗大小變化
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768) // 小於 768px 時啟用收合功能
  }

  useEffect(() => {
    handleResize() // 初次渲染時檢查一次視窗大小
    window.addEventListener('resize', handleResize) // 監聽視窗大小變化
    return () => window.removeEventListener('resize', handleResize) // 清理事件監聽器
  }, [])

  // 获取 URL 中的 category 参数并设置为 selectedCategory
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromURL = urlParams.get('category') || '所有類別' // 默認選中 "所有類別"
    onCategoryChange(categoryFromURL) // 初始化 selectedCategory
  }, []) // 只在組件掛載時觸發一次

  // 向后端請求獲取每個類別的文章數量
  useEffect(() => {
    if (!userID) {
      console.error('未登入，無法取得數據')
      return
    }

    // 向後端請求文章數量
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blog/myblog/${userID}`
        )
        const data = await response.json()

        if (data.category_counts) {
          setCategoryCounts(data.category_counts || {})
        } else {
          console.error('类别文章数量数据格式不正确')
        }
      } catch (error) {
        console.error('获取类别文章数量失败:', error)
        setCategoryCounts({})
      } finally {
        setLoading(false) // 请求完成后关闭加载状态
      }
    }

    fetchCategoryCounts() // 获取类别文章数量
  }, [userID, selectedCategory]) // 每当 selectedCategory 或 userID 改变时重新请求数据

  // 更新 URL 参数并处理 category 变更
  const handleCategoryChange = (category) => {
    // 更新父组件的类别选择状态
    onCategoryChange(category)

    // 同时更新 URL 查询参数
    const urlParams = new URLSearchParams(window.location.search)

    if (category === '所有類別') {
      // 如果選擇 "所有類別"，刪除 URL 中的 category 參數
      urlParams.delete('category')
    } else {
      // 否則，更新 URL 中的 category 參數
      urlParams.set('category', category)
    }

    // 修改浏览器地址栏 URL
    window.history.pushState({}, '', '?' + urlParams.toString())
  }

  // 切換收合狀態
  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState)
  }

  return (
    <div className={styles.category}>
      {/* 在小螢幕設備下顯示收合按鈕 */}
      <div className={styles.header} onClick={isMobile ? toggleCollapse : null}>
        <FilterTitle>分類</FilterTitle>
        {isMobile && (
          <span className={styles.arrowIcon}>
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </span>
        )}
      </div>

      {/* 根據收合狀態顯示按鈕列表，並且在大螢幕上保持展開 */}
      {(isMobile ? !isCollapsed : true) && (
        <div className={styles.categoryContent}>
          {loading ? (
            <p>載入中...</p> // 顯示加載中
          ) : (
            <CategoryRadio
              categories={categories}
              selectedCategory={selectedCategory || '所有類別'}
              categoryCounts={categoryCounts}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default CategorySection
