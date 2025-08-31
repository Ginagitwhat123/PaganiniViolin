import React, { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './write.module.scss'
import { FaImage } from 'react-icons/fa6'
import { useAuth } from '@/hooks/use-auth'
import Swal from 'sweetalert2' // 引入 SweetAlert2

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.bubble.css'

const Write = () => {
  const { auth } = useAuth()
  const userID = auth.userData.ID
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('請選擇分類')
  const imageInputRef = useRef(null)

  const modules = {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png']
      const maxSize = 5 * 1024 * 1024 // 5MB

      // Check if the file type is valid
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: '錯誤',
          text: '請上傳 JPG 或 PNG 格式的圖片！',
          icon: 'error',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
        setImage(null)
        setImagePreview('')
        return
      }

      // Check if the file size exceeds 5MB
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
        setImage(null)
        setImagePreview('')
        return
      }

      // If the file is valid, set the image and preview
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png']
      const maxSize = 5 * 1024 * 1024 // 5MB

      // Check if the file type is valid
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: '錯誤',
          text: '請上傳 JPG 或 PNG 格式的圖片！',
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

      // Check if the file size exceeds 5MB
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
        setImage(null)
        setImagePreview('')
        return
      }

      // If the file is valid, set the image and preview
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleCategoryChange = (categoryId, label) => {
    setCategory(categoryId)
    setSelectedCategory(label)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Debug: log form data
    console.log({
      title,
      category,
      value,
      image,
      userID,
    })

    const plainText = value.replace(/<[^>]+>/g, '').trim()
    // Check if the necessary data is present
    if (!title || !category || !plainText || !image) {
      Swal.fire({
        title: '錯誤',
        text: '請填寫標題、分類、內容和上傳封面圖片！',
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

    // Prepare the FormData object
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', value)
    formData.append('category', category)
    formData.append('user_id', userID)
    formData.append('cover_img', image)
    formData.append('created_at', new Date().toISOString())

    console.log(title, category, value, image, userID, new Date().toISOString())

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/write`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure that cookies/session data are included
      })

      // Handle server response
      if (response.ok) {
        const result = await response.json()
        Swal.fire({
          title: '成功',
          text: '文章發布成功！',
          icon: 'success',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })

        // Reset form fields after successful submission
        setTitle('')
        setValue('')
        setCategory('')
        setSelectedCategory('請選擇分類')
        setImage(null)
        setImagePreview('')
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        Swal.fire({
          title: '錯誤',
          text: error.message || '發布失敗，請稍後再試',
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
      console.error('發布錯誤:', error)
      Swal.fire({
        title: '錯誤',
        text: '發布失敗，請稍後再試',
        icon: 'error',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="標題"
          className={styles.input}
          required
        />

        <div className={styles.editor}>
          <ReactQuill
            className={styles.textArea}
            theme="bubble"
            value={value}
            onChange={setValue}
            placeholder="開始創作你的部落格(輸入文字後，選取即可編輯樣式)..."
            modules={modules}
          />
        </div>

        <div className={styles.formGroup}>
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
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('1', '教學')}
                >
                  教學
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('2', '保養')}
                >
                  保養
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('3', '選購指南')}
                >
                  選購指南
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('4', '小百科')}
                >
                  小百科
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('5', '檢定考試')}
                >
                  檢定考試
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`dropdown-item ${styles.dropdownItem}`}
                  onClick={() => handleCategoryChange('6', '學習經驗分享')}
                >
                  學習經驗分享
                </button>
              </li>
            </ul>
          </div>

          <div
            className={styles.imageUploadSection}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <label htmlFor="image">
              <span>*</span>封面
            </label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                ref={imageInputRef}
                accept="image/*"
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

          <button type="submit" className={styles.publish}>
            發布
          </button>
        </div>
      </form>
    </div>
  )
}

export default Write
