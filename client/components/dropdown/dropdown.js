import React from 'react'
import styles from './dropdown.module.scss'

const Dropdown = () => {
  return (
    <div className={`dropdown ${styles['sort-dropdown']}`}>
      <button
        className={`btn dropdown-toggle ${styles['sort-button']}`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        排序
      </button>
      <ul className={`dropdown-menu ${styles['dropdown-menu']}`}>
        <li>
          <a className={`dropdown-item ${styles['dropdown-item']}`} href="#">
            最新
          </a>
        </li>
        <li>
          <a className={`dropdown-item ${styles['dropdown-item']}`} href="#">
            最熱門
          </a>
        </li>
        <li>
          <a className={`dropdown-item ${styles['dropdown-item']}`} href="#">
            價格由高到低
          </a>
        </li>
        <li>
          <a className={`dropdown-item ${styles['dropdown-item']}`} href="#">
            價格由低到高
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Dropdown
