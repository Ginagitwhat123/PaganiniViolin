import React, { useState } from 'react'
import Image from 'next/image'
import styles from './course.module.scss'

const CourseSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesPerPage = 5
  const totalSlides = 7
  const maxSlideIndex = totalSlides - slidesPerPage + 1

  // 課程資料陣列
  const courses = [
    {
      id: 39, // 唯一標識
      title: '小提琴獨奏技巧班',
      description: '學員將學習複雜的獨奏技巧，並練習如帕格尼尼和維尼亞夫斯基的獨奏作品，提升舞台表現力。',
    },
    {
      id: 40,
      title: '小提琴基礎入門',
      description:
        '學員將學習簡單的樂譜閱讀和音準練習及如何正確持琴、使用弓法。',
    },
    {
      id: 36,
      title: '幼兒小提琴課程',
      description: '通過遊戲和故事的方式，讓孩子們接觸小提琴。課程內容包括認識樂器、基本持琴姿勢、簡單的弓法練習，並培養孩子的音樂感知力。',
    },
    {
      id: 34,
      title: '小提琴基礎入門',
      description:
        '本課程將介紹如何正確持弓、指法練習以及簡單的曲目演奏，為學員打下堅實的基礎。',
    },
    {
      id: 44,
      title: '小提琴高難度曲目班',
      description: '本課程將學習如柴可夫斯基和西貝流士的高難度小提琴曲目，提升技巧的精確性和演奏自信。',
    },
    {
      id: 16,
      title: '大提琴基礎入門',
      description: '學員將學習如何正確持琴、使用弓法，以及簡單的樂譜閱讀和音準練習。',
    },
    {
      id: 47,
      title: '中提琴高段班',
      description: '針對有經驗的中提琴手，專注於高難度曲目的演奏。',
    },
  ]

  const handleNext = () => {
    if (currentSlide < maxSlideIndex) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const updateSlidePosition = {
    transform: `translateX(-${(currentSlide * 100) / slidesPerPage}%)`,
  }
  //圖片

  return (
    <section className={`${styles.sectionPadding} ${styles.darkBg}`}>
      <div className="container">
        <div className={`d-flex align-items-end mb-md-5 `}>
          <Image
            src="/homepage/COURSE.png"
            alt="Image"
            width={500}
            height={100}
            className={`homepage-fluid  ${styles.aboutLogo}`}
          />
          <h3
            className={`m-0 h3Bold fontLightOpacity  ${styles.subTitle} ms-3`}
          >
            專業課程
          </h3>
        </div>
        <h3
          className={`m-0 h4Bold fontLightOpacity ${styles.subTitlePhone} mt-4`}
        >
          專業課程
        </h3>

        <div className={` ${styles.phoneContainer} d-flex align-items-start`}>
          <h5
            className={`${styles.verticalText}  lh-1-5 fontLightOpacity mt-4`}
            style={{ left: '272px' }}
          >
            提<br />升<br />音<br />樂<br />素<br />養<br />與<br />表<br />現
            <br />力<br />。
          </h5>
          <h5 className={`${styles.verticalText} lh-1-5 fontLightOpacity mt-4`}>
            精<br />選<br />小<br />提<br />琴<br />課<br />程<br />，<br />專
            <br />為<br />不<br />同<br />程<br />度<br />學<br />員<br />設
            <br />計
          </h5>
        </div>
      </div>

      <div className={styles.courseContainer}>
        <div className={styles.contentSlider}>
          <div className={styles.sliderContainer} style={updateSlidePosition}>
            {courses.map((course, index) => (
              <div
                key={index}
                className={`${styles.slide} ms-md-5 ${
                  index % 2 === 0 ? styles.mt5 : ''
                } ${index % 2 === 1 ? styles.paddingTop : ''}`}
              >
                <div className={` ${styles.card} me-md-5 fontLight `}>
                  <img
                    src={`/homepage/course${index + 1}.png`}
                    alt={course.title}
                    className={styles.courseImage}
                  />

                  <div className={styles.overlay}>
                    <h2>{`0${index + 1}`}</h2>
                    <p className={`mt-3 mb-4 fontLight h6Bold`}>
                      {course.title}
                    </p>
                    <p
                      className={`${styles.courseDescription} web-16px-light px-5 text-center m-0`}
                    >
                      {course.description}
                    </p>
                    <a
                      href={`/course/${course.id}`} // 動態生成的連結
                      className={`${styles.viewMore} fontLight px-3 mt-4`}
                    >
                     立即報名
                    </a>
                  </div>
                </div>
                <a className={`${styles.courseTitle} mt-3 fontLight h6Bold`}
                href={`/course/${course.id}`} 
                >
                  {course.title}
                </a>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.arrowLeft} onClick={handlePrev}>
          &lt;
        </button>
        <button className={styles.arrowRight} onClick={handleNext}>
          &gt;
        </button>
      </div>
    </section>
  )
}

export default CourseSection
