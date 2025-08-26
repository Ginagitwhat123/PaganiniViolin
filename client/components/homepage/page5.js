import React from 'react';
import Image from 'next/image';
import styles from './blog.module.scss';

export default function BlogSection() {
  const blogs = [
    {
      id: 50,
      title: 'New-01',
      date: '2024/07/29',
      description: '提琴鑲線是用來裝飾嗎? 原來有十分重要的作用！',
    },
    {
      id: 49,
      title: 'New-02',
      date: '2024/07/29',
      description: '小提琴肩墊的作用',
    },
    {
      id: 48,
      title: 'New-03',
      date: '2024/07/29',
      description: '你知道小提琴的由來嗎?',
    },
    {
      id: 47,
      title: 'New-04',
      date: '2024/08/26',
      description: '音樂小百科: 小、中、大提琴的異同',
    },
    {
      id: 46,
      title: 'New-05',
      date: '2024/07/27',
      description: '學音樂很多時候不應該有標準答案',
    },
    {
      id: 45,
      title: 'New-06',
      date: '2024/07/26',
      description: '琴弦更換與調音提醒',
    },
    {
      id: 44,
      title: 'New-07',
      date: '2024/07/26',
      description: '給初學者購買提琴的幾點建議',
    },
  ];

  return (
    <section className={`${styles.paperBg} ${styles.sectionPadding}`}>
      <div className="container">
        <div className="d-flex align-items-end">
          <Image
            src="/homepage/BLOG.png"
            alt="Image"
            width={500}
            height={50}
            className={`${styles.aboutLogo} img-fluid`}
          />
          <h3 className={`m-0 h3Bold fontDarkBrown ${styles.subTitle}`}>
            部落格
          </h3>
        </div>
        <h3 className={`m-0 h4Bold fontDarkBrown ${styles.subTitlePhone} mt-4`}>
          部落格
        </h3>
        <div className={`row ${styles.blogMargin}`}>
          {/* 左邊區塊 */}
          <div className="col-lg-5">
            <div
              className={`sticky-top ${styles.leftBlog}`}
              style={{ top: '150px' , zIndex: 1}}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={`/homepage/blog-img${blogs[0].id}.png`}
                  alt="右邊圖片"
                  layout="fill"
                  className={styles.image}
                />
              </div>
              <div className={`${styles.leftContainer}`}>
                <a
                  href={`/blog/${blogs[0].id}`} // 將 id 加入連結
                  className={`${styles.contentLink} fontDarkBrown ${styles.hoverLightBrown}`}
                >
                  <p>
                    <i className="fa-solid fa-fire"></i> {blogs[0].title}
                  </p>
                  <p className="m-0 web-16px-B">{blogs[0].date}</p>
                  <p className="m-0 web-16px-B">{blogs[0].description}</p>
                </a>
              </div>
            </div>
          </div>

          {/* 右邊區塊 */}
          <div className="col-lg-6 ms-auto">
            {blogs.slice(1).map((blog) => (
              <div
                key={blog.id}
                className={`${styles.content} mb-5 d-flex mx-5`}
              >
                <div className={styles.contentImage}>
                  <Image
                    src={`/homepage/blog-img${blog.id}.png`}
                    alt="右邊圖片"
                    width={260}
                    height={156}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <a
                  href={`/blog/${blog.id}`} // 將 id 加入連結
                  className={`${styles.contentLink} fontDarkBrown tsxt-start`}
                >
                  <p>
                    <i
                      className={`fa-solid fa-fire mt-2 ${styles.contentHover}`}
                    ></i>{' '}
                    {blog.title}
                  </p>
                  <p className="m-0 web-16px-B">{blog.date}</p>
                  <p className="m-0 web-16px-B">{blog.description}</p>
                </a>
              </div>
            ))}
          </div>

          {/* 更多內容按鈕 */}
          <a href="/blog" className={`${styles.aboutBtn} btn w-50 mt-md-4`}>
            view more
          </a>
        </div>
      </div>
    </section>
  );
}
