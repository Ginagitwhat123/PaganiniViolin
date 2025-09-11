import React, { useState, useEffect } from 'react'
import styles from '@/styles/product-styles/productFilter.module.scss'

export default function ProductFilter({
  brandNames,
  brandCounts,
  categoryNames,
  categoryCounts,
  minPrice,
  maxPrice,
  initialMinPrice,
  initialMaxPrice,
  setMinPrice,
  setMaxPrice,
  setSelectedCategory,
  setSelectedBrand,
  selectedCategory,
  selectedBrand,
}) {
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)

  const [currentMinPrice, setCurrentMinPrice] = useState(minPrice)
  const [currentMaxPrice, setCurrentMaxPrice] = useState(maxPrice)

  // 確保數值為數字類型的輔助函數
  const ensureNumber = (value) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // 當 minPrice 和 maxPrice prop 更新時，更新初始值
  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      setCurrentMinPrice(minPrice)
      setCurrentMaxPrice(maxPrice)
    }
  }, [minPrice, maxPrice])

  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      const safeMinPrice = ensureNumber(minPrice)
      const safeMaxPrice = ensureNumber(maxPrice)
      setCurrentMinPrice(safeMinPrice)
      setCurrentMaxPrice(safeMaxPrice)
    }
  }, [minPrice, maxPrice])

  useEffect(() => {
    const safeInitialMin = ensureNumber(initialMinPrice)
    const safeInitialMax = ensureNumber(initialMaxPrice)
    const safeCurrentMin = ensureNumber(currentMinPrice)
    const safeCurrentMax = ensureNumber(currentMaxPrice)
    
    if (safeInitialMin !== null && safeInitialMax !== null && (safeInitialMax - safeInitialMin) > 0) {
      const minPercentage = ((safeCurrentMin - safeInitialMin) / (safeInitialMax - safeInitialMin)) * 100
      const maxPercentage = ((safeCurrentMax - safeInitialMin) / (safeInitialMax - safeInitialMin)) * 100
      
      setMinValue(Math.max(0, Math.min(100, minPercentage)))
      setMaxValue(Math.max(0, Math.min(100, maxPercentage)))
    }
  }, [initialMinPrice, initialMaxPrice, currentMinPrice, currentMaxPrice])

  const convertToPrice = (percentage) => {
    const safeInitialMin = ensureNumber(initialMinPrice || minPrice)
    const safeInitialMax = ensureNumber(initialMaxPrice || maxPrice)
    const range = safeInitialMax - safeInitialMin
    
    if (range <= 0) return safeInitialMin
    
    const price = safeInitialMin + (range * percentage / 100)
    return Math.round(price)
  }

  // 更新滑動條的最小值
  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - 1)
    setMinValue(value)
    const newPrice = convertToPrice(value)
    setCurrentMinPrice(newPrice)
    // 移除即時更新，只在滑動結束時更新
  }

  // 更新滑動條的最大值
  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + 1)
    setMaxValue(value)
    const newPrice = convertToPrice(value)
    setCurrentMaxPrice(newPrice)
    // 移除即時更新，只在滑動結束時更新
  }

  // 當滑動條釋放時更新價格篩選的最小值和最大值
  const updatePriceRange = () => {
    const newMinPrice = convertToPrice(minValue)
    const newMaxPrice = convertToPrice(maxValue)

    // 確保價格在有效範圍內
    const safeInitialMin = ensureNumber(initialMinPrice || minPrice)
    const safeInitialMax = ensureNumber(initialMaxPrice || maxPrice)
    
    const finalMinPrice = Math.max(safeInitialMin, newMinPrice)
    const finalMaxPrice = Math.min(safeInitialMax, newMaxPrice)

    setMinPrice(finalMinPrice)
    setMaxPrice(finalMaxPrice)
    setCurrentMinPrice(finalMinPrice)
    setCurrentMaxPrice(finalMaxPrice)
  }

  const hasFilters =
    selectedCategory ||
    selectedBrand ||
    ensureNumber(currentMinPrice) !== ensureNumber(initialMinPrice) ||
    ensureNumber(currentMaxPrice) !== ensureNumber(initialMaxPrice)

  // 在 ProductFilter 組件中的價格輸入處理
  const handlePriceChange = (e, type) => {
    const value = ensureNumber(e.target.value)
    const safeInitialMin = ensureNumber(initialMinPrice || minPrice)
    const safeInitialMax = ensureNumber(initialMaxPrice || maxPrice)

    if ((safeInitialMax - safeInitialMin) <= 0) {
      console.error('價格範圍無效')
      return
    }
    
    if (type === 'min') {
      const newMinPrice = Math.max(value, safeInitialMin)
      const clampedMinPrice = Math.min(newMinPrice, ensureNumber(currentMaxPrice) - 1)
      
      setCurrentMinPrice(clampedMinPrice)
      setMinPrice(clampedMinPrice)
      
      const percentage = ((clampedMinPrice - safeInitialMin) / (safeInitialMax - safeInitialMin)) * 100
      setMinValue(Math.max(0, Math.min(percentage, maxValue - 1)))
    } else {
      const newMaxPrice = Math.min(value, safeInitialMax)
      const clampedMaxPrice = Math.max(newMaxPrice, ensureNumber(currentMinPrice) + 1)
      
      setCurrentMaxPrice(clampedMaxPrice)
      setMaxPrice(clampedMaxPrice)
      
      const percentage = ((clampedMaxPrice - safeInitialMin) / (safeInitialMax - safeInitialMin)) * 100
      setMaxValue(Math.min(100, Math.max(percentage, minValue + 1)))
    }
  }

  const clearAllFilters = () => {
    const safeInitialMin = ensureNumber(initialMinPrice || minPrice)
    const safeInitialMax = ensureNumber(initialMaxPrice || maxPrice)
    
    setMinValue(0)
    setMaxValue(100)
    setCurrentMinPrice(safeInitialMin)
    setCurrentMaxPrice(safeInitialMax)
    setMinPrice(safeInitialMin)
    setMaxPrice(safeInitialMax)
    setSelectedCategory('')
    setSelectedBrand('')
  }

  // 安全的價格顯示
  const displayMinPrice = ensureNumber(minPrice)
  const displayMaxPrice = ensureNumber(maxPrice)

  return (
    <>
      {hasFilters && (
        <button className={styles.clearFilter} onClick={clearAllFilters}>
          清除篩選
        </button>
      )}
      <div className={`${styles.filterCard} mb-0`}>
        <div className={styles.cardHeader}>類別</div>
        <div className={styles.filterBody}>
          <button
            className={`${styles.filterBtn} btn ${selectedCategory ? '' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            全部
          </button>
          {categoryNames.map((categoryName, index) => (
            <button
              key={index}
              className={`${styles.filterBtn} btn ${
                selectedCategory === categoryName ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(categoryName)}
            >
              <div className={styles.filterTextWrapper}>
                <span>{categoryName}</span>
                <span>{categoryCounts[categoryName] || 0}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.filterCard} mb-0`}>
        <div className={styles.cardHeader}>價格區間</div>
        <div className={styles.wrapper}>
          <div className={styles.priceInput}>
            <div className={styles.field}>
              <input
                type="number"
                value={ensureNumber(currentMinPrice)}
                onChange={(e) => handlePriceChange(e, 'min')}
                className={styles.inputMin}
                placeholder="最低"
                min={ensureNumber(initialMinPrice || minPrice)}
                max={ensureNumber(initialMaxPrice || maxPrice)}
              />
            </div>
            <div className={styles.separator}>—</div>
            <div className={styles.field}>
              <input
                type="number"
                value={ensureNumber(currentMaxPrice)}
                onChange={(e) => handlePriceChange(e, 'max')}
                className={styles.inputMax}
                placeholder="最高"
                min={ensureNumber(initialMinPrice || minPrice)}
                max={ensureNumber(initialMaxPrice || maxPrice)}
              />
            </div>
          </div>
          <div className={styles.slider}>
            <div
              className={styles.progress}
              style={{
                left: `${minValue}%`,
                right: `${100 - maxValue}%`,
              }}
            />
            <div className={styles.priceTag}>
              <p>$ {displayMinPrice.toLocaleString()}</p>
              <p>$ {displayMaxPrice.toLocaleString()}</p>
            </div>
          </div>
          <div className={styles.rangeInput}>
            <input
              type="range"
              min={0}
              max={100}
              value={minValue}
              onChange={handleMinChange}
              onMouseUp={updatePriceRange}
              onTouchEnd={updatePriceRange}
              className={styles.rangeMin}
              step="1"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={maxValue}
              onChange={handleMaxChange}
              onMouseUp={updatePriceRange}
              onTouchEnd={updatePriceRange}
              className={styles.rangeMax}
              step="1"
            />
          </div>
        </div>
      </div>
      <div className={`${styles.filterCard} mb-0`}>
        <div className={styles.cardHeader}>品牌</div>
        <div className={styles.filterBody}>
          <button
            className={`${styles.filterBtn} btn ${selectedBrand ? '' : ''}`}
            onClick={() => setSelectedBrand('')}
          >
            全部
          </button>
          {brandNames.map((brandName, index) => (
            <button
              key={index}
              className={`${styles.filterBtn} btn ${
                selectedBrand === brandName ? styles.active : ''
              }`}
              onClick={() => setSelectedBrand(brandName)}
            >
              <div className={styles.filterTextWrapper}>
                <span>{brandName}</span>
                <span>{brandCounts[brandName] || 0}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
