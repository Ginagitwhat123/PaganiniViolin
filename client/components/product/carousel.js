import { useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import styles from '@/styles/product-styles/carousel.module.scss'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

// 範例出處
// https://swiperjs.com/demos#thumbs-gallery
// https://codesandbox.io/s/k3cyyc
export default function Carousel({ pictures, brand_name }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <>
      <Swiper
        // 左右轉的按鈕樣式
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
          margin: '0 20px'
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper2}
      >
        {pictures.map((picture, index) => (
          <SwiperSlide key={index}>
            <img src={`/product-pics/${brand_name}/${picture}`} alt={`product ${index}`} style={{objectFit: 'contain'}}/>
          </SwiperSlide>
        ))}

      </Swiper>
      <Swiper
        style={{
          margin: '25px 20px',
        }}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper}
      >
        {pictures.map((picture, index) => (
          <SwiperSlide key={index}>
            <div className={styles.smallImg}>
              <img src={`/product-pics/${brand_name}/${picture}`} alt={`thumbnail ${index}`} style={{objectFit: 'contain'}}/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
