import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import tabStyle from './tab.module.scss';
import MemberProfileForm from './member-profile'; // 匯入會員資料表單元件
import PasswordChangeForm from './member-password'; // 匯入修改密碼表單元件
import { useAuth } from '@/hooks/use-auth';

export default function MemberProfile() {
  const { auth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 頁籤狀態
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    if (auth.userData) {
      setMemberData(auth.userData);
    }
  }, [auth.userData]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(memberData),
      });

      const resData = await response.json();

      if (response.ok && resData.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '更新成功',
          text: resData.message,
        });
        toggleEdit();
      } else {
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: resData.message || '更新過程中發生未知錯誤',
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: '請稍後再試',
      });
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'profile') {
      return (
        <MemberProfileForm
          memberData={memberData}
          isEditing={isEditing}
          handleChange={handleChange}
          handleSave={handleSave}
          toggleEdit={toggleEdit}
        />
      );
    } else if (activeTab === 'password') {
      return <PasswordChangeForm />;
    }
  };

  if (!memberData) return <div>資料加載中...</div>;

  return (
    <div className="container">
      <div className={`member-profile`}>
        {/* 頁籤按鈕 */}
        <div className={`${tabStyle.tabButtons}`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${activeTab === 'profile' ? tabStyle.active : ''}`}
          >
            會員資料
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`${activeTab === 'password' ? tabStyle.active : ''}`}
          >
            密碼修改
          </button>
        </div>

        {/* 頁籤內容 */}
        <div className={`${tabStyle.tabContent}`}>{renderTabContent()}</div>
      </div>
    </div>
  );
}
