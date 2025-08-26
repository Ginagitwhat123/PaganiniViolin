import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { removeFav } from '@/services/user'
import { removeCourseFav } from '@/services/user'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import MemberCenterLayout from '@/components/MemberCenter/MemberCenterLayout'
import tabStyle from './tab.module.scss'
import styles from '@/styles/member-center/like.module.scss'
import { BsHeartFill } from 'react-icons/bs'

// Tab 內容元件
function Products() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/product-favorites`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (data.status === 'success') {
          setFavorites(data.data.favorites)
        }
      } catch (error) {
        console.error('無法取得收藏清單:', error)
      }
    }

    fetchFavorites()
  }, [])

  const router = useRouter()

  const handleCardClick = (id) => {
    // 點擊收藏商品後導向商品詳細頁
    router.push(`/product/${id}`)
  }

  const handleRemoveFav = async (pid) => {
    const result = await Swal.fire({
      title: '確定要移除收藏嗎？',
      text: '此動作將從您的收藏清單中移除該商品。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      cancelButtonColor: '#803D3B',
      customClass: {
        title: 'swal2-custom-title',
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button',
      },
    })

    if (result.isConfirmed) {
      try {
        const res = await removeFav(pid)
        if (res.data.status === 'success') {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((product) => product.product_id !== pid)
          )
          toast.success('商品已取消收藏!')
        } else {
          toast.error(res.data.message || '取消收藏失敗')
        }
      } catch (error) {
        console.error('取消收藏失敗:', error)
        toast.error('系統錯誤，請稍後再試')
      }
    }
  }
  return (
    <>

      <div className={`${tabStyle.tabContent}`}>
        <div className={`${tabStyle.scroll}`}>
          <div className="row">

            {/* 大尺寸時 */}
            <div className={styles.contentLg}>
              {favorites.map((product) => (
                <div
                  key={product.product_id}
                  className={styles.tabContent}
                  onClick={() => handleCardClick(product.product_id)}
                  style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                >
                  <Image
                    src={`/product-pics/${product.brand_name}/${product.first_picture}`}
                    className={styles.favPic}
                    width={130}
                    height={130}
                    alt={product.product_name}
                    onClick={() => handleCardClick(product.product_id)}
                    style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                  />

                  <div className={styles.productTitleArea}>
                    <h5 className="fontDarkBrown web-16px-B">
                      {product.brand_name}
                    </h5>
                    <h5 className="fontDarkBrown web-16px-B">
                      {product.product_name}
                    </h5>
                  </div>
                  <h5 className="fontDarkBrown h6Bold">
                    NT${product.display_price.toLocaleString()}
                  </h5>
                  <div className={styles.handleArea}>
                    <button className={`${styles.BuyBtn} fontDarkBrown`}>
                      前往選購商品
                    </button>
                    <button
                      className={styles.removeLikeBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFav(product.product_id)
                      }}
                    >
                      移除收藏
                    </button>
                  </div>
                </div>
              ))}
            </div>


            {/* 小尺寸時 */}
            <div className={styles.contentSm}>
              {favorites.map((product) => (
                <div
                  key={product.product_id}
                  className={styles.tabContent}
                  onClick={() => handleCardClick(product.product_id)}
                  style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                >
                  <Image
                    src={`/product-pics/${product.brand_name}/${product.first_picture}`}
                    className={styles.favPic}
                    width={130}
                    height={130}
                    alt={product.product_name}
                    onClick={() => handleCardClick(product.product_id)}
                    style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                  />

                  <div className={styles.infoArea}>
                    <div className={styles.productTitleArea}>
                      <h5 className={`${styles.brandName} fontDarkBrown web-16px-B`}>
                        {product.brand_name}
                      </h5>
                      <h5 className={`${styles.productName} fontDarkBrown web-16px-B`}>
                        {product.product_name}
                      </h5>
                      <h5 className={`${styles.price} fontDarkBrown h6Bold mb-3`}>
                        NT${product.display_price.toLocaleString()}
                      </h5>
                    </div>

                    <div className={styles.handleArea}>
                      <button className={`${styles.BuyBtn} fontDarkBrown`}>
                        前往選購商品
                      </button>
                      <button
                        className={styles.removeLikeBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFav(product.product_id)
                        }}
                      >
                        移除收藏
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
// 課程 Tab 內容元件
function Courses() {
  const [favorites, setFavorites] = useState([])
  const router = useRouter()
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/course-like`, {
          credentials: 'include',
        })
        const data = await response.json()
        if (data.status === 'success') {
          setFavorites(data.data.favorites)
        }
      } catch (error) {
        console.error('無法取得收藏清單:', error)
      }
    }

    fetchFavorites()
  }, [])

  const handleCardClick = (id) => {
    // 點擊收藏商品後導向商品詳細頁
    router.push(`/course/${id}`)
  }

  const handleRemoveFav = async (cid) => {
    const result = await Swal.fire({
      title: '確定要移除收藏嗎？',
      text: '此動作將從您的收藏清單中移除該課程。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      cancelButtonColor: '#803D3B',
      customClass: {
        title: 'swal2-custom-title',
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button',
      },
    })

    if (result.isConfirmed) {
      try {
        const res = await removeCourseFav(cid)
        if (res.data.status === 'success') {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((course) => course.course_id !== cid)
          )
          toast.success('此課程已取消收藏!')
        } else {
          toast.error(res.data.message || '取消收藏失敗')
        }
      } catch (error) {
        console.error('取消收藏失敗:', error)
        toast.error('系統錯誤，請稍後再試')
      }
    }
  }

  return (
    <div className={`${tabStyle.tabContent}`}>
      <div className={`${tabStyle.scroll}`}>
        {favorites.map((course) => (
          <>
            <div
              key={course.course_id}
              className={styles.card}
              // onClick={() => handleCardClick(course.course_id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`d-flex ${styles['heart-img']}`}>
                <BsHeartFill
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFav(course.course_id)
                  }}
                  className={styles['heart']}
                />
                <div className={`d-flex ${styles['img-container']}`}>
                  <Image
                    src={`/images/course/${course.course_img}`}
                    alt={course.course_img}
                    width={500}
                    height={200}
                    className={styles['card-img']}
                  />
                  <div className={`fontDarkBrown ${styles['course-title']}`}>
                    <h5 className={`h6Bold ${styles['name']}`}>
                      {course.course_name}
                    </h5>
                    <h6 className={`p-14pt-B ${styles['teacher']}`}>
                      {`${course.course_teacher} 老師`}
                    </h6>
                  </div>
                </div>
              </div>
              <div className={`h6Bold fontDarkBrown ${styles['course-price']}`}>
                {`NT$ ${course.course_price.toLocaleString()} /期`}
              </div>
              <div className={`${styles['button-container']}`}>
                <div
                  className={`btn web-16px-md ${styles['button']}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = 'https://www.surveycake.com/s/vNL0O'
                  }}
                >
                  立即報名
                </div>
              </div>
            </div>
            <div
              key={course.course_id}
              className={styles.cardSM}
              // onClick={() => handleCardClick(course.course_id)}
              style={{ cursor: 'pointer' }}
            >

              <div className={`d-flex ${styles['img-container']}`}>
                <Image
                  src={`/images/course/${course.course_img}`}
                  alt={course.course_img}
                  width={500}
                  height={200}
                  className={styles['card-img']}
                />
                <div className={`fontDarkBrown ${styles['course-title']}`}>
                  <div className={`web-16px-B ${styles['name']}`}>
                    {course.course_name}
                  </div>
                  <div className={`p-14pt-B ${styles['teacher']}`}>
                    {`${course.course_teacher} 老師`}
                  </div>
                  <div className={`web-16px-B fontDarkBrown ${styles['course-price']}`}>
                    {`NT$ ${course.course_price.toLocaleString()} /期`}
                  </div>
                </div>
              </div>
              <div className={`mx-1 ${styles['button-container']}`}>
                <div className={`btn p-14pt-M  ${styles['heart-btn']}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFav(course.course_id)
                  }}>
                  移除收藏
                </div>
                <div
                  className={`btn p-14pt-M ${styles['button']}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = 'https://www.surveycake.com/s/vNL0O'
                  }}
                >
                  立即報名
                </div>

              </div>
            </div>

            <hr className={styles['custom-hr']} />
          </>
        ))}
      </div>
    </div>
  )
}

function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1')

  // 根據 activeTab 狀態顯示對應的內容
  const renderContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <Products />
      case 'tab2':
        return <Courses />
      default:
        return null
    }
  }

  return (
    <MemberCenterLayout>
      <div className="container">
        <div className={`${tabStyle.tabButtons}`}>
          <button
            onClick={() => setActiveTab('tab1')}
            className={`${activeTab === 'tab1' ? tabStyle.active : ''} ${styles.tabTitle
              } fontDarkBrown`}
          >
            商品
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={`${activeTab === 'tab2' ? tabStyle.active : ''} ${styles.tabTitle
              } fontDarkBrown`}
          >
            課程
          </button>
        </div>
        <div className={`${tabStyle.tabContent}`}>{renderContent()}</div>
      </div>
    </MemberCenterLayout>
  )
}

export default Tabs
