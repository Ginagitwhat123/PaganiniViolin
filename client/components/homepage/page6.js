import React, { useState } from 'react'
import styles from './stay-in-touch.module.scss'

export default function StayInTouch() {
  const [showForm, setShowForm] = useState(false) // 狀態控制 iframe 顯示

  const handleShowForm = (e) => {
    e.preventDefault()
    setShowForm(true) // 按下按鈕後顯示 iframe
  }

  const handleCloseForm = () => {
    setShowForm(false) // 關閉 iframe
  }

  return (
    <section className={styles.stayBg}>
      <div className="container">
        <div className={`${styles.stayContent} fontLight`}>
          <h6 className="mb-5 web-16px-article">STAY IN TOUCH</h6>
          <p className="web-16px-article mb-5 fontLightOpacity">
            若您有試琴的需求，請將您的資訊填入下列表單，我們將會儘快與您聯繫，安排試琴時間!
          </p>
          {/* 預約表單按鈕 */}
          <a
            href="#"
            className={`btn ${styles.aboutBtn}`}
            onClick={handleShowForm}
          >
            預約表單
          </a>

          {/* 在按下按鈕後顯示 iframe 和關閉按鈕 */}
          {showForm && (
            <div className={styles.formContainer}>
              {/* 關閉按鈕 */}
              <button className={styles.closeButton} onClick={handleCloseForm}>
                Close
              </button>

              <iframe
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                width="100%"
                height="600px"
                src="https://www.surveycake.com/s/7ZmBn"
                style={{ border: '#ddd 1px solid' }}
                allowTransparency="true"
                frameBorder="0"
              ></iframe>
            </div>
          )}

          <p className="mt-5 web-16px-article">THANK YOU !</p>
        </div>
      </div>

      {/* 全域樣式 */}
      <style jsx>{``}</style>
    </section>
  )
}
