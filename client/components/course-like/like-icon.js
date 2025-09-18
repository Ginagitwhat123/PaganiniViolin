import { useEffect, useState } from 'react';
import { addCourseFav, removeCourseFav } from '@/services/user';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import styles from '@/components/course-like/like-icon.module.scss';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useAuth } from '@/hooks/use-auth';

export default function LikeIcon({ course_id}) {
    // 由context取得auth-判斷是否能執行add或remove用，favorites決定愛心圖案用
    const { auth, courseFavorites = [], setCourseFavorites } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);


    // 檢查目前課程是否已被收藏
  useEffect(() => {
    if (Array.isArray(courseFavorites)) {
      const isFav = courseFavorites.some((item) => item.course_id === course_id);
      setIsFavorite(isFav);
    }
  }, [courseFavorites, course_id]);

  // 彈窗提醒
  const showLoginAlert = async () => {
    await Swal.fire({
      icon: 'warning',
      title: '請先登入',
      text: '請先登入會員後再點擊收藏。',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        title: 'swal2-custom-title',
        htmlContainer: 'swal2-custom-text',
        confirmButton: 'swal2-custom-confirm-button',
      },
    });
  };

  // 加入收藏
  const handleAddFav = async (cid) => {
    if (!auth.isAuth) {
      await showLoginAlert();
      return;
    }

    try {
      const res = await addCourseFav(cid);
      if (res.data.status === 'success') {
        setCourseFavorites((prev) => [...prev, { course_id: cid }]); // 更新收藏清單
        setIsFavorite(true);
        toast.success('課程已加入收藏!');
      } else {
        toast.error(res.data.message || '加入收藏失敗');
      }
    } catch (error) {
      console.error('加入收藏失敗:', error);
      toast.error('系統錯誤，請稍後再試');
    }
  };

  // 移除收藏
  const handleRemoveFav = async (cid) => {
    if (!auth.isAuth) {
      await showLoginAlert();
      return;
    }

    try {
      const res = await removeCourseFav(cid);
      if (res.data.status === 'success') {
        setCourseFavorites((prev) =>
          prev.filter((item) => item.course_id !== cid)
        ); // 移除收藏
        setIsFavorite(false);
        toast.success('課程已取消收藏!');
      } else {
        toast.error(res.data.message || '取消收藏失敗');
      }
    } catch (error) {
      console.error('取消收藏失敗:', error);
      toast.error('系統錯誤，請稍後再試');
    }
  };

  // 防止事件冒泡
  const handleClick = (event, action) => {
    event.stopPropagation();
    action();
  };
  
    return (
        <>
         {isFavorite ? (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={(event) => handleClick(event, () => handleRemoveFav(course_id))}
          
        >
          <BsHeartFill className={` ${styles.fillHeart}`}/>
        </button>
      ) : (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={(event) => handleClick(event, () => handleAddFav(course_id))}
        >
          <BsHeart className={`${styles.heart}`}/>
        </button>
      )}
        </>
    );
};