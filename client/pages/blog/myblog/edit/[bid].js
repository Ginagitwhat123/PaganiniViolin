import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styles from '@/pages/blog/write.module.scss'
import { FaImage } from 'react-icons/fa6'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2' // 引入 SweetAlert2
import { useNameAsBreadcrumb } from '@/hooks/use-name-as-breadcrumb' // 導入麵包屑名稱傳遞用的 hook

// 動態導入 ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.bubble.css'
import 'sweetalert2/dist/sweetalert2.min.css' // 引入 SweetAlert2 CSS

const Edit = () => {
  const { auth } = useAuth() // 使用 useAuth hook 取得登入用戶資訊
  const userID = auth.userData.ID // 假設 auth.userData 中有 ID
  const router = useRouter()
  const { bid } = router.query
  const [value, setValue] = useState('') // 文章內容
  const [category, setCategory] = useState('') // 分類名稱
  const [categoryId, setCategoryId] = useState('') // 文章分類ID
  const [image, setImage] = useState(null) // 當前上傳的圖片
  const [imagePreview, setImagePreview] = useState('') // 圖片預覽
  const [title, setTitle] = useState('') // 文章標題
  const [selectedCategory, setSelectedCategory] = useState('請選擇分類') // 當前選中的分類名稱
  const imageInputRef = useRef(null)
  const { setSubTitle } = useNameAsBreadcrumb() // 引用麵包屑名稱 hook 變數

  // 分類列表
  const categories = [
    { id: '1', label: '教學' },
    { id: '2', label: '保養' },
    { id: '3', label: '選購指南' },
    { id: '4', label: '小百科' },
    { id: '5', label: '檢定考試' },
    { id: '6', label: '學習經驗分享' },
  ]

  // 加載文章資料
  useEffect(() => {
    if (bid) {
      axios
        .get(`http://localhost:3005/api/blog/myblog/edit/${bid}`)
        .then((response) => {
          const { blog } = response.data
          setTitle(blog.title)
          setValue(blog.content)
          setCategory(blog.category_name)
          setCategoryId(blog.category_id) // 確保使用 category_id 而非 category_name
          setSelectedCategory(blog.category_name)

          const imageUrl = blog.cover_img_url.startsWith('http')
            ? blog.cover_img_url
            : `http://localhost:3005/blog/${blog.cover_img_url}`

          setImagePreview(imageUrl)
        })
        .catch((error) => {
          console.error('Error fetching blog:', error)
        })
    }
  }, [bid])

  // 設定麵包屑名稱
  useEffect(() => {
    if (title) {
      setSubTitle(title) // 使用文章標題設定麵包屑名稱
    } else {
      setSubTitle('文章標題尚未定義') // 使用文章標題設定麵包屑名稱
    }
  }, [title, setSubTitle])

  // 分類選擇
  const handleCategoryChange = (id, label) => {
    setCategoryId(id) // 更新分類ID
    setCategory(label) // 保留分類名稱（可選）
    setSelectedCategory(label) // 顯示選中的分類名稱
  }

  // 插入 YouTube 影片的函數
  const insertVideo = (url) => {
    const videoRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube|youtu|youtube-nocookie)\.(?:com|be)\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/(\S+))/
    const match = url.match(videoRegex)

    if (match && match[1]) {
      const videoId = match[1]
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      const iframe = `<iframe src="${embedUrl}" width="100%" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      setValue(value + iframe) // 添加 iframe 到編輯器內容中
    } else {
      Swal.fire({
        title: '錯誤',
        text: '無效的 YouTube 影片 URL！',
        icon: 'error',
        confirmButtonText: '確定',
      })
    }
  }

  // 圖片上傳
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase()
      const maxSize = 5 * 1024 * 1024 // 5MB = 5120KB

      // 檢查檔案格式是否為 jpg 或 png
      if (fileExtension !== 'jpg' && fileExtension !== 'png') {
        Swal.fire({
          title: '錯誤',
          text: '請選擇 JPG 或 PNG 格式的圖片！',
          icon: 'error',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
        return
      }

      // 檢查檔案大小是否超過 5MB
      if (file.size > maxSize) {
        Swal.fire({
          title: '錯誤',
          text: '圖片大小不能超過 5MB！',
          icon: 'error',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
        setImage(null) // 清除圖片
        setImagePreview('') // 清除圖片預覽
        return
      }

      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 保存文章
  const handleSave = async (e) => {
    e.preventDefault()
    const plainText = value.replace(/<[^>]+>/g, '').trim()

    if (!title || !plainText) {
      Swal.fire({
        title: '錯誤',
        text: '請填寫標題和內容！',
        icon: 'error',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', value)
    formData.append('category', categoryId) // 傳送 categoryId
    if (image) {
      formData.append('cover_img', image)
    }
    console.log(value)

    try {
      const response = await axios.put(
        `http://localhost:3005/api/blog/myblog/edit/${bid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      )

      // 成功彈出提示
      Swal.fire({
        title: '更新成功!',
        text: '您的文章已經成功更新。',
        icon: 'success',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      }).then(() => {
        // 用戶點擊"確定"後跳轉到該文章頁面
        router.push('http://localhost:3000/blog/myblog')
      })
    } catch (error) {
      // 失敗彈出提示
      Swal.fire({
        title: '更新失敗',
        text: '更新文章時發生錯誤，請稍後再試。',
        icon: 'error',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      }).then(() => {
        // 用戶點擊"確定"後跳轉到部落格列表或首頁
        router.push('http://localhost:3000/blog/myblog')
      })
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSave} encType="multipart/form-data">
        {/* 標題輸入框 */}
        <input
          type="text"
          placeholder="標題"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 編輯器 */}
        <div className={styles.editor}>
          <ReactQuill
            className={styles.textArea}
            theme="bubble"
            value={value}
            onChange={setValue}
            placeholder="開始創作你的部落格……"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['video'],
                [{ align: [] }],
                [
                  {
                    color: [
                      'rgb(254, 251, 246)',
                      'rgb(210, 180, 140)',
                      'rgb(220, 170, 120)',
                      'rgb(166, 142, 111)',
                      'rgb(113, 102, 87)',
                      'rgb(85, 65, 53)',
                      'rgb(41, 37, 31)',
                    ],
                  },
                ],
                [
                  {
                    background: [
                      'rgb(205, 198, 195)',
                      'rgb(190, 150, 130)',
                      'rgb(220, 170, 140)',
                      'rgb(212, 178, 167)',
                      'rgb(240, 220, 200)',
                      'rgb(255, 240, 210)',
                      'rgba(0, 0, 0, 0)',
                    ],
                  },
                ],
                ['clean'],
              ],
            }}
          />
        </div>

        <div className={styles.formGroup}>
          {/* 分類選擇（下拉按鈕） */}
          <div className={`dropdown ${styles.categoryDropdown}`}>
            <label htmlFor="category">
              <span>*</span>分類
            </label>
            <button
              className={`btn dropdown-toggle ${styles.categoryButton}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedCategory}
            </button>
            <ul className={`dropdown-menu ${styles.dropdownMenu}`}>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`dropdown-item ${styles.dropdownItem}`}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(category.id, category.label)
                    }
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 圖片上傳區域 */}
          <div
            className={styles.imageUploadSection}
            onDrop={(e) => handleDrop(e)} // 處理拖放
            onDragOver={(e) => handleDragOver(e)} // 防止拖拽文件時的默認行為
          >
            <label htmlFor="image">
              <span>*</span>封面
            </label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                ref={imageInputRef}
              />
              <div
                onClick={() => imageInputRef.current.click()}
                className={styles.uploadArea}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="預覽" />
                ) : (
                  <span>
                    <FaImage size={24} />
                    <br />
                    點擊或拖曳上傳圖片
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 保存按鈕 */}
          <button type="submit" className={styles.publish}>
            保存
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit
