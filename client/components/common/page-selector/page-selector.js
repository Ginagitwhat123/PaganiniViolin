import React from 'react'
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
    
    if (totalPages <= maxDisplayedPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    
    // 根據目前頁數的位置來決定要顯示哪些頁碼
    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
    } 
    else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 3; i <= totalPages - 1; i++) {
        pages.push(i);
      }
    } 
    else {
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    }
    
    pages.push(totalPages); 

    return [...new Set(pages)].sort((a, b) => a - b);
  }

  // 切換到上一頁與下一頁
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

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
        {pageNumbers.map((pageNumber, i) => (
          <React.Fragment key={pageNumber}>
            {/* 如果頁碼不連續，顯示省略符號 */}
            {i > 0 && pageNumber !== pageNumbers[i - 1] + 1 && (
              <span className={styles.dots}>...</span>
            )}
            <button
              className={`${styles.pageButton} ${
                currentPage === pageNumber  ? styles.active : ''
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
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
