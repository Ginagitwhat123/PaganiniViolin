import { useState } from 'react'
import Image from 'next/image'
import styles from './select.module.scss'

export default function Page3() {
  // 每組圖片的描述數據，新增 link 屬性
  const descriptions = [
    {
      title: 'ISVA-Guadagnini1786-中提琴',
      price: 'NT$138,000',
      info: `Mastrer大師經典款系列，以1vs1復刻經典名琴設計理念，致敬16世紀最偉大的製琴大師們：Nicolò Amati（尼古拉．阿瑪蒂）、Guarneri del Gesù（朱塞佩．瓜奈里．耶穌）、Antonio Stradivari（安東尼奧．史特拉第瓦里），選用頂級的義大利雲杉木、義大利琴漆，依照名琴模型原始數據製作，最後搭配幾十道精細的油漆工藝，將名琴完美復刻呈現，目前有近10種琴型選擇。`,
      images: ['/homepage/violin1.png', '/homepage/violin2.png'],
      link: '/product/26', // 新增的連結屬性
    },
    {
      title: 'HeinrichGill-X5-大提琴',
      price: 'NT$439,000',
      info: `Heinrich Gill(簡稱HG)，成立至今已經60年，是德國知名提琴工作室，雙方在工藝交流時曾經提到，最好的提琴製作始於對木材的仔細和經驗豐富的選擇！因為嚴格的木材選擇過程，在國際上是首屈一指，並將科學測量與訓練有素的專家眼睛相結合，建立了一套非常可靠的測量系統，來評估木材最重要的特性。`,
      images: ['/homepage/violin3.png', '/homepage/violin4.png'],
      link: '/product/111', // 新增的連結屬性
    },
    {
      title: 'ISVA-CarloTononi-1699-中提琴',
      price: 'NT$138,000',
      info: `Mastrer大師經典款系列，以1vs1復刻經典名琴設計理念，致敬16世紀最偉大的製琴大師們：Nicolò Amati（尼古拉．阿瑪蒂）、Guarneri del Gesù（朱塞佩．瓜奈里．耶穌）、Antonio Stradivari（安東尼奧．史特拉第瓦里），選用頂級的義大利雲杉木、義大利琴漆，依照名琴模型原始數據製作，最後搭配幾十道精細的油漆工藝，將名琴完美復刻呈現，目前有近10種琴型選擇。`,
      images: ['/homepage/violin5.png', '/homepage/violin6.png'],
      link: '/product/25', // 新增的連結屬性
    },
    {
      title: 'HeinrichGill-W1-中提琴',
      price: 'NT$150,000',
      info: `Heinrich Gill(簡稱HG)，成立至今已經60年，是德國知名提琴工作室，雙方在工藝交流時曾經提到，最好的提琴製作始於對木材的仔細和經驗豐富的選擇！因為嚴格的木材選擇過程，在國際上是首屈一指，並將科學測量與訓練有素的專家眼睛相結合，建立了一套非常可靠的測量系統，來評估木材最重要的特性。`,
      images: ['/homepage/violin7.png', '/homepage/violin8.png'],
      link: '/product/106', // 新增的連結屬性
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex(
      (currentIndex - 1 + descriptions.length) % descriptions.length
    )
  }

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % descriptions.length)
  }

  return (
    <>
      <section className={`${styles.sectionPadding} ${styles.paperBg}`}>
        <div className="container">
          <div className="d-flex align-items-end mb-md-5">
            <Image
              src="/homepage/section.png"
              alt="Image"
              width={500}
              height={100}
              className={` ${styles.aboutLogo} homepage-fluid `}
            />
            <h3 className={`m-0 h3Bold fontDarkBrown ${styles.subTitle}`}>
              精選提琴
            </h3>
          </div>
          <h3 className={`m-0 h4Bold fontDarkBrown ${styles.subTitlePhone} mt-4`}>
            精選提琴
          </h3>

          <div className="row pt-5">
            {/* 左邊提琴輪播 */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
              <div id="violinCarousel" className="carousel slide">
                <div className="carousel-inner">
                  {descriptions.map((desc, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === currentIndex ? 'active' : ''
                      }`}
                    >
                      <div
                        className={`${styles.violinMx} d-flex justify-content-center`}
                      >
                        {desc.images.map((imgSrc, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={imgSrc}
                            width={195}
                            height={600}
                            className={`${styles.image}`}
                            alt={`violin ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className={`${styles.carouselControlPrev} `}
                  type="button"
                  onClick={handlePrev}
                >
                  <span
                    className={`${styles.carouselControlPrevIcon}`}
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  className={`${styles.carouselControlNext} `}
                  type="button"
                  onClick={handleNext}
                >
                  <span
                    className={`${styles.carouselControlNextIcon}`}
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </div>

            {/* 右邊區域 */}
            <div
              className="col-lg-6 ps-md-5 d-flex flex-column justify-content-center"
              style={{ height: '500px' }}
            >
              <div
                id="violinDescription"
                className="d-flex flex-column flex-md-row justify-content-between align-items-md-center"
              >
                <h2 className={`h3Bold fontDarkBrown ${styles.responsiveTitle}`}>
                  {descriptions[currentIndex].title}
                </h2>
                <h4 className="text-muted fontDarkBrown mt-2 mt-md-0">
                  {descriptions[currentIndex].price}
                </h4>
              </div>
              <hr className="mt-0 mb-5" />
              <p
                className="mb-5 fontDarkBrown"
                dangerouslySetInnerHTML={{
                  __html: descriptions[currentIndex].info,
                }}
              ></p>
              <a
                href={descriptions[currentIndex].link}
                className={`${styles.aboutBtn} btn`}
              >
                View More
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
