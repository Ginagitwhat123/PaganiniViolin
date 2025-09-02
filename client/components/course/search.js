import React from 'react'
import styles from './search.module.scss'
import { IoSearchSharp, IoCloseCircleOutline } from 'react-icons/io5'

const SearchBar = ({ search, onSearchChange, onSearchClick, onClearSearch }) => {
  return (
    <div className={`mb-3 d-flex ${styles['search']}`}>
      <input
        type="text"
        className={`form-control ${styles['search-bar']}`}
        placeholder="搜尋"

        value={search}
        onChange={onSearchChange}
      />
      {search && (
        <button
          className={`btn ${styles['btn-clear']}`}
          onClick={onClearSearch}
        >
          <IoCloseCircleOutline size={20} />
        </button>
      )}
      <button
        className={`btn input-group-text ${styles['btn-search']}`}
        id="basic-addon2"
        onClick={onSearchClick}
      >
        <IoSearchSharp size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
