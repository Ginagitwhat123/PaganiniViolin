import Image from 'next/image'
import styles from './about.module.scss'

export default function Page2() {
  return (
    <>
      <section className={`${styles.aboutBg} ${styles.darkBg}`}>
        {/* 手機版專用影片及 Logo 和文字 */}
        <div className={styles.videoContainer}>
          {/* Logo 和垂直文字 */}
          
          <div className={`${styles.overlayContent}`}>
            <Image
              src="/homepage/LightBoldLogo.svg"
              alt="Logo"
              width={170}
              height={170}
              className={styles.overlayLogo}
            />
            <p className={`${styles.verticalText} `}>帕 格 尼 尼</p>
          </div>

          {/* 手機版影片 */}
          <div className={`${styles.mask}`}></div>
          <video
            src="/mp4/video2.mp4"
            autoPlay
            muted
            loop
            className={styles.aboutVideoMobile}
          >
            您的瀏覽器不支援影片播放。
          </video>
        </div>
        {/* Video 1 */}
        <video
          src="/mp4/video1.mp4"
          autoPlay
          muted
          loop
          className={styles.aboutVideo1}
        >
          您的瀏覽器不支援影片播放。
        </video>

        {/* Video 2 */}
        <video
          src="/mp4/video2.mp4"
          autoPlay
          muted
          loop
          className={styles.aboutVideo2}
        >
          您的瀏覽器不支援影片播放。
        </video>

        {/* Video 3 */}
        <video
          src="/mp4/video3.mp4"
          autoPlay
          muted
          loop
          className={styles.aboutVideo3}
        >
          您的瀏覽器不支援影片播放。
        </video>

        {/* 其他內容 */}
        <div className="container">
          <div className={`d-flex align-items-end ${styles.aboutLogo}`}>
            <Image
              src="/homepage/ABOUT.png"
              alt="Image"
              width={500}
              height={400} // 這裡你可以根據需求設定圖片高度
              className="img-fluid"
            />
          </div>
          <h5 className={`${styles.subTitleMargin} fontLight `}>
            "關於帕格尼尼，用心詮釋音樂中的每一絲美好"
          </h5>

          <div className={`${styles.aboutPBox} mx-auto`}>
            <p
              className={`lh-lg web-16px-article fontLight ${styles.phoneFont}`}
            >
              帕格尼尼提琴專賣店融合了歐洲與義大利的經典製琴技藝，精選世界頂尖大師手工打造的提琴及優質進口琴款。
              <br />
              <br />
              每一把提琴皆由匠心細作，音色悠揚如歌，手感細膩，輕觸琴弦便能引發共鳴。
              <br />
              <br />
              我們的店內匯聚來自世界各地的高品質提琴，不論是傳統工藝或現代創新，每一款樂器都經過嚴格挑選，滿足各類提琴愛好者的需求。
              <br />
              <br />
              我們不僅提供精緻樂器，還以專業的精神提供多樣化的提琴教學服務，針對不同程度的學員量身設計課程，陪伴他們在音樂之路上的每一步。
              <br />
              <br />
              帕格尼尼提琴專賣店致力於傳承製琴工藝，並精挑細選全球最頂級的提琴，為愛好者帶來最佳的音樂體驗，滿足各種演奏需求，讓每個音符充滿靈魂，展現出最純粹的音樂魅力。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
