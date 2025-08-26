// components/common/loading/loading.js
import React from 'react'
import styles from './loading.module.scss'

const Loading = ({ show = true }) => {
  if (!show) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.violinContainer}>
        {/* 小提琴動畫 */}
        <img src="/loading/violin.svg" alt="Violin" className={styles.violin} />
        {/* 弓動畫 */}
        <img src="/loading/bow.svg" alt="Bow" className={styles.bow} />
        <div className={styles.loader}></div>
      </div>
    </div>
  )
}

export default Loading
