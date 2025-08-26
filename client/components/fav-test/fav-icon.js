import { useAuth } from '@/hooks/use-auth';
import { addFav, removeFav } from '@/services/user';
import toast from 'react-hot-toast';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

export default function FavIcon({ course_id }) {
  // 由context取得auth-判斷是否能執行add或remove用，favorites決定愛心圖案用
  const { auth, favorites, setFavorites } = useAuth();

  const handleTriggerFav = (cid) => {
    // 在陣列中->移出
    if (favorites.includes(cid)) {
      setFavorites(favorites.filter((v) => v !== cid));
    } else {
      //不在陣列中加入
      setFavorites([...favorites, cid]);
    }
  };

  const handleAddFav = async (cid) => {
    const res = await addFav(cid);

    if (res.data.status === 'success') {
      // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
      handleTriggerFav(cid);
      toast.success(`課程 id=${cid} 新增成功!`);
    }
  };

  const handleRemoveFav = async (cid) => {
    const res = await removeFav(cid);

    if (res.data.status === 'success') {
      // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
      handleTriggerFav(cid);
      toast.success(`課程 id=${cid} 刪除成功!`);
    }
  };

  return (
    <>
      {/* 由favorites狀態決定呈現實心or空心愛愛圖示 */}
      {favorites.includes(course_id) ? (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => {
            // 沒登入不能用
            if (!auth.isAuth) {
              return toast.error('會員才能使用!');
            }

            handleRemoveFav(course_id);
          }}
        >
          <BsHeartFill size={16} color="#716657" />
        </button>
      ) : (
        <button
          style={{ padding: 0, border: 'none', background: 'none' }}
          onClick={() => {
            // 沒登入不能用
            if (!auth.isAuth) {
              return toast.error('會員才能使用!');
            }

            handleAddFav(course_id);
          }}
        >
          <BsHeart size={16} color="#716657" />
        </button>
      )}
    </>
  );
}
