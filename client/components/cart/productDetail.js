// client/components/cart/productDetail.js
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2' // 導入 SweetAlert2
import styles from 'pages/cart/cart.module.scss'
import { useRouter } from 'next/router'

function ProductDetails({
  card_id,
  product_id,
  productPics,
  product_name,
  brand_name,
  price,
  discount_price,
  quantity,
  size,
  card_checked, // 全選時傳入父元件更新值
  updateItemQuantity,
  updateCheckedStatus, // 單選時回傳更新值至父元件
  fetchData,
}) {
  // 儲存勾選狀態
  const [isChecked, setIsChecked] = useState(card_checked) // 預設為父元件抓取資料庫的值

  // 更新勾選狀態
  const handleCheckChange = (e) => {
    const newChecked = e.target.checked ? 1 : 0
    setIsChecked(newChecked)
    updateCheckedStatus(product_id, size, newChecked) // 同步至父組件的勾選狀態更新函數
  }
  // 儲存商品數量
  const [itemQuantity, setItemQuantity] = useState(quantity)

  // 更新商品數量
  const updateQuantity = async (newQuantity) => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/cart/updateQuantity',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id, quantity: newQuantity, size }),
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        setItemQuantity(newQuantity)
        fetchData() // !更新勾選狀態成功後，重新載入購物車內容
      } else {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: result.message,
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      }
    } catch (error) {
      console.error('無法更新數量:', error)
      alert('無法更新數量')
    }
  }

  const [favorites, setFavorites] = useState([])
  //取得收藏清單資訊(要移至收藏列表)
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/product-favorites`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (data.status === 'success') {
          setFavorites(data.data.favorites.map((fav) => fav.product_id))
        }
      } catch (error) {
        console.error('無法取得收藏清單:', error)
      }
    }
    fetchFavorites()
  }, [])

  const addToFavorites = async (product_id) => {
    if (favorites.includes(product_id)) {
      // 商品已在收藏清單中
      Swal.fire({
        icon: 'warning',
        title: '商品已在收藏列表中，確認從購物車中移除嗎？',
        text: '此操作會將商品從購物車中移除',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        cancelButtonColor: '#803D3B',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      }).then((result) => {
        if (result.isConfirmed) {
          removeItem() // 從購物車中移除
          Swal.fire({
            icon: 'success',
            title: '已從購物車中移除',
            confirmButtonText: '確認',
            customClass: {
              title: 'swal2-custom-title', // 自定義標題樣式
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
            },
          })
        }
      })
    } else {
      // 商品不在收藏清單中
      Swal.fire({
        icon: 'warning',
        title: '確定要加入收藏並從購物車中移除嗎？',
        text: '此操作會將商品加入收藏清單，並從購物車中移除',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        cancelButtonColor: '#803D3B',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(
              `http://localhost:3005/api/product-favorites/${product_id}`,
              {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
              }
            )
            const resData = await response.json()
            if (resData.status === 'success') {
              setFavorites([...favorites, product_id]) // 更新收藏清單
              removeItem() // 從購物車中移除
              Swal.fire({
                icon: 'success',
                title: '已加入收藏清單並從購物車中移除',
                confirmButtonText: '確認',
                customClass: {
                  title: 'swal2-custom-title', // 自定義標題樣式
                  htmlContainer: 'swal2-custom-text',
                  confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
                },
              })
            } else {
              console.error(resData.message)
            }
          } catch (error) {
            console.error('加入收藏清單失敗:', error)
          }
        }
      })
    }
  }

  // 設定遞增後商品數量
  const handleIncrease = () => {
    const newQuantity = itemQuantity + 1
    updateQuantity(newQuantity)
    updateItemQuantity(product_id, newQuantity) // 更新數量
  }

  // 設定遞減後商品數量
  const handleDecrease = () => {
    const newQuantity = itemQuantity - 1
    if (newQuantity === 0) {
      Swal.fire({
        title: '數量為 0',
        text: '確定要從購物車中刪除此商品嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#803D3B',
        cancelButtonText: '取消',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      }).then((result) => {
        if (result.isConfirmed) {
          removeItem()
          Swal.fire({
            title: '已刪除！',
            text: '商品已成功從購物車中移除。',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            customClass: {
              title: 'swal2-custom-title', // 自定義標題樣式
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
            },
          })
        }
      })
    } else {
      updateQuantity(newQuantity)
      updateItemQuantity(product_id, newQuantity) // 更新數量
    }
  }

  // 設定更改input欄位後商品數量
  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 0
    if (newQuantity === 0) {
      Swal.fire({
        title: '數量為 0',
        text: '確定要從購物車中刪除此商品嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      }).then((result) => {
        if (result.isConfirmed) {
          removeItem()
          Swal.fire({
            title: '已刪除！',
            text: '商品已成功從購物車中移除。',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            customClass: {
              title: 'swal2-custom-title', // 自定義標題樣式
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
            },
          })
        }
      })
    } else {
      updateQuantity(newQuantity)
      updateItemQuantity(product_id, newQuantity) // 更新數量
    }
  }

  // 刪除商品
  const removeItem = async () => {
    try {
      const response = await fetch(
        `
        http://localhost:3005/api/cart/remove`,
        {
          credentials: 'include',
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id, size }),
        }
      )
      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '刪除成功',
          text: result.message,
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
        // 刪除成功後更新購物車狀態
        fetchData()
      } else {
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: result.message,
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      }
    } catch (error) {
      console.error('無法刪除商品:', error)
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法刪除商品，請稍後再試。',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
    }
  }

  // 刪除商品
  const handleRemove = () => {
    Swal.fire({
      title: '您確定要刪除此商品嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#803D3B',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      customClass: {
        title: 'swal2-custom-title', // 自定義標題樣式
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem()
        Swal.fire({
          title: '已刪除！',
          text: '商品已成功從購物車中移除。',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
      }
    })
  }

  const router = useRouter()
  // 點擊後導向商品詳細頁
  const handleCardClick = (id) => {
    router.push(`/product/${id}`)
  }

  return (
    <>
      <div className="row border-bottom py-3 align-items-center">
        {/* 勾選 */}
        <div className="col-2 col-sm-1 d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            checked={card_checked}
            onChange={handleCheckChange}
          />
        </div>

        {/* 圖片和商品數量 */}
        <div className="col-4 col-sm-3">
          {/* 圖片 */}
          <div className="d-flex justify-content-center mb-3 mb-sm-0">
            <img
              src={`/product-pics/${brand_name}/${productPics}`}
              alt={product_name}
              className="img-fluid bg-light mb-1"
              style={{ maxWidth: '80px', cursor: 'pointer' }}
              onClick={() => handleCardClick(product_id)}
            />
          </div>
          {/* 商品數量 */}
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-secondary text-light px-2 py-1"
              onClick={handleDecrease}
            >
              -
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={itemQuantity}
              onChange={handleInputChange}
              style={{ maxWidth: '60px' }}
            />
            <button
              className="btn btn-secondary text-light px-2 py-1"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>

        {/* 商品名稱和品牌名稱 */}
        <div
          className="col-6 col-sm-3"
          onClick={() => handleCardClick(product_id)}
          style={{ cursor: 'pointer' }}
        >
          <p className="mb-1 fw-bold">{product_name}</p>
          <p className="mb-1 text-muted">{brand_name}</p>
          <p className="mb-0">尺寸: {size}</p>
        </div>

        {/* 商品單價和總價 */}
        <div className="col-12 col-sm-3"
        onClick={() => handleCardClick(product_id)}
        style={{ cursor: 'pointer' }}>
          {/* 商品單價 */}
          <div className="text-end mb-2">
            {discount_price === '' || discount_price === null ? (
              <p className="mb-0">單價：NT${(price || 0).toLocaleString()}</p>
            ) : (
              <>
                <p className="mb-1">
                  折扣價：NT${(discount_price || 0).toLocaleString()}
                </p>
                <p className="text-muted mb-0">
                  <del>原價：NT${(price || 0).toLocaleString()}</del>
                </p>
              </>
            )}
          </div>
          {/* 商品總價 */}
          <div className="text-end">
            <p className="mb-0">
              小計：NT$
              {(
                (discount_price === null ? price : discount_price) *
                  itemQuantity || 0
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* 商品功能 */}
        <div className="col-12 col-sm-2 d-flex flex-column align-items-center mt-2 mt-sm-0">
          <button
            className="btn btn-primary mb-2 w-100"
            onClick={() => addToFavorites(product_id)}
          >
            移至收藏
          </button>
          <button className="btn btn-danger w-100" onClick={handleRemove}>
            刪除
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductDetails
