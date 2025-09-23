import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordValid, setNewPasswordValid] = useState(null); // 新密碼驗證狀態
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null); // 確認密碼驗證狀態

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    setNewPasswordValid(value.length >= 6); // 密碼長度需至少6個字元
    setConfirmPasswordValid(value === confirmPassword); // 即時檢查確認密碼是否與新密碼相符
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordValid(value === newPassword);
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();

    if (!newPasswordValid) {
      Swal.fire({
        icon: 'error',
        title: '新密碼格式錯誤',
        text: '新密碼長度需至少6個字元，請重新輸入。',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      });
      return;
    }

    if (!confirmPasswordValid) {
      Swal.fire({
        icon: 'error',
        title: '密碼不相符',
        text: '新密碼與確認密碼不相符，請重新輸入。',
        customClass: {
          title: 'swal2-custom-title', // 自定義標題樣式
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button', // 自定義按鈕樣式
        },
      });
      return;
    }

    // 更新密碼
    
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
          body: JSON.stringify({
            origin: currentPassword,
            newPassword: newPassword,
          }),
        })
    
        const data = await res.json()
    
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '修改成功',
            text: '您的密碼已更新',
          })
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setNewPasswordValid(null)
          setConfirmPasswordValid(null)
        } else {
          Swal.fire({
            icon: 'error',
            title: '修改失敗',
            text: data.message || '請稍後再試',
          })
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: '伺服器錯誤',
          text: '請稍後再試',
        })
      }
    }

  return (
    <div className="px-lg-5">
      <form onSubmit={handleSaveNewPassword}>
        {/* 當前密碼 */}
        <div className="mb-3 mt-3">
          <label className="form-label" htmlFor='currentPassword'>當前密碼</label>
          <input
            type="password"
            id='currentPassword'
            className="form-control"
            placeholder="請輸入當前密碼"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        {/* 新密碼 */}
        <div className="mb-3">
          <label className="form-label" htmlFor='newPassword'>新密碼</label>
          <input
            type="password"
            id='newPassword'
            className="form-control"
            placeholder="請輸入新密碼"
            value={newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
          />
          {newPasswordValid !== null && (
            <div className="mt-1">
              {newPasswordValid ? (
                <span className="text-success">✔ 新密碼格式正確</span>
              ) : (
                <span className="text-danger">✘ 密碼需至少6個字元</span>
              )}
            </div>
          )}
        </div>

        {/* 確認新密碼 */}
        <div className="mb-3">
          <label className="form-label" htmlFor='confirmPassword'>確認新密碼</label>
          <input
            type="password"
            id='confirmPassword'
            className="form-control"
            placeholder="請再次輸入新密碼"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          />
          {confirmPasswordValid !== null && (
            <div className="mt-1">
              {confirmPasswordValid ? (
                <span className="text-success">✔ 密碼相符</span>
              ) : (
                <span className="text-danger">✘ 密碼不相符</span>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          保存新密碼
        </button>
      </form>
    </div>
  );
}
