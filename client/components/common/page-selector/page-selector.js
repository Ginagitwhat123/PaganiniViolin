import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons'
import styles from '@/components/common/page-selector/page-selector.module.scss'

export default function PageSelector({
  currentPage,
  totalPages,
  onPageChange,
}) {
   // 計算要顯示的頁碼
  const getPageNumbers = () => {
    const maxDisplayedPages = 5
    const pages = []
    
    // 將 currentPage 調整為從 0 開始計算，以符合 pagination.js 的邏輯
    const zeroBasedPage = currentPage - 1
    
    if (totalPages <= maxDisplayedPages) {
      // 如果總頁數小於等於最大顯示頁數，顯示所有頁碼
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 根據目前頁數的位置來決定要顯示哪些頁碼
      if (zeroBasedPage <= 2) {
        pages.push(0, 1, 2, 3, totalPages - 1)
      } else if (zeroBasedPage >= totalPages - 3) {
        pages.push(
          0,
          totalPages - 5,
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1
        )
      } else {
        pages.push(0, zeroBasedPage - 1, zeroBasedPage, zeroBasedPage + 1, totalPages - 1)
      }
    }
    
    return [...new Set(pages)]
  }

  // 切換到上一頁
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  // 切換到下一頁
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const pageNumbers = getPageNumbers()
  return (
    <>
      <div className={styles.pageSelectorDiv}>
      <button
        type="button"
        className="border-0 bg-transparent cursor-default"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon
          icon={faCircleChevronLeft}
          className={`${styles.pageLeft} ${
            currentPage === 1 ? 'opacity-50' : ''
          }`}
        />
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((index, i) => (
          <React.Fragment key={index}>
            {/* 如果頁碼不連續，顯示省略符號 */}
            {i > 0 && pageNumbers[i] !== pageNumbers[i - 1] + 1 && (
              <span className={styles.dots}>...</span>
            )}
            <button
              className={`${styles.pageButton} ${
                currentPage === index + 1 ? styles.active : ''
              }`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        className="border-0 bg-transparent cursor-default"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon
          icon={faCircleChevronRight}
          className={`${styles.pageRight} ${
            currentPage === totalPages ? 'opacity-50' : ''
          }`}
        />
      </button>
    </div>
    </>
  )
}
