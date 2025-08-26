// components/blog/common/poster/poster.js

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import styles from './poster.module.scss'

const Poster = ({ author_name }) => {
  // 直接使用传递来的作者名
  const poster = author_name || '未知作者'

  return (
    <div className={styles.poster}>
      <div className={styles.circleBorder}>
        <FontAwesomeIcon icon={faUser} />
      </div>
      {poster}
    </div>
  )
}

export default Poster
