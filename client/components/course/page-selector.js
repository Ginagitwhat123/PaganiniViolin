import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import styles from './page-selector.module.scss'

const PageSelector = ({ currentPage, totalPages, onPageChange }) => {
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

  const getPages = () => {
    const pages = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 1)

    if (currentPage === 1) {
      endPage = Math.min(totalPages, 4)
    } else if (currentPage === 2) {
      endPage = Math.min(totalPages, 4)
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 3)
    } else if (currentPage === totalPages - 1) {
      startPage = Math.max(1, totalPages - 3)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = getPages()

  return (
    <div className={styles.pageSelectorDiv}>

        <button
          className={`border-0 ${styles.disabledBtn}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} className={styles.pageLeft} />
        </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`border-0 bg-transparent web-16px-B  ${
            currentPage === page ? styles.active : 'fontDarkBrown'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          className="border-0 bg-transparent"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} className={styles.pageRight} />
        </button>
      )}
    </div>
  )
}

export default PageSelector
