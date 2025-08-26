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

  // 當 minPrice 和 maxPrice prop 更新時，更新初始值
  useEffect(() => {
    if (minPrice && maxPrice) {
      setCurrentMinPrice(minPrice)
      setCurrentMaxPrice(maxPrice)
    }
  }, [minPrice, maxPrice])


  useEffect(() => {
    if (initialMinPrice !== undefined && initialMaxPrice !== undefined) {
      setMinValue(((currentMinPrice - initialMinPrice) / (initialMaxPrice - initialMinPrice)) * 100)
      setMaxValue(((currentMaxPrice - initialMinPrice) / (initialMaxPrice - initialMinPrice)) * 100)
    }
  }, [initialMinPrice, initialMaxPrice, currentMinPrice, currentMaxPrice])

  

  const convertToPrice = (percentage) => {
    const min = initialMinPrice || minPrice;
    const max = initialMaxPrice || maxPrice;
    return Math.round(min + ((max - min) * percentage) / 100);
  };

  // 更新滑動條的最小值
  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - 1);
    setMinValue(value);
    const newPrice = convertToPrice(value);
    setCurrentMinPrice(newPrice);
    setMinPrice(newPrice); // 即時更新父組件的價格
  };

  // 更新滑動條的最大值
  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + 1);
    setMaxValue(value);
    const newPrice = convertToPrice(value);
    setCurrentMaxPrice(newPrice);
    setMaxPrice(newPrice); // 即時更新父組件的價格
  };

  // 當滑動條釋放時更新價格篩選的最小值和最大值
  const updatePriceRange = () => {
    const newMinPrice = convertToPrice(minValue)
    const newMaxPrice = convertToPrice(maxValue)

    setMinPrice(newMinPrice)
    setMaxPrice(newMaxPrice)
    setCurrentMinPrice(newMinPrice)
    setCurrentMaxPrice(newMaxPrice)
  }

  const hasFilters =
    selectedCategory ||
    selectedBrand ||
    currentMinPrice !== initialMinPrice ||
    currentMaxPrice !== initialMaxPrice 
    

  // 在 ProductFilter 組件中的價格輸入處理
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0
    const min = initialMinPrice || minPrice
    const max = initialMaxPrice || maxPrice

    if (type === 'min') {
      const newMinPrice = Math.max(value, min)
      setCurrentMinPrice(newMinPrice)
      setMinPrice(newMinPrice)
      const percentage = ((newMinPrice - min) / (max - min)) * 100
      setMinValue(Math.max(0, Math.min(percentage, 99)))
    } else {
      const newMaxPrice = Math.min(value, max)
      setCurrentMaxPrice(newMaxPrice)
      setMaxPrice(newMaxPrice)
      const percentage = ((newMaxPrice - min) / (max - min)) * 100
      setMaxValue(Math.min(100, Math.max(percentage, minValue + 1)))
    }
  }

  const clearAllFilters = () => {
    const min = initialMinPrice || minPrice
    const max = initialMaxPrice || maxPrice
    setMinValue(0);
    setMaxValue(100);
    setCurrentMinPrice(min)
    setCurrentMaxPrice(max)
    setMinPrice(min)
    setMaxPrice(max)
    setSelectedCategory('')
    setSelectedBrand('')
  }

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
                value={currentMinPrice}
                onChange={(e) => handlePriceChange(e, 'min')}
                className={styles.inputMin}
                placeholder="最低"
              />
            </div>
            <div className={styles.separator}>—</div>
            <div className={styles.field}>
              <input
                type="number"
                value={currentMaxPrice}
                onChange={(e) => handlePriceChange(e, 'max')}
                className={styles.inputMax}
                placeholder="最高"
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
              <p>$ {minPrice.toLocaleString()}</p>
              <p>$ {maxPrice.toLocaleString()}</p>
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
