import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '@/components/product/product-card'
import ProductFilter from '@/components/product/product-filter'
import styles from '@/styles/product-styles/list.module.scss'
import PageSelector from '@/components/common/page-selector/page-selector'
import { IoSearch } from 'react-icons/io5'
import FilterOffcanvas from '@/components/product/filter-offcanvas'

export default function List() {
  const [products, setProducts] = useState([])
  const [overallTotal, setOverallTotal] = useState(0) // 添加總商品數狀態
  const [filteredTotal, setFilteredTotal] = useState(0) // 篩選後的總數量
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [initialMinPrice, setInitialMinPrice] = useState(null)
  const [initialMaxPrice, setInitialMaxPrice] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('default')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter()
  
  // 數字安全轉換函數
  const ensureNumber = (value) => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // 點擊卡片後導向商品詳細頁
  const handleCardClick = (id) => {
    router.push(`/product/${id}`)
  }

  // 取得商品資料
  useEffect(() => {
    const fetchProducts = async () => {
      if (initialMinPrice === null || initialMaxPrice === null) return
      setIsLoading(true)

      try {
        // 確保價格參數為數字
        const safeMinPrice = ensureNumber(minPrice)
        const safeMaxPrice = ensureNumber(maxPrice)
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${currentPage}&limit=9&search=${searchTerm}&category=${selectedCategory}&brand=${selectedBrand}&sort=${selectedSortOption}&minPrice=${safeMinPrice}&maxPrice=${safeMaxPrice}`
        )
        const result = await response.json()
        if (result.status === 'success') {
          // 確保產品數據中的價格為數字格式
          const processedProducts = result.data.products.map(product => ({
            ...product,
            price: ensureNumber(product.price),
            discount_price: product.discount_price ? ensureNumber(product.discount_price) : null
          }))
          
          setProducts(processedProducts)
          setTotalPages(Math.ceil(result.data.total / 9))
          setFilteredTotal(result.data.total) // 設定篩選後的商品總數
          setOverallTotal(result.data.overallTotal) // 設定所有商品的總數
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }finally {
        setIsLoading(false); 
      }
    }
    fetchProducts()
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedSortOption,
    minPrice,
    maxPrice,
  ])

  // 取得初始類別品牌價格資訊
  useEffect(() => {
    const initializeFiltersData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories-and-brands`
        )
        const result = await response.json()
        if (result.status === 'success') {
          setCategories(result.data.categories)
          setBrands(result.data.brands)

          if (result.data.priceRange) {
            const { min_price, max_price } = result.data.priceRange
            // 確保價格為數字格式
            const safeMinPrice = ensureNumber(min_price)
            const safeMaxPrice = ensureNumber(max_price)
            
            setInitialMinPrice(safeMinPrice) // 儲存初始最小價格
            setInitialMaxPrice(safeMaxPrice) // 儲存初始最大價格
            setMinPrice(safeMinPrice)
            setMaxPrice(safeMaxPrice)
          }
        }
      } catch (error) {
        console.error('無法取得類別和品牌資料:', error)
      }
    }
    initializeFiltersData()
  }, [])

  const handleSearch = (input) => {
    setSearchTerm(input) // 更新搜尋條件
  }

  // 當輸入框變更時，設置 debounce
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    const timeout = setTimeout(() => {
      handleSearch(searchInput)
    }, 500) // 停止輸入500毫秒後觸發搜尋

    setTypingTimeout(timeout)

    return () => clearTimeout(timeout)
  }, [searchInput])

  // 排序函數
  const sortProducts = (productsToSort) => {
    let sorted = [...productsToSort]
    if (selectedSortOption === 'priceAsc') {
      sorted.sort((a, b) => {
        const priceA = ensureNumber(a.discount_price || a.price)
        const priceB = ensureNumber(b.discount_price || b.price)
        return priceA - priceB
      })
    } else if (selectedSortOption === 'priceDesc') {
      sorted.sort((a, b) => {
        const priceA = ensureNumber(a.discount_price || a.price)
        const priceB = ensureNumber(b.discount_price || b.price)
        return priceB - priceA
      })
    } else if (selectedSortOption === 'oldest') {
      // 上架時間較早 (id由小到大)
      sorted.sort((a, b) => a.id - b.id)
    } else if (selectedSortOption === 'newest') {
      // 上架時間較晚 (id由大到小)
      sorted.sort((a, b) => b.id - a.id)
    }
    setProducts(sorted)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 監聽篩選條件的變化，當條件改變時重置頁數
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedBrand, searchTerm, selectedSortOption])

  const handleSortChange = (option) => {
    setSelectedSortOption(option)
    setCurrentPage(1)
    // 重置頁數
  }

  //小尺寸時的篩選視窗開關控制
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const handleShow = () => setShowOffcanvas(true)
  const handleClose = () => setShowOffcanvas(false)

  // 安全的價格比較函數
  const isPriceFiltered = () => {
    const currentMin = ensureNumber(minPrice)
    const currentMax = ensureNumber(maxPrice)
    const initialMin = ensureNumber(initialMinPrice)
    const initialMax = ensureNumber(initialMaxPrice)
    
    return currentMin !== initialMin || currentMax !== initialMax
  }

  return (
    <>
      <div className="container">
        <div className="row mb-5">
          <div className="col-md-3">
            <div className={styles.filterDiv}>
              <div className={styles.searchBarLg}>
                <input
                  type="text"
                  style={{ width: '100%' }}
                  placeholder="搜尋"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={() => handleSearch(searchInput)}>
                  <IoSearch size={20} />
                </button>
              </div>
              {initialMinPrice !== null && initialMaxPrice !== null && (
              <ProductFilter
                brandNames={brands.map((b) => b.name)}
                brandCounts={brands.reduce((acc, b) => {
                  acc[b.name] = b.count
                  return acc
                }, {})}
                categoryNames={categories.map((c) => c.name)}
                categoryCounts={categories.reduce((acc, c) => {
                  acc[c.name] = c.count
                  return acc
                }, {})}
                minPrice={ensureNumber(minPrice)}
                maxPrice={ensureNumber(maxPrice)}
                initialMinPrice={ensureNumber(initialMinPrice)} // 新增傳遞初始最小價格
                initialMaxPrice={ensureNumber(initialMaxPrice)} // 新增傳遞初始最大價格
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setSelectedCategory={setSelectedCategory}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
              />
              )}
            </div>
          </div>
          <div className={`${styles.productContainer} col-md-9`}>
            <div className={styles.sortDiv}>
              <button
                variant="secondary"
                onClick={handleShow}
                className={styles.filterButton}
              >
                <i class="bi bi-funnel-fill"></i>
              </button>
              {/* 小尺寸時的 Offcanvas 篩選視窗 */}
              {initialMinPrice !== null && initialMaxPrice !== null && (
              <FilterOffcanvas
                show={showOffcanvas}
                handleClose={handleClose}
                brandNames={brands.map((b) => b.name)}
                brandCounts={brands.reduce((acc, b) => {
                  acc[b.name] = b.count
                  return acc
                }, {})}
                categoryNames={categories.map((c) => c.name)}
                categoryCounts={categories.reduce((acc, c) => {
                  acc[c.name] = c.count
                  return acc
                }, {})}
                minPrice={ensureNumber(minPrice)}
                maxPrice={ensureNumber(maxPrice)}
                initialMinPrice={ensureNumber(initialMinPrice)} // 新增傳遞初始最小價格
                initialMaxPrice={ensureNumber(initialMaxPrice)} // 新增傳遞初始最大價格
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setSelectedCategory={setSelectedCategory}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
              />
              )}
              <div className={styles.searchBarSm}>
                <input
                  type="text"
                  style={{ width: '100%' }}
                  placeholder="搜尋"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={() => handleSearch(searchInput)}>
                  <IoSearch size={20} />
                </button>
              </div>

              <h6 className={`${styles.count} ms-1 mt-2 fontDarkBrown`}>
                共
                {selectedCategory ||
                selectedBrand ||
                searchTerm ||
                isPriceFiltered()
                  ? filteredTotal
                  : overallTotal}
                件商品
              </h6>
              {products.length > 0 && (
                <select
                  value={selectedSortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`${styles.sort} form-select`}
                >
                  <option value="default" className={styles.dropdownMenu}>
                    請選擇排序方式
                  </option>
                  <option value="priceAsc" className={styles.dropdownMenu}>
                    價格由低到高
                  </option>
                  <option value="priceDesc" className={styles.dropdownMenu}>
                    價格由高到低
                  </option>
                  <option value="oldest" className={styles.dropdownMenu}>
                    上架時間較早
                  </option>
                  <option value="newest" className={styles.dropdownMenu}>
                    上架時間較晚
                  </option>
                </select>
              )}
            </div>

            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3">
              {isLoading ? (
                <div className={styles.loading}>
                  <h5 className='fontDarkBrown'>商品載入中...</h5>
                  <hr />
                </div>
              ) : products.length > 0 ? (
                products.map((product) => {
                  const pictures = product.pictures
                    ? product.pictures.split(',')
                    : []
                  const defaultPic = pictures.find((pic) =>
                    pic.includes('-1.')
                  )
                  const hoverPic = pictures.find((pic) => pic.includes('-2.'))

                  return (
                    <div className="col" key={product.id}>
                      <ProductCard
                        brand_name={product.brand_name}
                        product_name={product.product_name}
                        price={ensureNumber(product.price)}
                        discount_price={product.discount_price ? ensureNumber(product.discount_price) : null}
                        defaultPic={defaultPic}
                        hoverPic={hoverPic}
                        product_id={product.id}
                        handleCardClick={() => handleCardClick(product.id)}
                      />
                    </div>
                  )
                })
              ) : ""}
            </div>
            <div className={styles.pageSelectorArea}>
              {isLoading ? (
                ''
              ) : products.length > 0 ? (
                <PageSelector
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : (
                <div className={styles.notFound}>
                  <h5 className="fontDarkBrown">沒有符合的商品</h5>
                  <hr />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}