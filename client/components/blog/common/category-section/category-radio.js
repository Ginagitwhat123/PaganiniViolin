// components/blog/common/category-section/category-radio-myblog.js

import React from 'react'
import styles from './category-radio.module.scss'

const CategoryRadio = ({
  categories,
  selectedCategory,
  categoryCounts,
  onCategoryChange,
}) => {
  // 处理类别变化
  const handleRadioChange = (category) => {
    // 如果選擇 "所有類別"，傳遞空字符串來清除篩選條件
    onCategoryChange(category === '所有類別' ? '' : category)
  }

  return (
    <div className={styles.category}>
      {categories.map((category, index) => {
        // 确保 categoryCounts 的值为 0 如果 category 不存在
        const categoryCount = categoryCounts[category] || 0
        const isAllCategories = category === '所有類別'
        const countToDisplay = isAllCategories
          ? categoryCounts['所有類別'] || 0
          : categoryCount

        return (
          <div
            className={`${styles.formCheck} ${
              selectedCategory === category ? styles.selected : ''
            }`}
            key={index}
          >
            <input
              type="radio"
              id={`category${index}`}
              name="category"
              checked={selectedCategory === category}
              onChange={() => handleRadioChange(category)}
            />
            <label htmlFor={`category${index}`}>
              <span className={styles.categoryText}>{category}</span>
              {/* 显示动态数量，如果是 "所有類別" 则显示全部数量 */}
              <span className={styles.categoryCount}>{countToDisplay}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default CategoryRadio
