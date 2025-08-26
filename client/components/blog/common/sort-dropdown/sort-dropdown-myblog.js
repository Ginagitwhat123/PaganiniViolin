// components/blog/common/sort-dropdown/sort-dropdown-myblog.js

import React, { useState, useEffect } from 'react'
import styles from './sort-dropdown.module.scss'

const SortDropdown = ({ onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState('由新到舊') // 默认显示“由新到旧”

  // 当组件加载时，从 URL 中读取排序参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const order = urlParams.get('order')

    if (order) {
      const sortLabel = order === 'ASC' ? '由舊到新' : '由新到舊'
      setSelectedSort(sortLabel)
      onSortChange(order) // 根据 URL 参数更新排序
    }
  }, []) // 组件加载时执行一次

  // 当选择排序选项时，更新排序并更新 URL
  const handleSortChange = (order, label) => {
    setSelectedSort(label) // 更新显示的排序文本
    onSortChange(order) // 传递排序方式给父组件

    // 更新 URL，保持浏览器地址栏的排序参数
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('order', order) // 设置排序方式
    window.history.pushState(null, '', '?' + urlParams.toString()) // 更新 URL
  }

  return (
    <div className={`dropdown ${styles.sortDropdown}`}>
      <button
        className={`btn dropdown-toggle ${styles.sortButton}`}
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
      >
        {selectedSort} {/* 显示当前选中的排序方式 */}
      </button>
      <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
        <li>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => handleSortChange('DESC', '由新到舊')} // 由新到舊
          >
            由新到舊
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => handleSortChange('ASC', '由舊到新')} // 由舊到新
          >
            由舊到新
          </button>
        </li>
      </ul>
    </div>
  )
}

export default SortDropdown
