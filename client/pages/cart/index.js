// client/page/cart/indext.js
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import styles from './cart.module.scss'
import ProductDetails from 'components/cart/productDetail'
import Modal from 'react-bootstrap/Modal' // 使用 react-bootstrap 的 Modal 元件
import Button from 'react-bootstrap/Button' // 使用 react-bootstrap 的 Button 元件
import { useOrderCoupon } from '@/hooks/order-coupon'
import Router from 'next/router'

export default function CartIndex() {
  // 購物車商品列表
  const [cartProducts, setCartProducts] = useState([]) // 儲存購物車商品資料
  const [selectAll, setSelectAll] = useState(false) // 儲存全選狀態

  // 優惠券
  const [showCouponModal, setShowCouponModal] = useState(false) // 控制 Modal 的顯示狀態
  const showCoupon = () => setShowCouponModal(true) // 顯示優惠券 Modal
  const hideCoupon = () => setShowCouponModal(false) // 隱藏優惠券 Modal
  const [validCoupons, setValidCoupons] = useState([]) // 儲存有效優惠券清單
  const [couponCode, setCouponCode] = useState('') // 儲存輸入的優惠券代碼
  const [selectedCoupon, setSelectedCoupon] = useState(null) // 儲存選擇的優惠券

  // 將訂單詳情中資料利用hook儲存
  const {
    coupon_id,
    setCoupon_id,
    totalQuantity,
    setTotalQuantity,
    totalPrice,
    setTotalPrice,
    discountedPrice,
    setDiscountedPrice,
  } = useOrderCoupon()

  // 優惠券代碼輸入處理
  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value)
  }

  // 清除選擇的優惠券
  const deleteCoupon = () => {
    setSelectedCoupon(null) // 移除已選優惠券
    setDiscountedPrice(totalPrice) // 恢復到原始總價
  }

  // 折扣後金額計算
  const applyCouponDiscount = (coupon) => {
    let discountedTotal = totalPrice
    if (coupon.type === 2) {
      // 百分比折扣
      if (coupon.max_price === 0) {
        // 沒有最大折扣限制
        discountedTotal = totalPrice * (coupon.value / 100)
      } else {
        // 有最大折扣限制
        const percentageDiscount = totalPrice * (coupon.value / 100)
        const maxDiscount = totalPrice - coupon.max_price
        discountedTotal =
          percentageDiscount < maxDiscount ? maxDiscount : percentageDiscount
      }
    } else {
      // 固定金額折扣
      discountedTotal = totalPrice - coupon.value
    }

    setDiscountedPrice(discountedTotal)
  }

  // 選擇並應用優惠券
  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon)
    setCoupon_id(coupon.coupon_id) // 保存 coupon_id 到全局狀態
    applyCouponDiscount(coupon) // 計算折扣
    hideCoupon() // 關閉優惠券選擇視窗
  }

  // API-GET(cart)-取得會員購物車內容
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/cart`, {
        credentials: 'include', // 帶入會員id用
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.status === 'success') {
        setCartProducts(result.data) // 將購物車資料設置到 cartProducts
        // console.log('API取得會員購物車資料：', result.data) // 確認抓到的資料內容

        // 檢查所有產品是否皆已勾選
        if (
          result.data.length > 0 &&
          result.data.every((product) => product.card_checked === 1)
        ) {
          console.log(
            '勾選狀態：',
            result.data.every((product) => product.card_checked)
          ) // 確認勾選狀態
          setSelectAll(true) // 設定全選狀態
        } else {
          console.log(
            '勾選狀態：',
            result.data.every((product) => product.card_checked)
          ) // 確認勾選狀態
          setSelectAll(false) // 設定全選狀態
        }
      }
    } catch (error) {
      console.error('無法取得購物車資料:', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法取得購物車資料，請稍後再試。',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  // 畫面載入時執行，抓取購物車內容
  useEffect(() => {
    fetchData()
  }, [])

  // 全選勾選狀態變更
  const handleSelectAllChange = async (e) => {
    const isChecked = e.target.checked ? 1 : 0
    setSelectAll(isChecked)

    // 更新 cartProducts 的每個項目勾選狀態
    const updatedProducts = cartProducts.map((product) => ({
      ...product,
      card_checked: isChecked,
    }))
    setCartProducts(updatedProducts)

    updateAllCheckedStatus(isChecked)
  }
  // API-PUT(updateAllChecke)-更新[全選]勾選狀態
  const updateAllCheckedStatus = async (selectAll) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart/updateAllChecked`,
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ checked: selectAll }),
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        fetchData() // 更新勾選狀態成功後，重新載入購物車內容
      } else {
        Swal.fire({
          icon: 'error',
          title: '無法更新勾選狀態',
          text: result.message,
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
      }
    } catch (error) {
      console.error('無法更新勾選狀態:', error)
    }
  }

  // API-PUT(updateChecked)-更新[單選]勾選狀態
  const updateCheckedStatus = async (product_id, size, newChecked) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/cart/updateChecked`,
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id, size, checked: newChecked }),
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        fetchData() // 更新勾選狀態成功後，重新載入購物車內容
      } else {
        Swal.fire({
          icon: 'error',
          title: '無法更新勾選狀態',
          text: result.message,
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
      }
    } catch (error) {
      console.error('無法更新勾選狀態:', error)
    }
  }

  // 當 data 更新時，重新計算 totalQuantity 和 totalPrice
  useEffect(() => {
    const selectedProducts = cartProducts.filter(
      (product) => product.card_checked === 1
    )
    const newTotalQuantity = selectedProducts.reduce(
      (total, product) => total + product.quantity,
      0
    )
    const newTotalPrice = selectedProducts.reduce(
      (total, product) =>
        total +
        (product.discount_price === null
          ? product.price
          : product.discount_price) *
          product.quantity,
      0
    )
    setTotalQuantity(newTotalQuantity)
    setTotalPrice(newTotalPrice)
    setDiscountedPrice(newTotalPrice) // 初始化為未折扣的總價
  }, [cartProducts])

  // 更新商品數量
  const updateItemQuantity = (card_id, newQuantity) => {
    const updatedData = cartProducts.map((product) =>
      product.cart_id === card_id
        ? { ...product, quantity: newQuantity }
        : product
    )
    setCartProducts(updatedData)
  }

  // 獲取有效優惠券 API
  useEffect(() => {
    // 當 Modal 開啟時抓取有效優惠券
    if (showCouponModal) {
      const fetchValidCoupons = async () => {
        try {
          const response = await fetch('http://localhost:3005/api/mycoupons', {
            method: 'GET',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
          const result = await response.json()
          if (result.status === 'success') {
            // 過濾有效且未使用的優惠券（status === 2 表示未使用）
            const activeCoupons = result.data.filter(
              (coupon) => coupon.status === 2
            )
            setValidCoupons(activeCoupons)
          } else {
            Swal.fire({
              icon: 'error',
              title: '錯誤',
              text: '無法取得優惠券清單',
              customClass: {
                title: 'swal2-custom-title',
                htmlContainer: 'swal2-custom-text',
                confirmButton: 'swal2-custom-confirm-button',
              },
            })
          }
        } catch (error) {
          console.error('取得優惠券失敗:', error)
          Swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '無法取得優惠券，請稍後再試。',
            customClass: {
              title: 'swal2-custom-title',
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button',
            },
          })
        }
      }
      fetchValidCoupons()
    }
  }, [showCouponModal]) // 依賴 showCouponModal 來監控狀態變化
  // 處理查詢優惠券

  // 使用優惠券代碼並驗證
  const applyCouponCode = async () => {
    if (!couponCode) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請輸入優惠券代碼',
      })
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3005/api/mycoupons/search',
        {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: couponCode }),
        }
      )
      const result = await response.json()

      if (result.status === 'success') {
        const selectedCoupon = result.coupon
        if (totalPrice >= selectedCoupon.min_price) {
          setSelectedCoupon(selectedCoupon)
          applyCouponDiscount(selectedCoupon)
          Swal.fire({
            icon: 'success',
            title: '成功',
            text: `優惠券「${selectedCoupon.name}」已套用`,
          })
          hideCoupon()
        } else {
          Swal.fire({
            icon: 'error',
            title: '無法使用優惠券',
            text: `此優惠券需要最低消費金額 NT$${selectedCoupon.min_price.toLocaleString()}，目前總金額不足。`,
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: result.message || '優惠券代碼無效',
        })
      }
    } catch (error) {
      console.error('優惠券代碼驗證失敗:', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法驗證優惠券代碼，請稍後再試。',
      })
    }

    setCouponCode('')
  }

  const gotoDetails = () => {
    Router.push('/cart/details')
  }

  return (
    <div className={`${styles.minHeight} container my-5 fontDarkBrown`}>
      <div className="">
        <div className="row align-items-start">
          {/* 標題區塊 */}
          <div className="col-12 col-md-auto mb-3 mb-md-0">
            <h4 className="h4Bold">購物車</h4>
          </div>

          {/* 步驟區塊 */}
          <div className="col">
            <div className="row">
              <div className="col-12 col-md-auto">
                <p className={`web-16px-B`}>
                  <span className={`${styles.step} ${styles.focus}`}>01</span>
                  購物清單
                </p>
              </div>
              <div className="col-12 col-md-auto">
                <p className={`${styles.disabled} web-16px-B`}>
                  <span className={`${styles.step}`}>02</span>
                  填寫購買資料並付款
                </p>
              </div>
              <div className="col-12 col-md-auto">
                <p className={`${styles.disabled} web-16px-B`}>
                  <span className={`${styles.step}`}>03</span> 訂單完成
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="row gap-5 fontDarkBrown">
        <div className={`${styles.bg} col-xl-8`}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="all"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <label className="form-check-label" htmlFor="all">
              全選
            </label>
          </div>
          <hr />
          {/* 商品列資料帶入 */}
          {/* <div>{console.log('商品列資料帶入：', cartProducts)}</div> */}
          {/* 商品列表渲染，並檢查 data 是否為非空陣列 */}
          {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
            cartProducts.map((product) => {
              // console.log('map:', product)
              return (
                <div key={product.cart_id} className="product">
                  <ProductDetails
                    card_id={product.cart_id}
                    product_id={product.product_id}
                    productPics={product.picture_url}
                    product_name={product.product_name}
                    brand_name={product.product_brand_name}
                    price={product.price}
                    discount_price={product.discount_price}
                    quantity={product.quantity}
                    size={product.size}
                    card_checked={product.card_checked} // 將購物車取得值傳入子元件
                    updateCheckedStatus={updateCheckedStatus} // 子元件更新勾選狀態回傳
                    updateItemQuantity={updateItemQuantity}
                    fetchData={fetchData}
                  />
                  <hr />
                </div>
              )
            })
          ) : (
            <p>目前購物車中沒有商品。</p>
          )}
        </div>

        {/* 訂單明細區域 */}
        <div className={`${styles.bg} col-xl-3`}>
          <div className="h6">訂單明細</div>
          <hr />
          {totalQuantity > 0 ? (
            <>
              <div className="d-flex justify-content-between">
                <div>共計 {totalQuantity} 件商品</div>
                <div>NT${totalPrice.toLocaleString()}</div>
              </div>
              <hr />

              <div>
                {selectedCoupon ? (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <button className="btn btn-primary" onClick={showCoupon}>
                        選擇其他優惠券
                      </button>
                      <button className="btn btn-danger" onClick={deleteCoupon}>
                        清除優惠券
                      </button>
                    </div>

                    <div>
                      {selectedCoupon.type === 2
                        ? `${selectedCoupon.value}折`
                        : `滿${selectedCoupon.min_price}折${selectedCoupon.value}`}
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>優惠券折扣</div>
                      <div>
                        -NT$
                        {totalPrice - discountedPrice}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary mb-2"
                      onClick={showCoupon}
                    >
                      選擇優惠券
                    </button>
                    <p>尚未選擇優惠券</p>
                  </>
                )}
              </div>
              <hr />
              <div className="text-end h3Bold">
                NT${discountedPrice.toLocaleString()}
              </div>
              <div
                className={`${styles.btn} ${styles.btnLike} web-16px-md`}
                onClick={gotoDetails}
              >
                前往結帳
              </div>
            </>
          ) : (
            <div className="web-16px-md">請先選擇商品</div>
          )}
        </div>
      </div>

      {/* 優惠券選擇 Modal */}
      <Modal show={showCouponModal} onHide={hideCoupon} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h4Bold fontDarkBrown">優惠券清單</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center border-bottom pb-3 fontDarkBrown">
            <input
              type="text"
              placeholder="請輸入優惠券代碼"
              value={couponCode}
              onChange={handleCouponCodeChange}
              className="form-control me-2"
            />
            <button
              onClick={applyCouponCode}
              className="btn btn-primary text-nowrap"
            >
              使用
            </button>
          </div>
          <div className="fontDarkBrown">
            {/* 優惠券清單 */}
            {validCoupons.length > 0 ? (
              validCoupons.map((coupon) => (
                <div
                  className="d-flex justify-content-between border-bottom pb-2 pt-2 align-items-center"
                  key={coupon.id}
                >
                  <div>
                    <div className="web-16px-B">
                      {coupon.name}({coupon.sid})
                    </div>
                    <div className="text-secondary">
                      {coupon.end_date == '0000-00-00'
                        ? '無使用期限'
                        : coupon.end_date}
                    </div>
                    <div className="">{coupon.info}</div>
                    <div className="">
                      {coupon.type === 2
                        ? `${coupon.value}折`
                        : `滿${coupon.min_price}折${coupon.value}`}
                    </div>
                    <div className="">
                      {totalPrice < coupon.min_price ? (
                        <span className="text-danger web-16px-B">不適用</span>
                      ) : (
                        <p>
                          折扣後金額：
                          <span className="text-danger">
                            {(() => {
                              let discountedTotal = totalPrice
                              if (coupon.type === 2) {
                                // 百分比折扣
                                if (coupon.max_price === 0) {
                                  // 沒有最大折扣限制
                                  discountedTotal =
                                    totalPrice * (coupon.value / 100)
                                } else {
                                  // 有最大折扣限制
                                  const percentageDiscount =
                                    totalPrice * (coupon.value / 100)
                                  const maxDiscount =
                                    totalPrice - coupon.max_price
                                  discountedTotal =
                                    percentageDiscount < maxDiscount
                                      ? maxDiscount
                                      : percentageDiscount
                                }
                              } else {
                                // 固定金額折扣
                                discountedTotal = totalPrice - coupon.value
                              }
                              return discountedTotal.toLocaleString()
                            })()}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <button
                      className="btn btn-secondary text-light text-nowrap"
                      onClick={() => handleSelectCoupon(coupon)}
                      disabled={totalPrice < coupon.min_price}
                    >
                      {totalPrice < coupon.min_price ? '不適用' : '選擇'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="">
                <div className="">
                  <p>目前沒有優惠券。</p>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={hideCoupon}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
