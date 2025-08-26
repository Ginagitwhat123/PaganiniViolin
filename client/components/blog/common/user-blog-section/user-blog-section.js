import React, { useEffect, useState } from 'react'
import ActionButton from './action-button'
import styles from './user-blog-section.module.scss'

// 假设你使用 FontAwesome 或其他图标库
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const UserBlog = ({ isUserLoggedIn }) => {
  const buttonLabels = ['我的部落格', '發布部落格']

  // 定义状态来控制收合/展开
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false) // 用来判断是否为小屏幕

  // 切换收合状态
  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState)
  }

  // 监听窗口大小变化
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768) // 小于 768px 时启用收合
  }

  useEffect(() => {
    handleResize() // 初始化时检查一次窗口大小
    window.addEventListener('resize', handleResize) // 监听窗口大小变化

    return () => window.removeEventListener('resize', handleResize) // 清理事件监听器
  }, [])

  // 跳转逻辑
  const handleButtonClick = (label) => {
    switch (label) {
      case '我的部落格':
        window.location.href = 'http://localhost:3000/blog/myblog'
        break
      case '發布部落格':
        window.location.href = 'http://localhost:3000/blog/write'
        break
      default:
        break
    }
  }

  if (!isUserLoggedIn) {
    return null // 如果未登录，直接不渲染任何内容
  }

  return (
    <div className={styles.userBlog}>
      {/* 这里将 FilterTitle 和箭头合并成一个可点击的区域 */}
      <div className={styles.header} onClick={isMobile ? toggleCollapse : null}>
        <h3 className={styles.filterTitle}>個人</h3>
        {/* 根据收合状态显示不同的箭头图标 */}
        {isMobile && (
          <span className={styles.arrowIcon}>
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </span>
        )}
      </div>

      {/* 根据收合状态显示按钮列表 */}
      {(isMobile ? !isCollapsed : true) && (
        <div className={styles.buttonContainer}>
          {buttonLabels.map((item, index) => (
            <ActionButton
              label={item}
              key={index}
              onClick={() => handleButtonClick(item)} // 传递label到handleButtonClick
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserBlog
