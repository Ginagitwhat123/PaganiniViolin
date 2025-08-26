import React from 'react'
import { IoSearch } from 'react-icons/io5'
import styles from './search-bar.module.scss'

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="搜尋" />
      <button>
        <IoSearch size={20} />
      </button>
    </div>
  )
}

export default SearchBar
