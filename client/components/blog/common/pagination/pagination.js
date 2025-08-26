import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import styles from './pagination.module.scss'

export default function BS5Pagination({ forcePage, onPageChange, pageCount }) {
  // Calculate the pages to be displayed based on the current page and total pages
  const getPageNumbers = () => {
    const maxDisplayedPages = 5 // Show at most 5 pages (1 + 2 before and after current + 1 last)
    const pages = []

    // If total pages are fewer than the max displayed pages, show all pages
    if (pageCount <= maxDisplayedPages) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      // Show the first page, the last page, and the current page with the previous and next 2 pages
      if (forcePage <= 2) {
        pages.push(0, 1, 2, 3, pageCount - 1)
      } else if (forcePage >= pageCount - 3) {
        pages.push(
          0,
          pageCount - 5,
          pageCount - 4,
          pageCount - 3,
          pageCount - 2,
          pageCount - 1
        )
      } else {
        pages.push(0, forcePage - 1, forcePage, forcePage + 1, pageCount - 1)
      }
    }

    // Filter out duplicates
    return [...new Set(pages)]
  }

  const handlePrevClick = (e) => {
    e.preventDefault()
    if (forcePage > 0) {
      onPageChange({ selected: forcePage - 1 })
    }
  }

  const handleNextClick = (e) => {
    e.preventDefault()
    if (forcePage < pageCount - 1) {
      onPageChange({ selected: forcePage + 1 })
    }
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={styles.pageSelectorDiv}>
      {/* 上一頁的按鈕 */}
      <button
        type="button"
        className="border-0 bg-transparent cursor-default"
        onClick={handlePrevClick}
        disabled={forcePage === 0}
      >
        <FontAwesomeIcon
          icon={faCircleChevronLeft}
          className={`${styles.pageLeft} ${
            forcePage === 0 ? 'opacity-50' : ''
          }`}
        />
      </button>

      {/* 顯示頁碼按鈕 */}
      <div className={styles.pageNumbers}>
        {pageNumbers.map((index, i) => (
          <React.Fragment key={index}>
            {i > 0 && pageNumbers[i] !== pageNumbers[i - 1] + 1 && (
              <span className={styles.dots}>...</span>
            )}
            <button
              className={`${styles.pageButton} ${
                forcePage === index ? styles.active : ''
              }`}
              onClick={() => onPageChange({ selected: index })}
            >
              {index + 1}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* 下一頁的按鈕 */}
      <button
        type="button"
        className="border-0 bg-transparent cursor-default"
        onClick={handleNextClick}
        disabled={forcePage === pageCount - 1}
      >
        <FontAwesomeIcon
          icon={faCircleChevronRight}
          className={`${styles.pageRight} ${
            forcePage === pageCount - 1 ? 'opacity-50' : ''
          }`}
        />
      </button>
    </div>
  )
}
