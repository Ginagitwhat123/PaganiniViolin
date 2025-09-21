import React, { useRef, useEffect, useState } from 'react'
import Swal from 'sweetalert2' // 引入 SweetAlert2 用於顯示提示訊息
import styles from './cart.module.scss'
import { useRouter } from 'next/router'
import { useOrderCoupon } from '@/hooks/order-coupon'

function Details() {
  const router = useRouter()

  const handleReturnToShoppingList = () => {
    console.log('返回購物清單按鈕被點擊')
    router.push('/cart') // 使用 router.push 導航到指定頁面
  }

  // 引用hook儲存訂單詳情內容
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
    fetchCheckedCount,
  } = useOrderCoupon()

  // ----- 狀態管理 -----
  // 表單欄位的初始狀態，包含姓名、電話、信用卡資訊、地址等
  const [formFields, setFormFields] = useState({
    name: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    cardHolder: '',
    address: '',
    cardType: '', // 信用卡種類
  })

  // 錯誤訊息狀態
  const [errors, setErrors] = useState({})

  // 儲存所有門市資料的狀態
  const [shops, setShops] = useState([])

  // 儲存使用者選擇的區域
  const [selectedArea, setSelectedArea] = useState('')
  // 儲存選擇門市
  const [selectedShop, setSelectedShop] = useState('')
  // 儲存預計取貨日
  const [pickupDate, setPickupDate] = useState('')

  // 配送資訊選項狀態
  const [deliveryOption, setDeliveryOption] = useState('宅配')
  // 運費的狀態，默認為 250
  const [deliveryFee, setDeliveryFee] = useState(250)

  // 付款方式選項狀態
  const [paymentOption, setPaymentOption] = useState('信用卡')

  // 信用卡號的輸入框參考，使用 useRef 管理
  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)
  const inputRef3 = useRef(null)
  const inputRef4 = useRef(null)
  const inputRefs = [inputRef1, inputRef2, inputRef3, inputRef4]

  // ----- API 請求 -----
  // 抓取會員資料並更新表單
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      if (result.status === 'success') {
        // 檢查電話號碼是否為 null 或 undefined
        let phone = result.data.user.phone
        if (phone) {
          // 如果電話號碼不為 null，檢查是否以 0 開頭
          phone = phone.startsWith('0') ? phone : `0${phone}`
        }
        // 更新表單欄位
        setFormFields({
          ...formFields,
          name: result.data.user.member_name || '',
          phone: phone || '', // 如果電話號碼為 null，設定為空值
          address: result.data.user.address || '',
        })
      }
    } catch (error) {
      console.error('無法取得資料:', error)
      // 顯示錯誤訊息
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法取得會員資料，請稍後再試。',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  // 抓取所有門市資料
  const fetchShops = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`)
      const result = await response.json()
      if (result.status === 'success') {
        setShops(result.data.shop) // 儲存門市資料至 shops 狀態
      }
    } catch (error) {
      console.error('無法取得資料:', error)
    }
  }

  // 在組件掛載時抓取門市資料
  useEffect(() => {
    fetchShops()
  }, [])

  // 建立訂單
  const addToOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/add`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_person: formFields.name,
          shipping_phone: formFields.phone,
          delivery_method: deliveryOption,
          delivery_address: deliveryOption === '宅配' ? formFields.address : '', // 若為宅配則填寫地址
          shop_id: selectedShop,
          come_date: pickupDate,
          payment_method: paymentOption,
          card_number: formFields.cardNumber,
          card_holder: formFields.cardHolder,
          expiry_date: formFields.expiryDate,
          security_code: formFields.securityCode,
          coupon_id, // 使用全局共享的 coupon_id
          delivery_fee: deliveryFee, // 傳遞運費
        }),
      })
      const result = await response.json()
      if (result.status === 'success') {
        await fetchCheckedCount()
        Swal.fire({
          icon: 'success',
          title: '訂單已建立！',
          text: result.message,
          confirmButtonColor: '#3085d6',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text', // 自定義文字樣式
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        }).then(() => {
          // 點擊確認後切換至完成頁面
          router.push('/cart/complete')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '無法送出訂單',
          text: '訂單送出失敗，請重試',
          confirmButtonColor: '#d33',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '無法送出訂單',
        text: '訂單送出失敗，請重試',
        confirmButtonColor: '#d33',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
      console.error('無法取得資料:', error)
    }
  }

  // 在組件掛載時抓取門市資料
  useEffect(() => {
    fetchShops()
  }, [])

  // ----- 表單處理 -----
  // 配送選項變更處理函式
  const handleDeliveryOptionChange = (e) => {
    const selectedOption = e.target.value
    setDeliveryOption(selectedOption)

    // 若選擇宅配，設定運費為 250，否則為 0
    setDeliveryFee(selectedOption === '宅配' ? 250 : 0)

    // 如果選擇了「宅配」，自動將付款方式設為「信用卡」
    if (selectedOption === '宅配') {
      setPaymentOption('信用卡')
    }
  }

  // 付款方式變更處理函式
  const handlePaymentOptionChange = (e) => {
    // 僅當配送方式為「到店取貨」時允許選擇「到店付款」
    if (deliveryOption !== '宅配' || e.target.value === '信用卡') {
      setPaymentOption(e.target.value)
    }
  }

  // 當勾選「同會員資料」時，自動填入會員資料，取消勾選時清空相關欄位
  const handleSameAsMemberInfo = (e) => {
    if (e.target.checked) fetchUserData()
    else {
      setFormFields({
        ...formFields,
        name: '',
        phone: '',
        address: '',
      })
    }
  }

  // 更新選擇的區域並篩選對應的門市
  const handleAreaChange = (e) => setSelectedArea(e.target.value)

  // 根據選擇的區域過濾門市
  const filteredShops = shops.filter((shop) => shop.shop_area === selectedArea)

  // 更新選擇的門市
  const handleShopChange = (e) => setSelectedShop(e.target.value)

  // 預計取貨日最小值設定
  const today = new Date().toISOString().split('T')[0]
  // 更新選擇的預計取貨日
  const handlePickupDateChange = (e) => setPickupDate(e.target.value)

  // 處理信用卡號碼輸入框，限制輸入為數字並自動切換至下一個輸入框
  const handleCardInputChange = (e, index) => {
    let str = e.target.value.replace(/\D/g, '') // 只保留數字
    e.target.value = str
    if (str.length === 4 && index < 3) {
      inputRefs[index + 1].current.focus() // 自動跳到下一個輸入框
    }

    // 將所有信用卡輸入框的值組合為完整卡號並設定
    const fullCardNumber = inputRefs.map((ref) => ref.current.value).join('')
    setFormFields((prevFields) => ({
      ...prevFields,
      cardNumber: fullCardNumber,
      cardType: detectCardType(fullCardNumber), // 自動檢測信用卡種類
    }))
  }

  // 處理退格按鍵，若輸入框為空則跳到前一個輸入框
  const handleKeyDown = (e, index) => {
    if (e.keyCode === 8 && index > 0 && e.target.value === '') {
      inputRefs[index - 1].current.focus()
    }
  }

  // 判斷信用卡別的函式，依據卡號前兩碼識別卡別
  const detectCardType = (number) => {
    const firstDigit = number.substring(0, 1)
    const firstTwoDigits = number.substring(0, 2)
    if (/^4/.test(firstDigit)) return 'VISA'
    if (/^5[1-5]/.test(firstTwoDigits)) return 'MasterCard'
    if (/^35/.test(firstTwoDigits)) return 'JCB'
    return ''
  }

  // 處理一般輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormFields({ ...formFields, [name]: value })

    if (name === 'expiryDate') {
      // 驗證有效日期格式長度為 5 (MM/YY)
      if (value.length !== 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          expiryDate: '請輸入有效的日期格式 (MM/YY)',
        }))
      } else {
        // 檢查日期是否小於當月
        const [inputMonth, inputYear] = value.split('/').map(Number)
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1 // JavaScript 的月份從 0 開始
        const currentYear = currentDate.getFullYear() % 100 // 取得後兩位年份

        if (
          inputYear < currentYear ||
          (inputYear === currentYear && inputMonth < currentMonth)
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            expiryDate: '有效日期不能小於當月',
          }))
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            expiryDate: '', // 清除錯誤
          }))
        }
      }
    }
  }

  // ----- 表單驗證 -----
  // 驗證表單欄位格式
  const validateFields = () => {
    const newErrors = {}

    // 驗證姓名
    if (!formFields.name.trim()) newErrors.name = '請輸入姓名'

    // 驗證電話格式
    if (!/^\d{10}$/.test(formFields.phone))
      newErrors.phone = '請輸入10位數字的電話號碼'

    // 當配送選項為「宅配」時，檢查地址是否填寫
    if (deliveryOption === '宅配' && !formFields.address.trim()) {
      newErrors.address = '請輸入配送地址'
    }

    // 當配送選項為「到店取貨」時，分別檢查區域和門市是否選擇
    if (deliveryOption === '到店取貨') {
      if (!selectedArea) {
        newErrors.selectedArea = '請選擇區域'
      }
      if (!selectedShop) {
        newErrors.selectedShop = '請選擇取貨門市'
      }
      if (!pickupDate) {
        newErrors.pickupDate = '請選擇取貨日期'
      }
    }

    // 當付款選項為信用卡時進行額外驗證
    if (paymentOption === '信用卡') {
      if (formFields.cardNumber.length < 16)
        newErrors.cardNumber = '請輸入16位數字的信用卡號碼'
      if (!/^\d{2}\/\d{2}$/.test(formFields.expiryDate))
        newErrors.expiryDate = '請輸入有效日期 (格式 MM/YY)'
      if (!/^\d{3}$/.test(formFields.securityCode))
        newErrors.securityCode = '請輸入3位數字的安全碼'
      if (!formFields.cardHolder.trim())
        newErrors.cardHolder = '請輸入持卡人姓名'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ----- 表單提交 -----
  const handleSubmit = () => {
    if (validateFields()) {
      // 跳出提醒確認是否要送出訂單
      Swal.fire({
        title: '確認提交訂單',
        text: '您確定要送出此訂單嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
          cancelButton: 'swal2-custom-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // 執行送出訂單操作
          addToOrders()
          Swal.fire({
            title: '成功',
            text: '訂單已送出！',
            icon: 'success',
            customClass: {
              title: 'swal2-custom-title',
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button',
            },
          })
        }
      })
    } else {
      Swal.fire({
        title: '錯誤',
        text: '請檢查輸入欄位',
        icon: 'error',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  // ----- 組件渲染 -----
  return (
    <>
      <div className={`${styles.minHeight} container my-5 fontDarkBrown`}>
        <div className="row align-items-start">
          {/* 標題區塊 */}
          <div className="col-12 col-md-auto mb-3 mb-md-0">
            <h4 className="h4Bold">購物車</h4>
          </div>

          {/* 步驟區塊 */}
          <div className="col">
            <div className="row">
              <div className="col-12 col-md-auto">
                <p className={`${styles.disabled} web-16px-B`}>
                  <span className={`${styles.step}`}>01</span> 購物清單
                </p>
              </div>
              <div className="col-12 col-md-auto">
                <p className="web-16px-B">
                  <span className={`${styles.step} ${styles.focus}`}>02</span>
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

        <div>
          <button
            className="btn btn-primary my-2"
            onClick={handleReturnToShoppingList}
          >
            返回購物清單
          </button>
        </div>

        <div className="row gap-5 fontDarkBrown">
          {/* 配送資訊 */}
          <div className="col-12 col-lg-7">
            <div className={`${styles.bg}`}>
              <h4>配送資訊</h4>
              <hr />
              <div className="mb-2">
                <label className={`${styles.radioLabel}`}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="宅配"
                    checked={deliveryOption === '宅配'}
                    onChange={handleDeliveryOptionChange}
                  />
                  宅配（運費250元）
                </label>
                <label className={`${styles.radioLabel}`}>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="到店取貨"
                    checked={deliveryOption === '到店取貨'}
                    onChange={handleDeliveryOptionChange}
                  />
                  到店取貨
                </label>
              </div>
              <div className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    name="sameAsMemberInfo"
                    onChange={handleSameAsMemberInfo}
                  />
                  同會員資料
                </label>
              </div>
              <div className="mb-2">
                <label htmlFor='name'>姓名</label>
                <input
                  type="text"
                  className="form-control"
                  id='name'
                  name="name"
                  value={formFields.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>
              <div className="mb-2">
                <label htmlFor='phone'>電話</label>
                <input
                  type="text"
                  className="form-control"
                  id='phone'
                  name="phone"
                  value={formFields.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>
              {deliveryOption === '宅配' ? (
                <div className="row">
                  <div className="col-12">
                    <label htmlFor='address'>地址</label>
                    <input
                      type="text"
                      className="form-control"
                      id='address'
                      name="address"
                      value={formFields.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <small className="text-danger">{errors.address}</small>
                    )}
                  </div>
                </div>
              ) : (
                <div className="row">
                  {/* 區域選擇 */}
                  <div className="col-12 col-md-3">
                    <label htmlFor="areaSelect">區域</label>
                    <select
                      id='areaSelect'
                      className="form-control"
                      onChange={handleAreaChange}
                    >
                      <option value="">請選擇</option>
                      <option value="北部">北部</option>
                      <option value="中部">中部</option>
                      <option value="南部">南部</option>
                    </select>
                    {errors.selectedArea && (
                      <small className="text-danger">
                        {errors.selectedArea}
                      </small>
                    )}
                  </div>

                  {/* 門市選擇 */}
                  <div className="col-12 col-md-5 mt-3 mt-md-0">
                    <label htmlFor='shop'>門市</label>
                    <select
                      id='shop'
                      className="form-control"
                      value={selectedShop}
                      onChange={handleShopChange}
                      disabled={!selectedArea} // 當未選擇區域時禁用
                    >
                      <option value="">
                        {selectedArea ? '請選擇門市' : '請先選擇區域'}
                      </option>
                      {filteredShops.map((shop) => (
                        <option key={shop.id} value={shop.id}>
                          {`${shop.shop_name} - 地址：${shop.shop_address}`}
                        </option>
                      ))}
                    </select>
                    {errors.selectedShop && (
                      <small className="text-danger">
                        {errors.selectedShop}
                      </small>
                    )}
                  </div>

                  {/* 預計取貨日 */}
                  <div className="col-12 col-md-4 mt-3 mt-md-0">
                    <label htmlFor='pickupDate'>預計取貨日</label>
                    <input
                      id='pickupDate'
                      type="date"
                      className="form-control"
                      value={pickupDate}
                      onChange={handlePickupDateChange}
                      min={today} // 設置最小日期
                    />
                    {errors.pickupDate && (
                      <small className="text-danger">{errors.pickupDate}</small>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 付款方式區域 */}
            {/* 付款方式 */}
            <div className={`${styles.bg} mt-5`}>
              <h4>付款方式</h4>
              <hr />
              <div className="mb-2">
                <label className={`${styles.radioLabel}`}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="信用卡"
                    checked={paymentOption === '信用卡'}
                    onChange={handlePaymentOptionChange}
                  />
                  信用卡
                </label>
                <label className={`${styles.radioLabel}`}>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="到店付款"
                    checked={paymentOption === '到店付款'}
                    onChange={handlePaymentOptionChange}
                    disabled={deliveryOption === '宅配'}
                  />
                  到店付款
                </label>
              </div>

              {paymentOption === '信用卡' && (
                <>
                  {/* 信用卡號碼輸入區域 */}
                  <div className="row mb-2">
                    <div className="col-12 col-md-10">
                      <label htmlFor='creditCard'>信用卡號碼</label>
                      <div className="d-flex flex-wrap">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            id='creditCard'
                            key={index}
                            type="text"
                            className="card form-control me-2 mb-2 mb-md-0"
                            maxLength="4"
                            ref={inputRefs[index]}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onKeyUp={(e) => handleCardInputChange(e, index)}
                            style={{ flex: '1 1 22%', maxWidth: '22%' }} // 確保每個輸入框占據適當空間
                          />
                        ))}
                      </div>
                    </div>
                    <div className="col-12 col-md-2 d-flex align-items-center">
                      {formFields.cardType && (
                        <img
                          src={
                            formFields.cardType === 'VISA'
                              ? '/creditCardType/Visa.png'
                              : formFields.cardType === 'MasterCard'
                              ? '/creditCardType/Mastercard.png'
                              : formFields.cardType === 'JCB'
                              ? '/creditCardType/JCB.png'
                              : ''
                          }
                          alt={`${formFields.cardType} logo`}
                          className="img-fluid"
                          style={{ maxHeight: '30px' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 有效日期與安全驗證碼 */}
                  <div className="row mb-2">
                    <div className="col-12 col-md-6">
                      <label htmlFor='expiryDate'>有效日期(MM/YY)</label>
                      <input
                        id='expiryDate'
                        type="text"
                        className="form-control"
                        maxLength="5"
                        name="expiryDate"
                        value={formFields.expiryDate}
                        onChange={handleInputChange}
                      />
                      {errors.expiryDate && (
                        <small className="text-danger">
                          {errors.expiryDate}
                        </small>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor='securityCode'>安全驗證碼</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="3"
                        id='securityCode'
                        name="securityCode"
                        value={formFields.securityCode}
                        onChange={handleInputChange}
                      />
                      {errors.securityCode && (
                        <small className="text-danger">
                          {errors.securityCode}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* 持卡人姓名 */}
                  <div className="row">
                    <div className="col-12">
                      <label htmlFor='cardHolder'>持卡人姓名</label>
                      <input
                        type="text"
                        className="form-control"
                        id='cardHolder'
                        name="cardHolder"
                        value={formFields.cardHolder}
                        onChange={handleInputChange}
                      />
                      {errors.cardHolder && (
                        <small className="text-danger">
                          {errors.cardHolder}
                        </small>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 訂單明細 */}
          <div className="col-12 col-lg-3">
            <div className={`${styles.bg}`}>
              <div className="h6">訂單明細</div>
              <hr />
              <div className="d-flex justify-content-between">
                <div>共計 {totalQuantity} 件商品</div>
                <div>NT${totalPrice.toLocaleString()}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>運費</div>
                <div>NT${deliveryFee.toLocaleString()}</div>
              </div>
              <div className="d-flex justify-content-between">
                <div>優惠券折扣</div>
                <div>
                  - NT${(totalPrice - discountedPrice).toLocaleString()}
                </div>
              </div>
              <hr />
              <div className="text-end h3Bold">
                總計：NT${(discountedPrice + deliveryFee).toLocaleString()}
              </div>
              <button className={`${styles.SendBtn} p-2`} onClick={handleSubmit}>
                確認送出訂單
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Details
