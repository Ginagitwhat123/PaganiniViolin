import React, { useState, useEffect } from 'react'
import MemberCenterLayout from '@/components/MemberCenter/MemberCenterLayout'
import tabStyle from './tab.module.scss'
import Router from 'next/router'
import { FaStar } from 'react-icons/fa'
import { Modal, Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'

// 客製化樣式設定
const swalOptions = {
  customClass: {
    title: 'swal2-custom-title',
    htmlContainer: 'swal2-custom-text',
    confirmButton: 'swal2-custom-confirm-button',
    cancelButton: 'swal2-custom-cancel-button',
  },
}

// 常量：API 路徑
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/comments`

// ReviewCard Component
function ReviewCard({ review, openModal, isCompleted }) {
  return (
    <div className="border-bottom py-3">
      <div className="row align-items-center">
        {/* 商品圖片 */}
        <div className="col-12 col-sm-3 col-md-2 d-flex justify-content-center mb-3 mb-sm-0">
          <img
            src={`/product-pics/${review.product_brand_name}/${review.picture_url}`}
            alt={review.product_name}
            className="img-fluid bg-white"
            style={{ maxWidth: '80px' }}
          />
        </div>

        {/* 商品名稱與品牌 */}
        <div className="col-12 col-sm-3 col-md-2 text-center text-sm-start mb-3 mb-sm-0">
          <p className="fw-bold mb-1">{review.product_name}</p>
          <p className="text-muted mb-1">{review.product_brand_name}</p>
          {review.size == '' ? (
            ''
          ) : (
            <p className="text-muted mb-1">尺寸：{review.size}</p>
          )}
        </div>

        {/* 評價星數或價格 */}
        <div className="col-12 col-sm-3 col-md-2 text-center text-sm-end mb-3 mb-sm-0">
          {isCompleted ? (
            <p className="mb-0 d-flex justify-content-center justify-content-sm-end align-items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={20}
                  color={index < review.rating ? '#ffc107' : '#e4e5e9'}
                  style={{ marginRight: '4px' }}
                />
              ))}
            </p>
          ) : (
            <>
              {review.discount_price ? (
                <>
                  <p className="mb-1">
                    折扣價：NT${review.discount_price.toLocaleString()}
                  </p>
                  <p className="text-muted mb-0">
                    <del>原價：NT${review.price.toLocaleString()}</del>
                  </p>
                </>
              ) : (
                <p className="mb-0">單價：NT${review.price.toLocaleString()}</p>
              )}
            </>
          )}
        </div>

        {/* 數量或評價內容 */}
        <div className="col-12 col-sm-6 col-md-3 text-center ms-3">
          {isCompleted ? (
            <p
              className="mb-0 text-break text-md-start"
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                maxWidth: '90%',
              }}
            >
              {review.comment}
            </p>
          ) : (
            <p className="mb-0">購買數量：{review.quantity}</p>
          )}
        </div>

        {/* 功能區 */}
        <div className="col-12 col-sm-3 col-md-2 d-flex flex-column align-items-center gap-2 mt-3 mt-md-0">
          <button
            className="btn btn-primary btn-sm text-nowrap"
            onClick={() => Router.push(`/product/${review.product_id}`)}
          >
            商品資訊
          </button>
          {!isCompleted && (
            <button
              className="btn btn-warning btn-sm text-nowrap"
              onClick={() => openModal(review)}
            >
              前往評價
            </button>
          )}
          {isCompleted && (
            <button
              className="btn btn-secondary btn-sm text-nowrap"
              onClick={() => openModal(review)}
            >
              更新評價
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// PendingReviews Component
function PendingReviews({ openModal, refresh }) {
  const [pendingReviews, setPendingReviews] = useState([])

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const result = await response.json()
      if (result.status === 'success') {
        setPendingReviews(result.data)
      }
    } catch (error) {
      console.error('無法取得待評價資料:', error)
      Swal.fire({
        ...swalOptions,
        title: '錯誤',
        text: '無法取得待評價資料，請稍後再試。',
        icon: 'error',
        confirmButtonText: '確定',
      })
    }
  }

  useEffect(() => {
    fetchPendingReviews()
  }, [refresh])

  return (
    <div className={`${tabStyle.tabContent} ${tabStyle.scroll}`}>
      {pendingReviews.length > 0 ? (
        pendingReviews.map((review) => (
          <ReviewCard
            key={`${review.product_id}-${review.size}`}
            review={review}
            openModal={openModal}
          />
        ))
      ) : (
        <p className="text-center py-3">目前沒有待評價的訂單。</p>
      )}
    </div>
  )
}

// 已評價清單
function CompletedReviews({ refresh, openModal }) {
  const [completedReviews, setCompletedReviews] = useState([])

  const fetchCompletedReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const result = await response.json()
      if (result.status === 'success') {
        setCompletedReviews(result.data)
      }
    } catch (error) {
      console.error('無法取得已評價資料:', error)
      Swal.fire({
        ...swalOptions,
        title: '錯誤',
        text: '無法取得已評價資料，請稍後再試。',
        icon: 'error',
        confirmButtonText: '確定',
      })
    }
  }

  useEffect(() => {
    fetchCompletedReviews()
  }, [refresh])

  return (
    <div className={`${tabStyle.tabContent} ${tabStyle.scroll}`}>
      {completedReviews.length > 0 ? (
        completedReviews.map((review) => (
          <ReviewCard
            key={`${review.product_id}-${review.size}`}
            review={review}
            openModal={openModal}
            isCompleted
          />
        ))
      ) : (
        <p className="text-center py-3">目前沒有已評價的訂單。</p>
      )}
    </div>
  )
}

// Main Tabs Component
function Tabs() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [showModal, setShowModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [refresh, setRefresh] = useState(0)

  const openModal = (review) => {
    setSelectedReview(review)
    setRating(review.rating || 0)
    setComment(review.comment || '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedReview(null)
    setRating(0)
    setComment('')
  }

  const handleSubmitComment = async () => {
    try {
      if (!rating) {
        Swal.fire({
          ...swalOptions,
          title: '提示',
          text: '請選擇評分！',
          icon: 'warning',
          confirmButtonText: '確定',
        })
        return
      }
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          product_id: selectedReview.product_id,
          size: selectedReview.size,
          rating,
          comment,
        }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire({
          ...swalOptions,
          title: '成功',
          text: '提交評價成功！',
          icon: 'success',
          confirmButtonText: '確定',
        }).then(() => {
          closeModal()
          setRefresh((prev) => prev + 1) // 刷新列表
        })
      } else {
        Swal.fire({
          ...swalOptions,
          title: '錯誤',
          text: `提交失敗：${result.message}`,
          icon: 'error',
          confirmButtonText: '確定',
        })
      }
    } catch (error) {
      console.error('提交評價錯誤:', error)
      Swal.fire({
        ...swalOptions,
        title: '錯誤',
        text: '提交評價時發生錯誤！',
        icon: 'error',
        confirmButtonText: '確定',
      })
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
            待評價
          </button>
          <button
            onClick={() => setActiveTab('tab2')}
            className={activeTab === 'tab2' ? tabStyle.active : ''}
          >
            已評價
          </button>
        </div>
        <div className={`${tabStyle.tabContent}`}>
          {activeTab === 'tab1' ? (
            <PendingReviews openModal={openModal} refresh={refresh} />
          ) : (
            <CompletedReviews openModal={openModal} refresh={refresh} />
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>新增評價</Modal.Title>
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
                <span style={{ marginLeft: '8px' }}>{rating} 分</span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="commentText">
              <Form.Label>評價內容</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            關閉
          </Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            提交評價
          </Button>
        </Modal.Footer>
      </Modal>
    </MemberCenterLayout>
  )
}

export default Tabs
