import React, { useState, useEffect } from 'react'
import MemberCenterLayout from '@/components/MemberCenter/MemberCenterLayout'
import tabStyle from './tab.module.scss'
import moment from 'moment'
import Swal from 'sweetalert2'
import Router from 'next/router'
import { Modal, Button, Form } from 'react-bootstrap'
import { FaStar } from 'react-icons/fa'

const swalOptions = {
  customClass: {
    title: 'swal2-custom-title',
    htmlContainer: 'swal2-custom-text',
    confirmButton: 'swal2-custom-confirm-button',
    cancelButton: 'swal2-custom-cancel-button',
  },
}

const showSwal = (type, title, text) => {
  Swal.fire({
    ...swalOptions,
    icon: type,
    title,
    text,
    confirmButtonText: '確定',
  })
}

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD')
}

// 商品詳細資訊組件
function ProductDetails({
  image,
  name,
  code,
  size,
  price,
  quantity,
  product_id,
  isHistory,
}) {
  // 前往商品詳情
  const gotoproduct = () => {
    Router.push(`/product/${product_id}`)
  }

  // 評價 Modal 控制
  const [showComment, setShowComment] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(0)
  const [hasCommented, setHasCommented] = useState(false)

  useEffect(() => {
    const checkIfCommented = async () => {
      try {
        const encodedSize = encodeURIComponent(size) // 編碼 size
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/check/${product_id}/${encodedSize}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        const result = await response.json()
        if (result.status === 'success' && result.data.hasCommented) {
          setHasCommented(true)
          setRating(result.data.rating)
          setCommentText(result.data.comment)
        }
      } catch (error) {
        console.error('無法檢查評價狀態:', error)
      }
    }

    if (isHistory) checkIfCommented()
  }, [product_id, size, isHistory])

  const openCommentModal = () => setShowComment(true)
  const closeCommentModal = () => setShowComment(false)

  const handleSubmitComment = async () => {
    try {
      if (!rating) {
        showSwal('error', '錯誤', '請選擇評分')

        return
      }

      // 發送評價至後端
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            product_id,
            size: size || null, // 處理無尺寸情況
            rating,
            comment: commentText,
          }),
        }
      )

      const result = await response.json()
      if (result.status === 'success') {
        showSwal('success', '成功', result.message)
        setHasCommented(true)
        setRating(rating)
        setCommentText(commentText)
        closeCommentModal()

        // 更新評價狀態
        setHasCommented(true)
        setRating(rating)
        setCommentText(commentText)

        // 關閉 Modal 並更新頁面顯示
        closeCommentModal()
      } else {
        showSwal('error', '錯誤', result.message)
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('提交評價錯誤:', error)
      showSwal('error', '錯誤', '提交評價時發生錯誤，請稍後再試')
    }
  }

  return (
    <div className="border-bottom py-3">
      <div className="row align-items-center">
        {/* 商品圖片 */}
        <div className="col-6 col-sm-3 col-md-2 d-flex justify-content-center">
          <img
            src={image}
            alt={name}
            className="img-fluid bg-white"
            style={{ maxWidth: '80px' }}
          />
        </div>

        {/* 商品名稱與品牌 */}
        <div className="col-6 col-sm-4 col-md-3">
          <p className="fw-bold mb-1">{name}</p>
          <p className="text-muted mb-1">{code}</p>
          <p className="text-muted mb-1">尺寸：{size}</p>
        </div>

        {/* 數量 */}
        <div className="col-12 col-sm-2 col-md-2 text-end">
          <p className="mb-0">{`數量：${quantity}`}</p>
        </div>

        {/* 單價與總價 */}
        <div className="col-sm-3 col-md-3 text-end">
          <p className="mb-1">{`單價：NT$${price.toLocaleString()}`}</p>
          <p className="mb-0">{`小計：NT$${(
            price * quantity
          ).toLocaleString()}`}</p>
        </div>

        {/* 功能區 */}
        <div className="col-12 col-sm-12 col-md-1 gap-3 mt-3 mt-md-0">
          {/* 商品資訊 */}
          <button
            className="btn btn-primary btn-sm text-nowrap m-1"
            onClick={gotoproduct}
          >
            商品資訊
          </button>

          {/* 評價功能 */}
          {isHistory && (
            <button
              className={`btn btn-${
                hasCommented ? 'secondary' : 'warning'
              } btn-sm text-nowrap m-1`}
              onClick={openCommentModal}
            >
              {hasCommented ? '已評價' : '前往評價'}
            </button>
          )}
        </div>
      </div>

      {/* 評價 Modal */}
      <Modal show={showComment} onHide={closeCommentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {hasCommented ? '查看/更新評價' : '新增評價'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="rating">
              <Form.Label>評分</Form.Label>
              <div className="star-rating d-flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <FaStar
                    key={value}
                    size={24}
                    color={value <= rating ? '#ffc107' : '#e4e5e9'}
                    onClick={() => setRating(value)}
                    style={{ cursor: 'pointer', marginRight: '4px' }}
                  />
                ))}
                <p
                  className="rating-count"
                  style={{ marginLeft: '8px', fontSize: '16px' }}
                >
                  {rating} 分
                </p>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="commentText">
              <Form.Label>評價內容</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCommentModal}>
            關閉
          </Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            {hasCommented ? '更新評價' : '提交評價'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

// 進行中訂單
function TabContent1() {
  const [ongoingData, setOngoingData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const fetchOngoingOrders = async (start = '', end = '') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/ongoing`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        const filteredData = result.data.filter((order) => {
          const orderDate = moment(order.order_date)
          return (
            (!start || orderDate.isSameOrAfter(start)) &&
            (!end || orderDate.isSameOrBefore(end))
          )
        })
        setOngoingData(filteredData)
      }
    } catch (error) {
      console.error('無法取得資料:', error)
    }
  }

  useEffect(() => {
    fetchOngoingOrders()
  }, [])

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/items`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        return result.data
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('無法取得商品列表:', error)
      return []
    }
  }

  const handleSearch = () => {
    if (!startDate || !endDate) {
      showSwal('error', '錯誤', '請輸入查詢範圍')
      return
    }
    if (endDate && startDate && endDate < startDate) {
      showSwal('error', '錯誤', '結束日期不能小於開始日期')
      return
    }
    fetchOngoingOrders(formatDate(startDate), formatDate(endDate))
  }

  return (
    <div className={`${tabStyle.tabContent}`}>
      <fieldset className="row align-items-center m-1 gap-1">
        <div className="col-md-2">
          <legend className="col-form-label fontDarkBrown web-16px-B">
            訂購日期
          </legend>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            id="start-date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-1 text-center">~</div>
        <div className="col-md-3">
          <input
            type="date"
            id="end-date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={handleSearch}>
            查詢
          </button>
        </div>
      </fieldset>
      <hr />
      <div className={`${tabStyle.scroll}`}>
        {(!ongoingData || ongoingData.length === 0) && (
          <div className="fontDarkBrown web-16px-md ms-3">無進行中訂單</div>
        )}
        {ongoingData &&
          ongoingData.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              fetchOrderItems={fetchOrderItems}
            />
          ))}
      </div>
    </div>
  )
}

// 歷史訂單
function TabContent2() {
  const [historyData, setHistoryData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const fetchHistoryOrders = async (start = '', end = '') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/history`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        const filteredData = result.data.filter((order) => {
          const orderDate = moment(order.order_date)
          return (
            (!start || orderDate.isSameOrAfter(start)) &&
            (!end || orderDate.isSameOrBefore(end))
          )
        })
        setHistoryData(filteredData)
      }
    } catch (error) {
      console.error('無法取得資料:', error)
    }
  }

  useEffect(() => {
    fetchHistoryOrders()
  }, [])

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/items`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        return result.data
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('無法取得商品列表:', error)
      return []
    }
  }

  const handleSearch = () => {
    if (!startDate || !endDate) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '請輸入查詢範圍',
      })
      return
    }
    if (endDate && startDate && endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '結束日期不能小於開始日期',
      })
      return
    }
    fetchHistoryOrders(formatDate(startDate), formatDate(endDate))
  }
  return (
    <div className={`${tabStyle.tabContent}`}>
      <fieldset className="row align-items-center m-1 gap-1">
        <div className="col-md-2">
          <legend className="col-form-label fontDarkBrown web-16px-B">
            訂購日期
          </legend>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            id="start-date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-1 text-center">~</div>
        <div className="col-md-3">
          <input
            type="date"
            id="end-date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={handleSearch}>
            查詢
          </button>
        </div>
      </fieldset>
      <hr />
      <div className={`${tabStyle.scroll}`}>
        {(!historyData || historyData.length === 0) && (
          <div className="fontDarkBrown web-16px-md ms-3">無歷史訂單</div>
        )}
        {historyData.map((order) => (
          <OrderCard
            key={order.order_id}
            order={order}
            fetchOrderItems={fetchOrderItems}
            isHistory={true}
          />
        ))}
      </div>
    </div>
  )
}

