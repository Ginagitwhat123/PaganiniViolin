import React from 'react'
import style from './add-course.module.scss'
// icon
import { IoCalendarClear } from 'react-icons/io5'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import { IoTime } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import CourseLike from '@/components/course-like/like-icon'

const AddCourse = ({ course, topCourses }) => {
  const { id: course_id } = course;

  // 讓時間只顯示小時和分鐘
  const formatTime = (time) => (time ? time.slice(0, -3) : '')

  // 動態生成標籤
  const tags = []
  if (topCourses.some((topCourse) => topCourse.id === course.id)) {
    tags.push('#熱門課程')
  }
  if (course.course_discount_price) {
    tags.push('#報名優惠中')
  }
  switch (course.course_type) {
    case 1:
      tags.push('#小提琴')
      break
    case 2:
      tags.push('#中提琴')
      break
    case 3:
      tags.push('#大提琴')
      break
    default:
      break
  }

  return (
    <div className={`${style['sticky-sidebar']} ${style['card']}`}>
      <div className={`card-body`}>
        <div className={`${style['course-info']}`}>
          <div className={`d-flex ${style['course-title']}`}>
            <div className={` ${style['course-name']}`}>{course.course_name}</div>
            <div className={`${style['like-icon']}`}>
            <CourseLike
                  course_id={course_id}                 
                />
            </div>
          </div>
          <div className={`d-flex align-items-center mb-3 mt-2`}>
            <div className={`me-3 ${style['icon']}`}>
              <IoCalendarClear />
            </div>
            <div className={`h6Bold ${style['title']}`}>開課日期</div>
            <div className={`px-3 h6 ${style['detail']}`}>
              {course.course_start_date}
            </div>
          </div>
          <div className={`d-flex align-items-center mb-4`}>
            <i className={`me-3 ${style['icon']}`}>
              <IoTime />
            </i>
            <div className={`h6Bold ${style['title']}`}>上課時間</div>
            <div className={`px-3 h6 ${style['detail']}`}>
              星期{course.course_weekday} {formatTime(course.course_start_time)}
              ~{formatTime(course.course_end_time)}
            </div>
          </div>
          <div className={`d-flex align-items-center mb-4`}>
            <i className={`me-3 ${style['icon']}`}>
              <IoMdPerson />
            </i>
            <div className={`h6Bold ${style['title']}`}>授課老師</div>
            <div className={`px-3 h6 ${style['detail']}`}>
              {course.course_teacher}
            </div>
          </div>
          <div className={`mb-4 ${style['tags']}`}>
            {tags.map((tag, index) => (
              <span key={index} className={`${style['tag']}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`d-flex justify-content-between align-items-end mb-3 ${style['price']}`}
        >
          <span
            className={`web-16px-md mx-2 ${style['price-original']}`}
          >{`NT ${course.course_price.toLocaleString()}`}</span>
          <h3
            className={`mb-0 h3Bold ${style['discount-price']}`}
          >{`NT ${course.course_discount_price.toLocaleString()} /期`}</h3>
        </div>
        <button className={`btn w-100 web-16px-B ${style['sign-btn']}`}
        onClick={() => {
          window.location.href = "https://www.surveycake.com/s/vNL0O";
        }}>
          馬上報名
        </button>
      </div>
    </div>
  )
}

export default AddCourse
