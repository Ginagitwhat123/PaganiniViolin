import React, { useEffect, useState, useCallback } from 'react'
import styles from './list.module.scss'
import Cards from '../common/cards/list-cards'
import SortDropdown from '../common/sort-dropdown/sort-dropdown'
import UserBlog from '../common/user-blog-section/user-blog-section'
import CategorySection from '../common/category-section/category-section'
import Pagination from '../common/pagination/pagination'
import SearchBar from '../common/search-bar/search-bar'
import Loading from '@/components/common/loading/loading'
import { debounce } from 'lodash'
import { useAuth } from '@/hooks/use-auth' // 导入 useAuth hook

export default function List() {
  const { auth } = useAuth() // 使用 useAuth hook 获取登录用户信息
  const [blogs, setBlogs] = useState([]) // 存储博客数据
  const [totalBlogs, setTotalBlogs] = useState(0) // 存储博客总数
  const [currentPage, setCurrentPage] = useState(1) // 当前页数
  const [totalPages, setTotalPages] = useState(0) // 总页数
  const [loading, setLoading] = useState(true) // 加载状态
  const [sortOrder, setSortOrder] = useState('DESC') // 排序顺序
  const [search, setSearch] = useState('') // 搜索字符串
  const [category, setCategory] = useState('') // 选中的类别

  // 判断用户是否登录
  const isUserLoggedIn = auth && auth.userData && auth.userData.ID

  // 用于从 URL 中获取查询参数
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      page: parseInt(urlParams.get('page')) || 1,
      order: urlParams.get('order') || 'DESC',
      search: urlParams.get('search') || '',
      category: urlParams.get('category') || '',
    }
  }

  // 初始化 URL 参数并更新状态
  useEffect(() => {
    const { page, order, search, category } = getUrlParams()
    setCurrentPage(page)
    setSortOrder(order)
    setSearch(search)
    setCategory(category)
  }, []) // 加载时一次性加载类别数据

  // 更新 URL 查询参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('order', sortOrder)
    urlParams.set('page', currentPage)
    if (category) urlParams.set('category', category)
    else urlParams.delete('category')
    if (search) urlParams.set('search', search)
    window.history.pushState({}, '', '?' + urlParams.toString())
  }, [sortOrder, currentPage, category, search])

  // 获取博客数据
  const fetchBlogs = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: currentPage,
      limit: 12,
      order: sortOrder,
      search,
      category,
    })
    try {
      const response = await fetch(`http://localhost:3005/api/blog?${params}`)
      const data = await response.json()
      setBlogs(data.blogs)
      setTotalBlogs(data.total_count)
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [sortOrder, currentPage, category, search]) // 当页码、排序、搜索或类别变更时重新加载博客

  // 处理排序变更
  const handleSortChange = (order) => {
    setSortOrder(order)
  }

  // 处理页码变更
  const handlePageChange = (event) => {
    const pageNumber = event.selected + 1
    setCurrentPage(pageNumber)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 处理搜索变更
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch)
    setCurrentPage(1) // 重置为第1页
  }

  // 防抖处理类别变更
  const handleCategoryChange = useCallback(
    debounce((newCategory) => {
      setCategory(newCategory)
      setCurrentPage(1) // 重置为第1页
    }, 300),
    []
  )

  // 显示总数（大于 999 显示 "999+"）
  const getDisplayTotalCount = (totalCount) => {
    return totalCount > 999 ? '999+' : totalCount
  }

  return (
    <div className={styles.container}>
      <div className={styles.aside}>
        <SearchBar search={search} onSearchChange={handleSearchChange} />
        <CategorySection
          selectedCategory={category}
          onCategoryChange={handleCategoryChange} // 使用防抖处理类别变更
        />
        {/* 传递 isUserLoggedIn 属性 */}
        <UserBlog isUserLoggedIn={isUserLoggedIn} />
      </div>
      <div className={styles.main}>
        <div className={styles.quantityAndSort}>
          <p>
            每頁顯示 12 篇，總共 {getDisplayTotalCount(totalBlogs)} 篇部落格
          </p>
          <SortDropdown onSortChange={handleSortChange} />
        </div>
        <Cards blogs={blogs} />
        {totalPages > 1 && ( // 只有當總頁數大於1時才顯示分頁
          <Pagination
            forcePage={currentPage - 1}
            pageCount={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <footer className={styles.footer}></footer>
    </div>
  )
}