// 訂單卡片元件
function OrderCard({ order, fetchOrderItems, isHistory }) {
  const [orderItems, setOrderItems] = useState([])

  // 抓取訂單資料
  useEffect(() => {
    const loadOrderItems = async () => {
      const items = await fetchOrderItems(order.order_id)
      setOrderItems(items)
    }
    loadOrderItems()
  }, [order.order_id, fetchOrderItems])

  return (
    <div className="border rounded p-3 mb-3">
      {/* 訂單資訊 */}
      <div className="order border-bottom pb-3 mb-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <div className="d-flex flex-column flex-md-row">
              <p className="fw-bold mb-1 mb-md-0">
                {moment(order.order_date).format('YYYY-MM-DD')}
              </p>
              <p className="ms-md-3 mb-0 text-muted">{order.order_code}</p>
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-3 mt-2 mt-md-0">
            {/* 付款狀態 */}
            {order.payment_status === 1 ? (
              <span className="badge bg-success">已付款</span>
            ) : (
              <span className="badge bg-danger">尚未付款</span>
            )}
            {/* 配送/取貨狀態 */}
            {order.delivery_status === 1 ? (
              <span className="badge bg-success">已取貨</span>
            ) : (
              <span className="badge bg-danger">出貨中</span>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-md-6">
            <p className="fw-bold mb-1">
              {order.delivery_method}
              {order.delivery_method !== '宅配' && (
                <span>（預定取貨時間：{order.come_date}）</span>
              )}
            </p>
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <p className="fw-bold">訂單金額：${order.total_amount}</p>
          </div>
        </div>
      </div>

      {/* 配送與付款資訊 */}
      <div className="fw-bold mb-3">訂單詳情</div>
      <div className="row align-items-start">
        <div className="col-12 col-md-2 fw-bold">配送地點</div>
        <div className="col-12 col-md-4">
          <p className="mb-1">
            {order.shop_name === null ? (
              <>
                {order.shipping_person} {order.shipping_phone}
              </>
            ) : (
              <a
                href={`/shop#tab${
                  order.shop_area === '北部'
                    ? 1
                    : order.shop_area === '中部'
                    ? 2
                    : order.shop_area === '南部'
                    ? 3
                    : ''
                }&${order.shop_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                {order.shop_name}
              </a>
            )}
          </p>
          <p className="mb-1">
            {order.shop_address === null
              ? order.delivery_address
              : order.shop_address}
          </p>
        </div>
        <div className="col-12 col-md-2 fw-bold mt-3 mt-md-0">付款方式</div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          {order.payment_method}
        </div>
      </div>

      {/* 商品詳細資訊 */}
      <div className="mt-4">
        {orderItems.map((item) => (
          <ProductDetails
            key={item.product_id}
            image={`/product-pics/${item.product_brand_name}/${item.picture_url}`}
            name={item.product_name}
            code={item.product_brand_name}
            size={item.size}
            price={item.discount_price || item.price}
            quantity={item.quantity}
            product_id={item.product_id}
            isHistory={isHistory} // 傳遞 isHistory 屬性
          />
        ))}
      </div>
    </div>
  )
}

export default function Orders() {
  const [activeTab, setActiveTab] = useState('tab1')

  const renderContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <TabContent1 />
      case 'tab2':
        return <TabContent2 />
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
            className={activeTab === 'tab1' ? tabStyle.active : ''}
          >
            進行中
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={activeTab === 'tab2' ? tabStyle.active : ''}
          >
            歷史訂單
          </button>
        </div>
        <div className={`${tabStyle.tabContent}`}>{renderContent()}</div>
      </div>
    </MemberCenterLayout>
  )
}
