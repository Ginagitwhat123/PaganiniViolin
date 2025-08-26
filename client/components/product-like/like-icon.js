import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { addFav, removeFav } from '@/services/user';
import Swal from 'sweetalert2'
import toast from 'react-hot-toast';
import styles from '@/components/product-like/like-icon.module.scss'

export default function ProductLikeIcon({ product_id, className}) {
    // 由context取得auth-判斷是否能執行add或remove用，favorites決定愛心圖案用
    const { auth, favorites = [], setFavorites } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (Array.isArray(favorites)) {
          const isFav = favorites.some((item) => item.product_id === product_id); 
          setIsFavorite(isFav);
        }
      }, [favorites, product_id]);

    const handleTriggerFav = (pid) => {
      // 更新收藏狀態
    const updatedFavorites = isFavorite
    ? favorites.filter((item) => item.product_id !== pid)
    : [...favorites, { product_id: pid }];

  setFavorites(updatedFavorites);
  setIsFavorite(!isFavorite);
  };

  const showLoginAlert = async () => {
      await Swal.fire({
          title: '請先登入',
          text: '請先登入會員後再點擊收藏。',
          confirmButtonText: '確定',
          customClass: {
              title: 'swal2-custom-title',
              htmlContainer: 'swal2-custom-text',
              confirmButton: 'swal2-custom-confirm-button',
          },
      });
  };
  
  const handleAddFav = async (pid) => {
      if (!auth.isAuth) {
          await showLoginAlert();
          return;
      }

      try {
          const res = await addFav(pid);
          if (res.data.status === 'success') {
              handleTriggerFav(pid);
              toast.success('商品已加入收藏!');
          } else {
              toast.error(res.data.message || '加入收藏失敗');
          }
      } catch (error) {
          console.error('加入收藏失敗:', error);
          toast.error('系統錯誤，請稍後再試');
      }
  };
  
  const handleRemoveFav = async (pid) => {
      if (!auth.isAuth) {
          await showLoginAlert();
          return;
      }

      try {
          const res = await removeFav(pid);
          if (res.data.status === 'success') {
              handleTriggerFav(pid);
              toast.success('商品已取消收藏!');
          } else {
              toast.error(res.data.message || '取消收藏失敗');
          }
      } catch (error) {
          console.error('取消收藏失敗:', error);
          toast.error('系統錯誤，請稍後再試');
      }
  };


    return (
        <>
         {isFavorite ? (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => handleRemoveFav(product_id)}
        >
          <i className={`bi bi-heart-fill ${className || styles.cardFavoriteIcon}`}></i>
        </button>
      ) : (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => handleAddFav(product_id)}
        >
          <i className={`bi bi-heart ${className || styles.cardFavoriteIcon}`}></i>
        </button>
      )}
        </>
    );
}
