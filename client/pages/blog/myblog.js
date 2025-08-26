import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2' // 引入 Swal
import styles from './myblog.module.scss'
import Cards from '@/components/blog/common/cards/myblog-cards'
import SortDropdown from '@/components/blog/common/sort-dropdown/sort-dropdown-myblog'
import CategorySection from '@/components/blog/common/category-section/category-section-myblog'
import Pagination from '@/components/blog/common/pagination/pagination'
import SearchBar from '@/components/blog/common/search-bar/search-bar'
import { useAuth } from '@/hooks/use-auth'

export default function List() {
  const { auth } = useAuth() // 使用 useAuth hook 获取登录用户信息
  const userID = auth.userData.ID // 假设 auth.userData 中有 ID
  const [blogs, setBlogs] = useState([]) // 用来存储从后端获取的文章数据
  const [selectedCategory, setSelectedCategory] = useState('所有類別') // 默认选择 "所有类别"
  const [loading, setLoading] = useState(true) // 控制加载状态
  const [error, setError] = useState(null) // 错误处理
  const [order, setOrder] = useState('DESC') // 默认排序顺序是由新到旧
  const [currentPage, setCurrentPage] = useState(0) // 当前页数
  const [blogsPerPage] = useState(12) // 每页显示的博客数量
  const [totalPages, setTotalPages] = useState(0) // 总页数
  const [totalCount, setTotalCount] = useState(0) // 总博客数量
  const [search, setSearch] = useState('') // 搜索内容

  // 从 URL 获取 order、page 和 search 参数，并初始化状态
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const order = urlParams.get('order') || 'DESC' // 获取 URL 中的 order 参数
    const page = parseInt(urlParams.get('page')) || 1 // 获取 URL 中的 page 参数
    const search = urlParams.get('search') || '' // 获取 URL 中的 search 参数
    const category = urlParams.get('category') || '所有類別' // 获取 URL 中的 category 参数

    setSelectedCategory(category) // 更新类别
    setOrder(order) // 更新排序
    setCurrentPage(page - 1) // 设置当前页（从 0 开始）
    setSearch(search) // 更新搜索内容
  }, []) // 只在组件加载时执行一次

  // 更新 URL 查询参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    // 如果是 "所有類別"，就完全删除 category 参数
    if (selectedCategory === '所有類別' || selectedCategory === '') {
      urlParams.delete('category') // 删除 category 参数
    } else {
      urlParams.set('category', selectedCategory) // 更新 URL 中的 category 参数
    }

    // 其他参数设置
    if (order) {
      urlParams.set('order', order) // 更新 URL 中的 order 参数
    }
    urlParams.set('page', currentPage + 1) // 设置 URL 中的 page 参数 (注意转换为 1 索引)
    if (search) {
      urlParams.set('search', search) // 更新 URL 中的 search 参数
    } else {
      urlParams.delete('search') // 如果没有搜索内容，删除 search 参数
    }

    // 更新浏览器地址栏 URL
    window.history.pushState({}, '', '?' + urlParams.toString())
  }, [selectedCategory, order, currentPage, search]) // 每当 selectedCategory、order、currentPage 或 search 改变时更新 URL

  // 从后端获取当前用户的博客数据
  useEffect(() => {
    async function fetchBlogs() {
      try {
        let url = `http://localhost:3005/api/blog/myblog/${userID}?limit=${blogsPerPage}&page=${
          currentPage + 1
        }` // 添加分页参数
        if (selectedCategory && selectedCategory !== '所有類別') {
          url += `&category=${selectedCategory}` // 添加类别筛选
        }
        if (order) {
          url += `&order=${order}` // 添加排序条件
        }
        if (search) {
          url += `&search=${search}` // 添加搜索条件
        }

        const res = await fetch(url)
        const data = await res.json()

        if (res.ok) {
          setBlogs(data.blogs) // 设置从后端获取的博客数据
          setTotalPages(data.total_pages) // 设置总页数
          setTotalCount(data.total_count) // 设置总博客数量
        } else {
          // 用 SweetAlert2 弹出错误提示
          Swal.fire({
            title: '錯誤',
            text: '無法獲得我的部落格列表',
            icon: 'error',
            confirmButtonText: '確定',
            customClass: {
              title: 'swal2-custom-title',
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button',
            },
          })
        }
      } catch (error) {
        // 用 SweetAlert2 弹出错误提示
        Swal.fire({
          title: '錯誤',
          text: '無法獲得我的部落格列表',
          icon: 'error',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
      } finally {
        setLoading(false) // 确保无论请求是否成功，都更新 loading 状态
      }
    }
    fetchBlogs()
  }, [userID, order, currentPage, selectedCategory, search]) // 每当 selectedCategory、order、currentPage 或 search 改变时重新加载

  // 处理排序变更
  const handleSortChange = (newOrder) => {
    setOrder(newOrder) // 更新排序顺序
  }

  // 处理页码变化
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected) // 更新当前页码
  }

  // 处理类别变更
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory) // 更新类别
    setCurrentPage(0) // 重置为第一页
  }

  // 处理搜索变更
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch) // 更新搜索内容
    setCurrentPage(0) // 搜索后重置为第一页
  }

  // 处理软刪除
  const handleSoftDelete = async (blogID) => {
    // 先弹出 SweetAlert2 确认框
    Swal.fire({
      title: '您確定要刪除嗎?',
      text: '刪除後無法恢復!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '是的，刪除它!',
      cancelButtonText: '不，取消!',
      reverseButtons: true, // 确保按钮顺序正确
      customClass: {
        title: 'swal2-custom-title', // 自定義標題樣式
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'my-confirm-btn', // 为确认按钮指定自定义类名
        cancelButton: 'my-cancel-btn', // 为取消按钮指定自定义类名
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:3005/api/blog/myblog/${userID}/${blogID}/softdelete`,
            {
              method: 'PUT',
            }
          )

          const data = await res.json()

          if (res.ok) {
            // 删除成功，弹出成功提示框
            Swal.fire({
              title: '已刪除!',
              text: '您的文章已經被刪除。',
              icon: 'success',
              confirmButtonText: '確定',
              customClass: {
                title: 'swal2-custom-title',
                htmlContainer: 'swal2-custom-text',
                confirmButton: 'swal2-custom-confirm-button',
              },
            }).then(() => {
              // 刷新页面
              window.location.reload()
            })
            // 删除已软刪除的博客
            setBlogs((prevBlogs) =>
              prevBlogs.filter((blog) => blog.id !== blogID)
            )
          } else {
            // 删除失败，弹出失败提示框
            Swal.fire({
              title: '刪除失敗',
              text: data.error || '請稍後再試',
              icon: 'error',
              confirmButtonText: '確定',
              customClass: {
                title: 'swal2-custom-title',
                htmlContainer: 'swal2-custom-text',
                confirmButton: 'swal2-custom-confirm-button',
              },
            })
          }
        } catch (error) {
          // 请求失败时弹出错误提示框
          Swal.fire({
            title: '刪除失敗',
            text: '請稍後再試',
            icon: 'error',
            confirmButtonText: '確定',
            customClass: {
              title: 'swal2-custom-title',
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button',
            },
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // 用户取消删除
        Swal.fire({
          title: '已取消',
          text: '您的文章保持安全。',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
      }
    })
  }

  // if (loading) {
  //   return <p>載入中...</p> // 确保当 loading 为 true 时显示
  // }

  if (error) {
    return <p>{error}</p> // 显示错误信息
  }

  // 切割分页数据：只显示当前页的数据
  const currentBlogs = blogs // 已经从后端获取并分页的数据，前端无需再次切割

  return (
    <div className={styles.container}>
      {/* 侧边栏 */}
      <div className={styles.aside}>
        {/* 搜索条件 */}
        <SearchBar search={search} onSearchChange={handleSearchChange} />
        {/* 类别筛选区块 */}
        <CategorySection
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* 主要内容 */}
      <div className={styles.main}>
        <div className={styles.quantityAndSort}>
          {/* 显示文章总数 */}
          <p>每頁顯示 12 篇，共 {totalCount} 篇部落格</p>
          {/* 排序菜单 */}
          <SortDropdown onSortChange={handleSortChange} />
        </div>
        {/* 卡片区块 */}
        <Cards blogs={currentBlogs} onDelete={handleSoftDelete} />
        {/* 分页器：如果总页数大于1，才显示分页器 */}
        {totalPages > 1 && (
          <Pagination
            forcePage={currentPage} // 当前页
            pageCount={totalPages} // 总页数
            onPageChange={handlePageChange} // 页码变化的处理函数
          />
        )}
      </div>

      <footer className={styles.footer}></footer>
    </div>
  )
}
