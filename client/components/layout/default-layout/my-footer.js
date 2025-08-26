import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faLine,
} from '@fortawesome/free-brands-svg-icons'

const DefaultFooter = () => (
  <footer className="footer">
    <div className="container px-5">
      <div className="row row-cols-1 row-cols-md-4 py-5">
        <div className="col d-flex align-items-center flex-column flex-xl-row custom-flex-column">
          <img
            src="/homepage/LightBoldLogo.svg"
            alt="帕格尼尼 Paganini"
            className="img-fluid"
            style={{ width: '100px', height: 'auto', marginTop: '-13px' }}
          />
          <h4 className="ms-0 ms-xl-3 mt-2 mt-xl-0 mb-3">PAGANINI</h4>
        </div>
        <div className="col custom-flex-column">
          <h5 className="pb-3 h6Bold text-center">Services</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a
                href="/product"
                className="nav-link p-0 text-white text-center"
              >
                提琴專區
              </a>
            </li>
            <li className="nav-item mb-3">
              <a href="/course" className="nav-link p-0 text-white text-center">
                專業課程報名
              </a>
            </li>
            <li className="nav-item mb-3">
              <a href="/blog" className="nav-link p-0 text-white text-center">
                部落格
              </a>
            </li>
          </ul>
        </div>
        <div className="col custom-flex-column">
          <h5 className="pb-3 text-center h6Bold">About us</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a href="/#" className="text-center nav-link p-0 text-white">
                關於帕格尼尼
              </a>
            </li>
            <li className="nav-item mb-3">
              <a href="/shop" className="text-center nav-link p-0 text-white">
                門市資訊
              </a>
            </li>
          </ul>
        </div>
        <div className="col  text-center">
          <h4 className="pb-3 h6Bold custom-flex-column">Stay in touch</h4>
          <ul className="nav d-flex justify-content-center gap-3 ax-auto">
            {/* Instagram */}
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="18px"
                  height="18px"
                >
                  <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    fill="#e2ddd6"
                  />
                </svg>
              </div>
            </li>
            {/* Facebook */}
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="18px"
                  height="18px"
                >
                  <path
                    d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                    fill="#e2ddd6"
                  />
                </svg>
              </div>
            </li>
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="18px"
                  height="18px"
                >
                  <path
                    fill="#fefbf6"
                    d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                  />
                </svg>
              </div>
            </li>
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="18px"
                  height="18px"
                >
                  <path
                    fill="#fefbf6"
                    d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
                  />
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between py-5">
        <p className="footerFont">
          © 2024 帕格尼尼
          本網站為資展國際(資策會)_前端工程師57期第二組成果作品，僅供學習、展示
        </p>
      </div>
    </div>
  </footer>
)

const PhoneFooter = () => (
  <footer className="footer pt-3">
  <div className="container px-1 mt-3">
    <div className="row">
      {/* Services Section */}
      <div className="col text-center">
        <h5 className="pb-3 h6Bold" style={{ fontSize: '13px' }}>
          Services
        </h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <a
              href="/product"
              className="nav-link p-0 text-white text-center"
              style={{ fontSize: '13px' }}
            >
              提琴專區
            </a>
          </li>
          <li className="nav-item mb-3">
            <a
              href="/course"
              className="nav-link p-0 text-white text-center"
              style={{ fontSize: '13px' }}
            >
              專業課程報名
            </a>
          </li>
          <li className="nav-item mb-3">
            <a
              href="/blog"
              className="nav-link p-0 text-white text-center"
              style={{ fontSize: '13px' }}
            >
              部落格
            </a>
          </li>
        </ul>
      </div>

      {/* About Us Section */}
      <div className="col text-center">
        <h5 className="pb-3 h6Bold" style={{ fontSize: '13px' }}>
          About us
        </h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <a
              href="/#"
              className="text-center nav-link p-0 text-white"
              style={{ fontSize: '13px' }}
            >
              關於帕格尼尼
            </a>
          </li>
          <li className="nav-item mb-3">
            <a
              href="/shop"
              className="text-center nav-link p-0 text-white"
              style={{ fontSize: '13px' }}
            >
              門市資訊
            </a>
          </li>
        </ul>
      </div>

      {/* Stay in Touch Section */}
      <div className="col text-center ">
        <h4 className="pb-3 h6Bold custom-flex-column" style={{ fontSize: '13px' }}>
          Stay in touch
        </h4>
        <ul className="nav d-flex justify-content-center gap-2 ax-auto">
          {/* Instagram */}
          <li className="nav-item d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-center">
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="14px"
                  height="14px"
                >
                  <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    fill="#e2ddd6"
                  />
                </svg>
              </div>
            </li>
            {/* Facebook */}
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="14px"
                  height="14px"
                >
                  <path
                    d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                    fill="#e2ddd6"
                  />
                </svg>
              </div>
            </li>
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="14px"
                  height="14px"
                >
                  <path
                    fill="#fefbf6"
                    d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
                  />
                </svg>
              </div>
            </li>
            <li className="nav-item d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="14px"
                  height="14px"
                >
                  <path
                    fill="#fefbf6"
                    d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
                  />
                </svg>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <hr />
    <div className="text-center py-3">
      <p className="footerFont px-3"  style={{ fontSize: '13px' }}>
        © 2024 帕格尼尼 本網站為資展國際(資策會)_前端工程師57期第二組成果作品，僅供學習、展示
      </p>
    </div>
  </div>
</footer>

)

export default function MyFooter() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth <= 390)
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile ? <PhoneFooter /> : <DefaultFooter />
}