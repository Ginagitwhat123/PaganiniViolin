import React from 'react'
import useFirebase from '@/hooks/use-firebase'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { googleLogin, getUserById, parseJwt } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import GoogleLogo from '@/components/icons/google-logo'
import { useRouter } from 'next/router' // 新增這行

export default function GoogleLoginButton() {
  const { loginGoogle } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter() // 初始化 useRouter

  // Google 登入的 callback 處理
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log(providerData)

    if (auth.isAuth) return // 已登入狀態不需要再處理

    try {
      const res = await googleLogin(providerData)

      if (res.data.status === 'success') {
        const jwtUser = parseJwt(res.data.data.accessToken)
        //500
        const res1 = await getUserById(jwtUser.id)

        if (res1.data.status === 'success') {
          const dbUser = res1.data.data.user
          const userData = { ...initUserData }

          for (const key in userData) {
            if (Object.hasOwn(dbUser, key)) {
              userData[key] = dbUser[key] || ''
            }
          }

          setAuth({
            isAuth: true,
            userData,
          })

          toast.success('已成功登入')
          router.push('/') // 成功登入後導航到首頁
        } else {
          toast.error('登入後無法得到會員資料')
        }
      } else {
        toast.error('登入失敗')
      }
    } catch (error) {
      console.error('Google 登入失敗:', error)
      toast.error(error.message || 'Google 登入失敗，請稍後再試')
    }
  }

  return (
    <>
      <button
        onClick={() => loginGoogle(callbackGoogleLoginPopup)}
        style={{
          border: 'none', // 移除邊框
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: 'transparent', // Google的藍色
          color: '#716657',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <GoogleLogo style={{ marginRight: '8px' }} /> Google登入
      </button>
      <Toaster />
    </>
  );
  
}
