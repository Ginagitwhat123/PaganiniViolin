import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import CourseDetail from '@/components/course/course-detail'
import AddCourse from '@/components/course/add-course'
import { useNameAsBreadcrumb } from '@/hooks/use-name-as-breadcrumb' // 導入麵包屑名稱傳遞用的 hook
import styles from '@/styles/course-cid.module.scss'
import CourseLike from '@/components/course-like/like-icon'
import Image from 'next/image'
import CourseCard from '@/components/course/course-card'

const Course = () => {
  const router = useRouter()
  const { cid } = router.query
  const [data, setData] = useState(null)
  const [topCourse, setTopCourse] = useState([])
  const [relatedCourses, setRelatedCourses] = useState([])
  const courseGridRef = useRef(null);
  const [arrowPosition, setArrowPosition] = useState(0);
  const arrowWidth = 40; // 假設箭頭按鈕的寬度是 40px
  const [showArrows, setShowArrows] = useState(false);
  

  // 當卡片點擊時，導向該課程細節頁
  const handleCardClick = (cid) => {
    router.push(`/course/${cid}`)
  }

  // 引用麵包屑名稱 hook 變數
  const { setSubTitle } = useNameAsBreadcrumb()

  // 加載單一課程資料
  useEffect(() => {
    if (!cid) return

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/course/${cid}`)
        const result = await response.json()
        if (result.status === 'success') {
          setData(result.data.course)
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }
    }
    fetchData()
  }, [cid])

  // 設定麵包屑名稱
  useEffect(() => {
    if (data && data.course_name) {
      setSubTitle(data.course_name)
    }
  }, [data, setSubTitle])

  // 加載所有課程資料以計算點擊次數前十名(為了製作標籤)
  useEffect(() => {
    const fetchAllCourse = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/course')
        const result = await response.json()
        if (result.status === 'success') {
          const sortedCourse = result.data.course.sort(
            (a, b) => b.click_count - a.click_count
          )
          setTopCourse(sortedCourse.slice(0, 10))
        } else {
          console.error('資料結構不正確或沒有課程資料')
        }
      } catch (error) {
        console.error('無法取得所有課程資料:', error)
      }
    }
    fetchAllCourse()
  }, [])

  // 加載有興趣課程資料
  useEffect(() => {
    if (!data) return

    const fetchRelatedCourses = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/course') // 確認 API 路徑是否正確
        const result = await response.json()

        if (result.status === 'success' && Array.isArray(result.data.course)) {
          let filteredCourses = result.data.course
            .filter(
              (course) =>
                course.course_type === data.course_type && course.id !== cid
            )
            .sort((a, b) => b.click_count - a.click_count)
          setRelatedCourses(filteredCourses.slice(0, 4))
        } else {
          console.error('資料結構不正確或沒有課程資料')
        }
      } catch (error) {
        console.error('無法取得相關課程資料:', error)
      }
    }
    fetchRelatedCourses()
  }, [data, cid])

  // 計算 arrow-left 和 arrow-right 的位置
  // useEffect(() => {
  //   if (courseGridRef.current) {
  //     const courseGridWidth = courseGridRef.current.offsetWidth;
  //     const windowWidth = window.innerWidth;
  //     setArrowPosition((windowWidth - courseGridWidth) / 2 - arrowWidth );
  //   }
  // }, [relatedCourses]);

  const scrollLeft = () => {
    courseGridRef.current.scrollBy({left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    courseGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // 自動輪播
  useEffect(() => {
    let interval;
  
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        if (!interval) {
          interval = setInterval(() => {
            if (courseGridRef.current) {
              const { scrollLeft, clientWidth, scrollWidth } = courseGridRef.current;
  
              if (scrollLeft + clientWidth >= scrollWidth) {
                // 平滑滾動到最後一項
                courseGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  
                // 在動畫完成後，瞬間重置滾動位置到起點
                setTimeout(() => {
                  courseGridRef.current.scrollLeft = 0;
                }, 500); // 500 毫秒後重置
              } else {
                // 平滑滾動
                courseGridRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }
          }, 3000); // 每 3 秒滾動一次
        }
      } else {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };
  
    handleResize();
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      if (interval) clearInterval(interval);
    };
  }, [relatedCourses]);
  const handleMouseEnter = () => {
    setShowArrows(true);
  };

  const handleMouseLeave = () => {
    setShowArrows(false);
  };


  const notfound = {
    height: '500px',
  }

  if (!data) return <div style={notfound}>找不到該課程</div>

  return (
    <>
      <div className="container">
        <div className="row">
          <div className={`col-md-8 d-flex fontDarkBrown mt-3`}>
            <div className={` ${styles['top-title']} `}>
              <h2 className="h2Bold ">{data.course_name}</h2>
              <div className="btn align-items-center align-self-center">
                <CourseLike className={`${styles['heart']}`} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-8 course-content">
            <CourseDetail course={data} />
          </div>
          <div className="col-lg-4 mb-5">
            <AddCourse course={data} topCourses={topCourse} />
          </div>
        </div>
        <div className={`h5Bold fontDarkBrown my-3 ${styles['relative-title']} `}>
          你可能有興趣的課程
        </div>

        {/* 左右箭頭 */}
        {/* <button className={`${styles['arrow']} ${styles['arrow-left']}`} onClick={scrollLeft}
         style={{ left: `${arrowPosition}px` }}>
          &lt;
        </button>
        <button className={`${styles['arrow']} ${styles['arrow-right']}`} onClick={scrollRight}
         style={{ right: `${arrowPosition}px`}}>
          &gt;
        </button> */}

        <div className={styles['course-container']} onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {showArrows && (
            <>
              <button className={`${styles['arrow']} ${styles['arrow-left']}`} onClick={scrollLeft}>
                &lt;
              </button>
            </>
          )}
        <div className={`d-flex  ${styles['course-grid']} `} ref={courseGridRef}>
          {relatedCourses.map((course) => (
            //   <CourseCard key={course.id} course={course} />
            <div key={course.id} className="m-3">
              <div
                className={` ${styles['course-card']} `}
                onClick={() => handleCardClick(course.id)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <Image
                    src={`/images/course/${course.course_img}`}
                    width={500}
                    height={200}
                    className={styles['card-img']}
                    alt="課程圖片"
                  />
                </div>
                <div className={`d-flex flex-column position-relative ${styles['card-body']}`}>
                 
                    <div className={styles['text']}>
                      <h5
                        className={`h6Bold fontDarkBrown ${styles['course-title']}`}
                      >
                        {course.course_name}
                      </h5>
                      <h6
                        className={`web-16px-md fontDarkBrown ${styles['course-content']}`}
                      >
                        {course.course_summary}
                      </h6>
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
                        window.location.href =
                          'https://www.surveycake.com/s/vNL0O'
                      }}
                    >
                      立即報名
                    </button>                 
                </div>
              </div>
            </div>
          ))}
           </div>
           {showArrows && (
            <>
              <button className={`${styles['arrow']} ${styles['arrow-right']}`} onClick={scrollRight}>
                &gt;
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Course
