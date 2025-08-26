// components/blog/common/search-bar/search-bar.js

import React, { useState } from 'react'
import { IoSearch, IoCloseCircleOutline } from 'react-icons/io5' // 引入叉叉图标
import styles from './search-bar.module.scss'

const SearchBar = ({ search, onSearchChange }) => {
  const [inputValue, setInputValue] = useState(search)

  // 处理输入框的变化
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  // 处理提交或按下回车键
  const handleSearch = () => {
    onSearchChange(inputValue) // 通知父组件进行搜索

    // 更新 URL 查询参数
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('search', inputValue) // 更新 search 参数
    window.history.pushState({}, '', '?' + urlParams.toString()) // 更新浏览器的 URL
  }

  // 清除搜索框
  const handleClear = () => {
    setInputValue('') // 清空输入框
    onSearchChange('') // 通知父组件清空搜索

    // 清除 URL 中的 search 参数
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.delete('search')
    window.history.pushState({}, '', '?' + urlParams.toString()) // 更新浏览器的 URL
  }

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="搜尋"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch() // 按回车进行搜索
        }}
      />
      {/* 叉叉图标，点击清除搜索框 */}
      {inputValue && (
        <button className={styles.clearButton} onClick={handleClear}>
          <IoCloseCircleOutline size={20} />
        </button>
      )}
      <button className={styles.button} onClick={handleSearch}>
        <IoSearch size={20} />
      </button>
    </div>
  )
}

export default SearchBar
