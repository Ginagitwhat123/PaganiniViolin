import React, { useState, useEffect } from 'react'
import styles from './shopList.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt,faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faPhone, faMapLocation } from '@fortawesome/free-solid-svg-icons'

function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [data, setData] = useState([])
  const [shopIdToScroll, setShopIdToScroll] = useState(null) // 新增狀態以存儲目標 shopId
  const MAP_API_KEY = 'AIzaSyCEPlNiDsLe6hrZDYiL304WXoAk6ut9vY8' //  Map API 金鑰

  // 初始化時根據 URL 的 hash 設定 tab 和 shopId
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const [tabPart, shopIdPart] = hash.replace('#', '').split('&')
      setActiveTab(tabPart) // 設定初始的 tab
      if (shopIdPart) {
        setShopIdToScroll(shopIdPart) // 存儲目標 shopId
      }
    }
  }, [])

  // 資料庫API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/shop')
        const result = await response.json()
        if (result.status === 'success') {
          setData(result.data.shop)
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }
    }
    fetchData()
  }, [])

  // 在資料加載完成後滾動到對應的 shopId
  useEffect(() => {
    if (data.length > 0 && shopIdToScroll) {
      const element = document.getElementById(shopIdToScroll)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setShopIdToScroll(null) // 重置狀態，避免重複滾動
        window.history.replaceState(null, null, ' ') // 清除 hash
      }
    }
  }, [data, shopIdToScroll]) // 將 data 和 shopIdToScroll 作為依賴

  // 根據 activeTab 過濾資料
  const renderContent = () => {
    let filteredData = []
    if (activeTab === 'tab1') {
      filteredData = data.filter((shop) => shop.shop_area === '北部')
    } else if (activeTab === 'tab2') {
      filteredData = data.filter((shop) => shop.shop_area === '中部')
    } else if (activeTab === 'tab3') {
      filteredData = data.filter((shop) => shop.shop_area === '南部')
    }

    // 根據 shop_address 排序
    filteredData.sort((a, b) => a.shop_address.localeCompare(b.shop_address))

    return (
      <>
        <div className="container my-4">
          {filteredData.map((item, index) => (
            <div key={index} className="row g-5 align-items-center mb-3">
              {/* 地圖 */}
              <div className="col-md-6">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${encodeURIComponent(
                    item.shop_address
                  )}`}
                  className="w-100 rounded shadow-sm"
                  height={400}
                  style={{ border: "2px solid #A68E6F" }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {/* 商店資訊 */}
              <div className="col-md-6 d-flex flex-column justify-content-center">
                <h5 className="text-primary fw-bold">{item.shop_name}</h5>
                <div className="d-flex align-items-center my-2">                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-danger me-2" />

                  <span className="text-secondary">{item.shop_address}</span>
                </div>
                <div className="d-flex align-items-center my-2">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-success me-2" />
                <span className="text-dark">{item.shop_phone}</span>
                </div>
                <hr />
                <div>
                  {item.shop_opentime.split('\n').map((line, i) => (
                    <p className="text-muted mb-1" key={i}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </>
    )
  }

  return (
    <>
      <div className="container">
        <div className={styles.tabButtons}>
          <button
            onClick={() => setActiveTab('tab1')}
            className={`${styles.tabButton} ${
              activeTab === 'tab1' ? styles.active : ''
            }`}
          >
            北部
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`${styles.tabButton} ${
              activeTab === 'tab2' ? styles.active : ''
            }`}
          >
            中部
          </button>
          <button
            onClick={() => setActiveTab('tab3')}
            className={`${styles.tabButton} ${
              activeTab === 'tab3' ? styles.active : ''
            }`}
          >
            南部
          </button>
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
    </>
  )
}

export default Tabs
