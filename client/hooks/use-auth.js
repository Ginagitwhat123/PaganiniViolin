import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { checkAuth, getFavs, getCourseFavs } from '@/services/user'

const AuthContext = createContext(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }) {
  const router = useRouter()
  const MySwal = withReactContent(Swal)

  const [auth, setAuth] = useState({
    isAuth: false,
    userData: {
      id: 0,
      member_name: '',
      email: '',
      account: '',
      phone: '',
      birthdate: '',
      address: '',
      gender: ''
    },
    cartCount: 0,
  })

  const [favorites, setFavorites] = useState([])
  const [courseFavorites, setCourseFavorites] = useState([])

  // 取得商品收藏
  const handleGetFavorites = async () => {
    try {
      const res = await getFavs()
      const favs = Array.isArray(res.data.data?.favorites)
        ? res.data.data.favorites
        : []
      setFavorites(favs)
    } catch (error) {
      console.error('取得商品收藏失敗:', error)
    }
  }

  // 取得課程收藏
  const handleGetCourseFavorites = async () => {
    try {
      const res = await getCourseFavs()
      const favs = Array.isArray(res.data.data?.favorites)
        ? res.data.data.favorites
        : []
      setCourseFavorites(favs)
    } catch (error) {
      console.error('取得課程收藏失敗:', error)
    }
  }

  useEffect(() => {
    if (auth.isAuth) {
      handleGetFavorites()
      handleGetCourseFavorites()
    } else {
      setFavorites([])
      setCourseFavorites([])
    }
  }, [auth.isAuth])

  const notify = (
    icon = 'success',
    title,
    msg,
    btnTxt = 'OK',
    callback = () => {}
  ) => {
    MySwal.fire({
      icon: icon,
      title: title,
      text: msg,
      showConfirmButton: true,
      confirmButtonText: btnTxt,
      showCancelButton: true,
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    })
  }

  const getMember = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const resData = await res.json()
    return resData.status === 'success' ? resData.data : {}
  }

  const register = async (user) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(user),
    })
    const resData = await res.json()
    if (resData.status === 'success') {
      notify(
        'success',
        '歡迎',
        '你已註冊成功，現在要進行登入嗎？',
        '進行登入',
        () => router.push('/member/login')
      )
    } else {
      notify('error', '失敗', resData.message)
    }
  }

  const update = async (user) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(user),
    })
    const resData = await res.json()
    if (resData.status === 'success') {
      notify('success', '更新完成', '已更新完成')
    } else {
      notify('error', '失敗', resData.message)
    }
  }

  const login = async (account, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ account, password }),
    })
    const resData = await res.json()

    if (resData.status === 'success') {
      const { cartCount } = resData.data
      const member = await getMember()

      if (member && member.user && member.user.id) {
        setAuth({
          isAuth: true,
          userData: {
            id: member.user.id,
            account: member.user.account,
            member_name: member.user.member_name,
            email: member.user.email,
            phone: member.user.phone,
            birthdate: member.user.birthdate,
            address: member.user.address,
            gender: member.user.gender || '',
          },
          cartCount: Number(member.cartCount) || Number(cartCount) || 0,
        })

        Swal.fire({
          icon: 'success',
          title: '登入成功',
          text: '歡迎回來！',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        }).then(() => router.push('/member-center'))

        startAutoRefresh()
      } else {
        Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: '帳號或密碼錯誤',
          confirmButtonText: '確定',
          customClass: {
            title: 'swal2-custom-title',
            htmlContainer: 'swal2-custom-text',
            confirmButton: 'swal2-custom-confirm-button',
          },
        })
      }
    }else {
      // 🚨 新增這段處理後端回傳錯誤訊息
      Swal.fire({
        icon: 'error',
        title: '登入失敗',
        text: resData.message || '帳號或密碼錯誤',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const resData = await res.json()

    if (resData.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: '成功登出!',
        text: '您已成功登出系統。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      }).then(() => {
        setAuth({
          isAuth: false,
          userData: {
            id: 0,
            member_name: '',
            email: '',
            account: '',
            phone: '',
            birthdate: '',
            address: '',
            gender: ''
          },
          cartCount: 0,
        })
        stopAutoRefresh()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: '登出失敗!',
        text: '請稍後再試。',
        confirmButtonText: '確定',
        customClass: {
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-text',
          confirmButton: 'swal2-custom-confirm-button',
        },
      })
    }
  }

  const refreshSession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/refresh-token`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const resData = await res.json()
      if (resData.status !== 'success') console.warn('Token 刷新失敗')
    } catch (error) {
      console.error('刷新 Token 失敗:', error)
    }
  }

  let refreshInterval

  const startAutoRefresh = () => {
    stopAutoRefresh()
    refreshInterval = setInterval(() => {
      refreshSession()
    }, 30 * 60 * 1000)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval)
  }

  const loginRoute = '/cs-1018/member/login-form'
  const protectedRoutes = ['/cs-1018/member/profile', '/dashboard/order']

  const checkState = async () => {
    try {
      const memberData = await getMember()
      if (memberData && memberData.user && memberData.user.id) {
        setAuth({
          isAuth: true,
          userData: {
            id: memberData.user.id,
            account: memberData.user.account,
            member_name: memberData.user.member_name,
            email: memberData.user.email,
            phone: memberData.user.phone,
            birthdate: memberData.user.birthdate,
            address: memberData.user.address,
            gender: memberData.user.gender || '',
          },
          cartCount: Number(memberData.cartCount) || 0,
        })
        startAutoRefresh()
      } else if (protectedRoutes.includes(router.pathname)) {
        setTimeout(() => {
          alert('無進入權限，請先登入!')
          router.push(loginRoute)
        }, 1500)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (router.isReady) checkState()
    return () => stopAutoRefresh()
  }, [router.isReady])

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        getMember,
        login,
        logout,
        notify,
        register,
        update,
        refreshSession,
        favorites,
        setFavorites,
        courseFavorites,
        setCourseFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
