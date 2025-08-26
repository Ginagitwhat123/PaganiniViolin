import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './course-card.module.scss'
import CourseLike from '@/components/course-like/like-icon'

const CourseCard = ({ course, searchTerm }) => {
  const router = useRouter()
  const { id: course_id } = course

  // 當卡片點擊時，導向該課程細節頁
  const handleCardClick = (cid) => {
    router.push(`/course/${cid}`)
  }

  // 當搜尋框有輸入時，將符合搜尋字串的部分文字高亮
  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) {
      return text
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#E4C59E' }}>
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // 調整課程簡介字數
  const summary =
    course.course_summary.length > 29
      ? `${course.course_summary.substring(0, 29)}...`
      : course.course_summary

  return (
    <>
      <div className="col-lg-4 col-md-4 col-sm-6">
        <div
          className={`${styles['course-card']} `}
          onClick={() => handleCardClick(course.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles['course-card-inner']}>
            <div className={styles['course-card-front']}>
              <div>
                <Image
                  src={`/images/course/${course.course_img}`}
                  width={500}
                  height={200}
                  className={styles['card-img']}
                  alt="課程圖片"
                />
              </div>
              <div className={styles['card-body']}>
                <div className={`${styles['card-text']} position-relative`}>
                  <div className={styles['text']}>
                    <h5
                      className={`h6Bold fontDarkBrown ${styles['course-title']}`}
                    >
                      {highlightText(course.course_name, searchTerm)}
                    </h5>
                    <h6
                      className={`web-16px-md fontDarkBrown ${styles['course-content']}`}
                    >
                      {' '}
                      {highlightText(course.course_summary, searchTerm)}
                    </h6>
                  </div>
                  <div>
                    <CourseLike
                      className={styles['favorite-icon']}
                      course_id={course_id}
                    />
                  </div>
                </div>
                <div className={styles['instructor-section']}>
                  <div className={styles['instructor-info']}>
                    <Image
                      src={`/images/teacher/${course.teacher_img}`}
                      width={500}
                      height={200}
                      className={styles['instructor-avatar']}
                      alt="老師照片"
                    />
                    <span className="p-14pt-B fontDarkBrown">{`${course.course_teacher} 老師`}</span>
                  </div>
                  <div className="web-16px-B fontDarkBrown">{`NT ${course.course_price.toLocaleString()} /期`}</div>
                </div>
                <button
                  className={styles['sign-up-button']}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = 'https://www.surveycake.com/s/vNL0O'
                  }}
                >
                  立即報名
                </button>
              </div>
            </div>
            {/* <div className={styles['course-card-back']}>
            <Image
                      src={`/images/teacher/${course.teacher_img}`}
                      width={500}
                      height={200}
                      className={styles['avatar']}
                      alt="老師照片"
                    />
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseCard
