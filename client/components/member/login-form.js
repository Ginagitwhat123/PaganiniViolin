import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import styles from './member.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'


export default function LoginForm() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const { auth, login, logout} = useAuth()
  const router = useRouter()


  // 登入處理
  const handleLogin = async () => {
    const success = await login(account, password);
    
    if (success) {
      router.push('/'); // 導向到首頁或其他頁面
    } else {
      // alert('登入失敗，請檢查帳號或密碼');
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.loginContainer}>
          <div className="row h-100 m-0">
            <div
              className={`col-md-4 d-flex align-items-center justify-content-center ${styles.backgroundContainer} px-4`}
            >
              <div className="formSection d-flex flex-column align-items-center justify-content-center">
                <h3 className={`fontDarkBrown mb-3`}>
                  {auth.isAuth ? '已登入' : '登入'}
                </h3>
                {auth.isAuth ? (
                  <>
                    <button onClick={logout} className={styles.loginButton}>
                      登出
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <FontAwesomeIcon
                        icon={faUser}
                        className={styles.faIcon}
                      />
                      <input
                        type="text"
                        placeholder="輸入帳號"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <FontAwesomeIcon
                        icon={faLock}
                        className={styles.faIcon}
                      />
                      <input
                        type="password"
                        placeholder="輸入密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className={`${styles.forgotPassword} `}>
                      {/* <Link href="/member/forget-password">忘記密碼？</Link> */}
                    </div>
                    <button
                      onClick={handleLogin}
                      className={`${styles.loginButton}`}
                    >
                      登入
                    </button>
                    {/* 插入 Google 登入按鈕 */}
                    <button className={`${styles.registerButton} mb-2`}>
                      <Link
                        className={styles.registerBtnStyle}
                        href="/member/register"
                      >
                        註冊
                      </Link>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-8 d-none d-md-block p-0">
              <div className={styles.imageSection}>
                <div className={styles.loginFont}>
                  <Image
                    src="/homepage/PAGANINI.png"
                    alt="Paganini"
                    width={461}
                    height={80}
                  />
                </div>
                <div className={styles.logoOverlay}>
                  <img src="/homepage/LightBoldLogo.svg" alt="Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
