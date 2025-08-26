import React, { useState, useEffect, useMemo } from 'react'
import Swal from 'sweetalert2' // 導入 SweetAlert2
import { useRouter } from 'next/router'
import styles from '@/styles/product-styles/product-detail-right.module.scss'
import { useAuth } from '@/hooks/use-auth'
import ProductLikeIcon from '@/components/product-like/like-icon'
import { useOrderCoupon } from '@/hooks/order-coupon' // 購物車數量

export default function ProductDetailRight({
  product_id,
  product_name,
  discount_price,
  price,
  brand_name,
  sizes,
}) {
  const router = useRouter()
  const { auth } = useAuth()
  const [selectedSize, setSelectedSize] = useState('')
  const [stockOptions, setStockOptions] = useState([])
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedStock, setSelectedStock] = useState(null)

  // 購物車數量利用hook儲存
  const { totalQuantity, setTotalQuantity } = useOrderCoupon()

  // 使用 useMemo 確保 parsedSizes 只在 sizes 改變時重新計算
  const parsedSizes = useMemo(() => {
    return sizes && sizes.includes(':')
      ? sizes.split(',').map((sizeInfo) => {
          const [size, stock] = sizeInfo.split(':')
          return { size, stock: Number(stock) }
        })
      : [{ size: '', stock: Number(sizes) }] // 若無尺寸，則只存庫存數量
  }, [sizes])

  // 當選擇尺寸改變時，更新 stockOptions
  useEffect(() => {
    if (parsedSizes.length === 1 && parsedSizes[0].size === '') {
      // 如果沒有尺寸，直接設定庫存數量選項
      const stock = parsedSizes[0].stock || 0
      setSelectedStock(stock)
      setStockOptions(
        stock > 0 ? Array.from({ length: stock }, (_, i) => i + 1) : []
      )
    } else if (selectedSize) {
      // 有尺寸時的處理
      const stock =
        parsedSizes.find((item) => item.size === selectedSize)?.stock || 0
      setSelectedStock(stock)
      setStockOptions(
        stock > 0 ? Array.from({ length: stock }, (_, i) => i + 1) : []
      )
    } else {
      // 重置狀態
      setSelectedStock(null)
      setStockOptions([])
    }
  }, [selectedSize, parsedSizes])

  // 檢查資料是否正確傳入，並在資料缺少時顯示 loading
  if (!product_name || price === undefined) {
    return <div>Loading...</div>
  }

  // 加入購物車按鈕處理器
  const handleAddToCartClick = async () => {
    // [加入購物車前登入檢查]
    if (!auth.isAuth) {
      await Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能將商品加入購物車。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    } else {
      await addToCart()
    }
  }

  // 馬上購買按鈕處理器
  const handleBuyNowClick = async () => {
    // [加入購物車前登入檢查]
    if (!auth.isAuth) {
      await Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能將商品加入購物車。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    } else {
      const isAddedToCart = await addToCart()
      if (isAddedToCart) {
        // TODO: 成功提示訊息是否可以先顯示再跳轉
        router.push('/cart')
      }
    }
  }

  // 加入購物車-POST
  const addToCart = async () => {
    if (parsedSizes.length > 1 && !selectedSize) {
      Swal.fire({
        icon: 'warning',
        title: '請選擇尺寸',
        text: '請選擇尺寸後再加入購物車',
        confirmButtonColor: '#3085d6',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
      return false
    }

    // 獲取所選尺寸的庫存
    const selectedStock =
      parsedSizes.find((item) => item.size === selectedSize)?.stock || 0

    try {
      // 發送請求以檢查購物車中該產品及尺寸的現有數量
      const cartResponse = await fetch(`http://localhost:3005/api/cart/check`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product_id,
          size: selectedSize,
        }),
      })
      const cartData = await cartResponse.json()

      // 取得購物車中已有的數量，默認為0
      const existingQuantity = cartData?.quantity || 0
      const newTotalQuantity = existingQuantity + selectedQuantity

      // 檢查新增後的數量是否超過庫存
      if (newTotalQuantity > selectedStock) {
        Swal.fire({
          icon: 'error',
          title: '數量超出庫存',
          text: `最大可加入數量為 ${
            selectedStock - existingQuantity
          }，購物車中已加入數量為 ${existingQuantity}`,
          confirmButtonColor: '#d33',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
        return false
      }

      // 發送請求將商品加入購物車
      const addResponse = await fetch('http://localhost:3005/api/cart/add', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product_id,
          quantity: selectedQuantity,
          size: selectedSize,
        }),
      })
      const result = await addResponse.json()

      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '加入成功！',
          text: result.message,
          confirmButtonColor: '#3085d6',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })

        setTotalQuantity(
          (prevTotalQuantity) =>
            Number(prevTotalQuantity) + Number(selectedQuantity)
        )

        return true
      } else {
        Swal.fire({
          icon: 'error',
          title: '加入失敗',
          text: '加入購物車失敗，請重試',
          confirmButtonColor: '#d33',
          customClass: {
            title: 'swal2-custom-title', // 自定義標題樣式
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
          },
        })
        return false
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '加入失敗',
        text: '加入購物車失敗，請重試',
        confirmButtonColor: '#d33',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      })
      console.error('無法取得資料:', error)
      return false
    }
  }

  // // 監聽數量變化
  // const handleQuantityChange = (event) => {
  //   setSelectedQuantity(Number(event.target.value))
  // }

  return (
    <>
      <div className={styles.rightArea}>
        <div className={styles.innerArea}>
          <div className={styles.productTitleArea}>
            <h3 className={`${styles.productTitle} fontDarkBrown h3Bold`}>
              {product_name}
            </h3>

            <ProductLikeIcon
              product_id={product_id}
              className={styles.pidFavoriteIcon}
            />

            <h4 className={`${styles.brandTitle} fontDarkBrown h4Bold`}>
              {brand_name}
            </h4>
          </div>
          <div className="d-flex">
            {discount_price ? (
              <>
                <h3 className={`${styles.price} fontDarkBrown h3Bold`}>
                  NT ${discount_price.toLocaleString()}
                </h3>
                <h5 className={`${styles.discountPrice} web-16px-light`}>
                  NT ${price.toLocaleString()}
                </h5>
              </>
            ) : (
              <h3 className={`${styles.price} fontDarkBrown h3Bold`}>
                NT ${price.toLocaleString()}
              </h3>
            )}
          </div>
          {/* 只在有尺寸時顯示尺寸區塊 */}
          {parsedSizes.length > 1 && (
            <>
              <label htmlFor="size" className="fontDarkBrown web-16px-B mb-3">
                尺寸：
              </label>
              <div className="size">
                {parsedSizes.map(
                  (sizeInfo, index) =>
                    sizeInfo.size && (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(sizeInfo.size)}
                        className={styles.sizeBtn}
                        style={{
                          backgroundColor:
                            selectedSize === sizeInfo.size
                              ? '#716657'
                              : 'transparent',
                          color:
                            selectedSize === sizeInfo.size ? '#fff' : '#716657',
                        }}
                      >
                        {sizeInfo.size}
                      </button>
                    )
                )}
              </div>
            </>
          )}
          <label
            htmlFor="amount"
            className="mt-3 fontDarkBrown web-16px-B mb-3"
          >
            數量：
          </label>
          <select
            id="amount"
            className={`${styles.amount} form-select`}
            value={selectedQuantity}
            onChange={(event) =>
              setSelectedQuantity(Number(event.target.value))
            }
          >
            {parsedSizes.length === 1 && parsedSizes[0].size === '' ? (
              // 沒有尺寸時，直接顯示庫存數量
              stockOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            ) : !selectedSize ? (
              // 有尺寸但未選擇尺寸時的提示
              <option value="default" className={styles.alert}>
                請先選擇尺寸
              </option>
            ) : selectedStock <= 0 ? (
              // 庫存為 0 時的提示
              <option value="default">該尺寸目前已無庫存</option>
            ) : (
              // 正常顯示可選數量
              stockOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
          <h6 className={`${styles.deliveryLimit}`}>
            ※目前配送服務僅限台灣本島與澎湖、金門、馬祖等外島部分地區。
          </h6>
          <button
            type="button"
            className={`${styles.cartBtn} fontDarkBrown h6`}
            onClick={handleAddToCartClick}
          >
            加入購物車
          </button>
          <button
            type="button"
            className={`${styles.BuyBtn} h6`}
            onClick={handleBuyNowClick}
          >
            馬上購買
          </button>
        </div>
      </div>
    </>
  )
}
