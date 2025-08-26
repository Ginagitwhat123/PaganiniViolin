// components/blog/common/titles/filter-title.js

import React from 'react'
import styles from './filter-title.module.scss' // 根據實際路徑調整

const FilterTitle = ({ children }) => {
  return <div className={styles.filterTitle}>{children}</div>
}

export default FilterTitle
