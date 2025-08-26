import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './course-detail.module.scss'

const CourseDetail = ({course}) => {
  // 將文字進行分段處理
  const info = course.course_info.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));
  const outline = course.course_outline.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));
  const sup = course.course_sup.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));
  return (

    <div className='fontDarkBrown'>
          <div>
            <Image
              src={`/images/course/${course.course_img}`}
              width={500}
              height={500}
              className={styles['course-image']}
              alt="課程圖片"
            />
          </div>

          <div className={`mt-5 mb-5 ${styles['course-content']}`}>
            <h6 className={`h6Bold mb-3 ${styles['title']}`}>◼ <span>&nbsp;&nbsp;</span>課程介紹</h6>
            <div className={`mb-5 web-16px-md ${styles['detail']}`}>{course.course_summary}</div>
            <h6 className={`h6Bold mb-3 ${styles['title']}`}>◼ <span>&nbsp;&nbsp;</span>課程說明</h6>
            <div className={`web-16px-md mb-5 ${styles['detail']}`}>{info}</div>
            <h6 className={`h6Bold mb-3 ${styles['title']}`}>◼ <span>&nbsp;&nbsp;</span>課程大綱</h6>
            <div className={`web-16px-md mb-5 ${styles['detail']}`}>{outline}</div>
            <div className={`web-16px-md mb-3 ${styles['detail']}`}>{sup}</div>
            <div className={`web-16px-md ${styles['shop-area']}`}>
              <div className={`web-16px-md ${styles['name']}`}>{course.shop_name}</div>
              <div className={`web-16px-md ${styles['address']}`}>{course.shop_address}</div>
              <div className={`web-16px-md ${styles['phone']}`}>{course.shop_phone}</div> 
              </div>
          </div>
        </div>

      

  )
}

export default CourseDetail
