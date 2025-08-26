// components/blog/common/user-blog-section/action-button.js

import React from 'react'
import { AiFillBookmark, AiOutlineRead, AiFillEdit } from 'react-icons/ai'
import { IoNewspaperSharp } from 'react-icons/io5'
import styles from './action-button.module.scss'

const ActionButton = ({ label, onClick }) => {
  let icon

  switch (label) {
    case '我的收藏':
      icon = <AiFillBookmark />
      break
    case '我的部落格':
      icon = <IoNewspaperSharp />
      break
    case '發布部落格':
      icon = <AiFillEdit />
      break
    default:
      icon = null
  }

  return (
    <button className={styles.button} type="button" onClick={onClick}>
      {icon}
      {label}
    </button>
  )
}

export default ActionButton
