import React, { useState, useEffect } from 'react'
import CourseCard from '@/components/course/course-card'
import SortDropdown from '@/components/course/sort-dropdown'
import TypeDropdown from '@/components/course/type-dropdown'
import styles from '@/styles/course.module.scss'
import Search from '@/components/course/search'
import PageSelector from '@/components/common/page-selector/page-selector'

const CourseList = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [paginatedData, setPaginatedData] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedOption, setSelectedOption] = useState('熱門課程')
  const [typeCounts, setTypeCounts] = useState({ 1: 0, 2: 0, 3: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const ITEMS_PER_PAGE = 9

  // 取得資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course`)
        const result = await response.json()
        if (result.status === 'success') {
          // 🚩 確保 course_type 是數字
          const courses = result.data.course.map(c => ({
            ...c,
            course_type: Number(c.course_type),
          }))
          setData(courses)
          setFilteredData(courses)
          setTypeCounts(calculateTypeCounts(courses))
        }
      } catch (error) {
        console.error('無法取得資料:', error)
      }
    }
    fetchData()
  }, [])

  // 篩選 + 排序 + 分頁
  useEffect(() => {
    let filtered = filterByType(data, selectedType)

    // 搜尋
    if (search) {
      filtered = filtered.filter(
        (course) =>
          course.course_name.toLowerCase().includes(search.toLowerCase()) ||
          course.course_summary.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 排序
    const sorted = sortContent(filtered)
    setFilteredData(sorted)

    // 分頁
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginated = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    setPaginatedData(paginated)
  }, [data, selectedType, selectedOption, currentPage, search])

  // 篩選
  const filterByType = (data, type) => {
    return type !== null
      ? data.filter((item) => item.course_type === Number(type))
      : data
  }

  // 排序
  const sortContent = (data) => {
    let sorted = [...data]
    switch (selectedOption) {
      case '熱門課程':
        sorted.sort(
          (a, b) =>
            b.click_count - a.click_count ||
            new Date(b.course_create_day) - new Date(a.course_create_day)
        )
        break
      case '最新課程':
        sorted.sort(
          (a, b) => new Date(b.course_create_day) - new Date(a.course_create_day)
        )
        break
      case '價格由高到低':
        sorted.sort((a, b) => b.course_price - a.course_price)
        break
      case '價格由低到高':
        sorted.sort((a, b) => a.course_price - b.course_price)
        break
      default:
        break
    }
    return sorted
  }

  // 計算分類數量
  const calculateTypeCounts = (data) => {
    return data.reduce(
      (acc, item) => {
        const type = Number(item.course_type)
        if (type === 1) acc[1] += 1
        else if (type === 2) acc[2] += 1
        else if (type === 3) acc[3] += 1
        return acc
      },
      { 1: 0, 2: 0, 3: 0 }
    )
  }

  const typeNames = {
    1: '小提琴',
    2: '中提琴',
    3: '大提琴',
  }

  const handleSortChange = (option) => {
    setSelectedOption(option)
    setCurrentPage(1)
  }

  const handleTypeChange = (type) => {
    const typeMap = {
      所有商品: null,
      小提琴: 1,
      中提琴: 2,
      大提琴: 3,
    }
    setSelectedType(typeMap[type])
    setCurrentPage(1)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchClick = () => {
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearch('')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }


  return (
    <div className="container">
      {/* 右側課程列表 */}
      <div className="mb-3">
        <div className="row">
          <div
            className={`d-flex justify-content-end align-items-center ${styles['total-container']}`}
          >
            <div className="col-lg-3 col-md-4  fontDarkBrown web-16px-md">
              <p className={`mb-0 ${styles['total']}`}>
                共 {filteredData.length} 門課程
              </p>
            </div>
            <div className="col-md-3 col-6"></div>
            <div className="col-md-3 col-6">
              <div className={styles['sort-dropdown']}>
                {/* 排序下拉選單 */}
                <SortDropdown onSortChange={handleSortChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* 左側過濾器（桌面版） */}
        <div className={`col-lg-3 col-12`}>
          {/* 搜尋框 */}
          <Search
            search={search}
            onSearchChange={handleSearchChange}
            onSearchClick={handleSearchClick}
            onClearSearch={handleClearSearch}
          />
          {/* 課程篩選 */}
          <div className={`mt-4 ${styles['course-filter']}`}>
            <div className={styles['course-type']}>
              <h6 className="web-16px-md">課程分類</h6>
            </div>
            <div className={styles['course-type-list']}>
              <button
                className={`d-flex justify-content-between ${styles['type']} `}
                onClick={() => setSelectedType(null)}
              >
                <div className={`${styles['title']}`}>全部</div>
                <div className={styles['num']}>{data.length}</div>
              </button>
              {Object.keys(typeNames).map((key) => (
                <button
                  key={key}
                  className={`d-flex justify-content-between ${
                    styles['type']
                  } ${selectedType === Number(key) ? styles['active'] : ''}`}
                  onClick={() => setSelectedType(Number(key))}
                >
                  <div className={`${styles['title']}`}>{typeNames[key]}</div>
                  <div className={styles['num']}>{typeCounts[key]}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={`d-flex ${styles['total-sm-container']}`}>
            <div className={`col-md-6 ${styles['total-sm']}`}>
              <p className={`fontDarkBrown web-16px-md `}>
                共 {filteredData.length} 門課程
              </p>
            </div>
            <div className="col-md-3">
              {/* 過濾器下拉選單（手機版） */}
              <div className={styles['filter-dropdown-mb']}>
                <TypeDropdown onTypeChange={handleTypeChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles['sort-dropdown-mb']}>
                {/* 排序下拉選單 */}
                <SortDropdown onSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          <p className={`my-3 fontDarkBrown web-16px-md ${styles['total-mb']}`}>
            共 {filteredData.length} 門課程
          </p>
        </div>
        <div className="col-lg-9 col-12">
          <div className="row g-4 ">
            {paginatedData.map((course) => (
              <CourseCard key={course.id} course={course} searchTerm={search} />
            ))}
          </div>
          <div
            className={`d-flex justify-content-center m-5 ${styles['page']}`}
          >
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseList
