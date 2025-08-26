import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Offcanvas, Button } from 'react-bootstrap'
import ProductCard from '@/components/product/product-card'
import ProductFilter from '@/components/product/product-filter'
import styles from '@/styles/product-styles/list.module.scss'
import PageSelector from '@/components/common/page-selector/page-selector'
import { IoSearch } from 'react-icons/io5'
import FilterOffcanvas from '@/components/product/filter-offcanvas'

export default function List() {
  const router = useRouter()

  const handleCardClick = (id) => {
    // 點擊卡片後導向商品詳細頁
    router.push(`/product/${id}`)
  }

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
  const [isPriceInitialized, setIsPriceInitialized] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)

  // 呼叫 API 取得所有資料
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 只有在價格範圍已初始化後才加入價格參數
        const priceParams = isPriceInitialized
          ? `&minPrice=${minPrice}&maxPrice=${maxPrice}`
          : ''

        const response = await fetch(
          `http://localhost:3005/api/products?page=${currentPage}&limit=9&search=${searchTerm}&category=${selectedCategory}&brand=${selectedBrand}&sort=${selectedSortOption}${priceParams}`
        )
        const result = await response.json()
        if (result.status === 'success') {
          setProducts(result.data.products)
          setTotalPages(Math.ceil(result.data.total / 9))
          setFilteredTotal(result.data.total) // 設定篩選後的商品總數
          setOverallTotal(result.data.overallTotal) // 設定所有商品的總數
        }
      } catch (error) {
        console.error('無法取得資料:', error)
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

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const response = await fetch(
          'http://localhost:3005/api/products/categories-and-brands'
        )
        const result = await response.json()
        if (result.status === 'success') {
          setCategories(result.data.categories)
          setBrands(result.data.brands)

          // 只在價格還沒初始化時設定價格範圍
          if (!isPriceInitialized && result.data.priceRange) {
            const { min_price, max_price } = result.data.priceRange
            setInitialMinPrice(min_price) // 儲存初始最小價格
            setInitialMaxPrice(max_price) // 儲存初始最大價格
            setMinPrice(min_price)
            setMaxPrice(max_price)
            setIsPriceInitialized(true)
          }
        }
      } catch (error) {
        console.error('無法取得類別和品牌資料:', error)
      }
    }
    fetchCategoriesAndBrands()
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
        const priceA = a.discount_price || a.price
        const priceB = b.discount_price || b.price
        return priceA - priceB
      })
    } else if (selectedSortOption === 'priceDesc') {
      sorted.sort((a, b) => {
        const priceA = a.discount_price || a.price
        const priceB = b.discount_price || b.price
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

  // 修改處理篩選條件變化的函數
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1) // 重置頁數
  }

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand)
    setCurrentPage(1) // 重置頁數
  }

  const handleSearchChange = (search) => {
    setSearchTerm(search)
    setCurrentPage(1) // 重置頁數
  }

  const handleSortChange = (option) => {
    setSelectedSortOption(option)
    setCurrentPage(1)
    // 重置頁數
  }

  const handleMinPriceChange = (value) => {
    const newMinPrice = parseInt(value) || 0
    setMinPrice(newMinPrice)
    setCurrentPage(1)
  }

  const handleMaxPriceChange = (value) => {
    const newMaxPrice = parseInt(value) || 1000000
    setMaxPrice(newMaxPrice)
    setCurrentPage(1)
  }

  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleShow = () => setShowOffcanvas(true)
  const handleClose = () => setShowOffcanvas(false)

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
                minPrice={minPrice || 0}
                maxPrice={maxPrice || 1000000}
                initialMinPrice={initialMinPrice || 0} // 新增傳遞初始最小價格
                initialMaxPrice={initialMaxPrice || 1000000} // 新增傳遞初始最大價格
                setMinPrice={(value) => {
                  setMinPrice(value)
                  setIsPriceInitialized(true)
                }}
                setMaxPrice={(value) => {
                  setMaxPrice(value)
                  setIsPriceInitialized(true)
                }}
                setSelectedCategory={setSelectedCategory}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                setSearchTerm={setSearchTerm}
              />
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
                minPrice={minPrice || 0}
                maxPrice={maxPrice || 1000000}
                initialMinPrice={initialMinPrice || 0} // 新增傳遞初始最小價格
                initialMaxPrice={initialMaxPrice || 1000000} // 新增傳遞初始最大價格
                setMinPrice={(value) => {
                  setMinPrice(value)
                  setIsPriceInitialized(true)
                }}
                setMaxPrice={(value) => {
                  setMaxPrice(value)
                  setIsPriceInitialized(true)
                }}
                setSelectedCategory={setSelectedCategory}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                setSearchTerm={setSearchTerm}
              />

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
                minPrice !== initialMinPrice ||
                maxPrice !== initialMaxPrice
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
              {products.map((product) => {
                // 將圖片字串分割成陣列
                const pictures = product.pictures
                  ? product.pictures.split(',')
                  : []
                // 篩選包含 '-1.' 的圖片作為默認圖片
                const defaultPic = pictures.find((pic) => pic.includes('-1.'))
                // 篩選包含 '-2.' 的圖片作為 hover 時的圖片
                const hoverPic = pictures.find((pic) => pic.includes('-2.'))

                return (
                  <div className="col" key={product.id}>
                    <ProductCard
                      brand_name={product.brand_name}
                      product_name={product.product_name}
                      price={product.price}
                      discount_price={product.discount_price}
                      defaultPic={defaultPic} // 傳遞默認圖片
                      hoverPic={hoverPic} // 傳遞 hover 圖片
                      product_id={product.id} // 傳遞當前產品的 ID
                      handleCardClick={() => handleCardClick(product.id)}
                    />
                  </div>
                )
              })}
            </div>
            <div className={styles.pageSelectorArea}>
              {products.length > 0 ? (
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
