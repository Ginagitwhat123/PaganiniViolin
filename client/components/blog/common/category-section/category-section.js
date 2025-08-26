import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa' // 引入箭頭圖標
import FilterTitle from '../titles/filter-title'
import CategoryRadio from './category-radio'
import styles from './category-section.module.scss'

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

  const [categoryCounts, setCategoryCounts] = useState({})
  const [loading, setLoading] = useState(true) // 用來控制加載狀態
  const [isCollapsed, setIsCollapsed] = useState(true) // 控制收合狀態
  const [isMobile, setIsMobile] = useState(false) // 用來判斷是否是手機視窗

  // 向後端請求獲取每個類別的文章數量
  const fetchCategoryCounts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/blog') // 確認API端點
      const data = await response.json()

      console.log('Category Counts:', data.category_counts)

      setCategoryCounts(data.category_counts || {})
    } catch (error) {
      console.error('Failed to fetch category counts:', error)
      setCategoryCounts({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryCounts()

    // 監聽視窗大小變化
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // 小於 768px 時，啟用收合
    }

    // 初次渲染時檢查
    handleResize()

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 切換收合狀態
  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState)
  }

  return (
    <div className={styles.category}>
      <div className={styles.header} onClick={isMobile ? toggleCollapse : null}>
        <h3 className={styles.filterTitle}>分類</h3>
        {isMobile && (
          <span className={styles.arrowIcon}>
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </span>
        )}
      </div>

      {/* 根據收合狀態顯示分類內容 */}
      {(isMobile ? !isCollapsed : true) && (
        <div className={styles.categoryContent}>
          {loading ? (
            <p>載入中...</p> // 顯示載入狀態
          ) : (
            <CategoryRadio
              categories={categories}
              selectedCategory={selectedCategory || '所有類別'}
              categoryCounts={categoryCounts}
              onCategoryChange={onCategoryChange}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default CategorySection
