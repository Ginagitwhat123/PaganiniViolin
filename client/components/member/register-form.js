import { useState } from 'react'
import styles from './register.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faLock,
  faCakeCandles,
  faEnvelope,
  faVenusMars,
  faPhone,
  faMapLocation,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/use-auth'
import { Modal, Button } from 'react-bootstrap'

export default function RegisterForm() {
  const { register } = useAuth()

  const [user, setUser] = useState({
    member_name: '',
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
    phone: '',
    address: '',
    agree: false,
  })

  const [errors, setErrors] = useState({
    member_name: '',
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
    phone: '',
    address: '',
    agree: '',
  })

  // 用於控制 Modal 的狀態
  const [showTerms, setShowTerms] = useState(false)

  const handleFieldChange = (e) => {
    const { name, value, checked, type } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const checkError = () => {
    const newErrors = {
      member_name: '',
      email: '',
      account: '',
      password: '',
      confirmPassword: '',
      gender: '',
      birthdate: '',
      phone: '',
      address: '',
      agree: '',
    }

    if (!user.member_name) newErrors.member_name = '姓名為必填'
    if (!user.email) newErrors.email = 'Email為必填'
    if (!user.account) newErrors.account = '帳號為必填'
    if (!user.gender) newErrors.gender = '請選擇性別'
    if (!user.agree) newErrors.agree = '請先同意會員註冊條款'
    if (!user.phone) newErrors.phone = '電話為必填'

    if (user.password !== user.confirmPassword) {
      newErrors.password = '密碼與確認密碼需要相同'
      newErrors.confirmPassword = '密碼與確認密碼需要相同'
    }

    if (user.password.length < 6) newErrors.password = '密碼長度不能小於6'
    if (!user.password) newErrors.password = '密碼為必填'
    if (!user.confirmPassword) newErrors.confirmPassword = '確認密碼為必填'

    return { newErrors, hasErrors: Object.values(newErrors).some((v) => v) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { newErrors, hasErrors } = checkError()
    setErrors(newErrors)
    if (hasErrors) return

    const { confirmPassword, agree, ...newUser } = user
    await register(newUser)
  }

  return (
    <div className={`${styles.wrapper}`}>
      <div className={`container-lg ${styles.registerContainer} p-0 pb-5`}>
        <div className={styles.headerImage}>
          <img
            src="/homepage/PAGANINI.png"
            alt="overlay"
            className="opacity-50"
          />
        </div>

        <h3 className="fontDarkBrown d-block text-center mt-3 mb-4">註冊</h3>
        <div className="row px-5">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="row ">
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                      type="text"
                      name="member_name"
                      className={`form-control ${styles.formControl}`}
                      placeholder="會員姓名"
                      value={user.member_name}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">
                      {errors.member_name}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faCakeCandles} />
                    </span>
                    <input
                      type="date"
                      name="birthdate"
                      className={`form-control ${styles.formControl}`}
                      placeholder="會員生日"
                      value={user.birthdate}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row ">
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${styles.formControl}`}
                      placeholder="電子郵件"
                      value={user.email}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">{errors.email}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faVenusMars} />
                    </span>
                    <select
                      name="gender"
                      className={`form-control ${styles.formControl}`}
                      value={user.gender}
                      onChange={handleFieldChange}
                    >
                      <option value="">選擇性別</option>
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                    </select>
                    <span className="error mt-3 me-3">{errors.gender}</span>
                  </div>
                </div>
              </div>

              <div className="row ">
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                      type="text"
                      name="account"
                      className={`form-control ${styles.formControl}`}
                      placeholder="會員帳號"
                      value={user.account}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">{errors.account}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${styles.formControl}`}
                      placeholder="聯絡電話"
                      value={user.phone}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">{errors.phone}</span>
                  </div>
                </div>
              </div>

              <div className="row ">
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${styles.formControl}`}
                      placeholder="輸入密碼"
                      value={user.password}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">{errors.password}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`input-group ${styles.customInputGroup}`}>
                    <span
                      className={`input-group-text ${styles.inputGroupText}`}
                    >
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`form-control ${styles.formControl}`}
                      placeholder="確認密碼"
                      value={user.confirmPassword}
                      onChange={handleFieldChange}
                    />
                    <span className="error mt-3 me-3">
                      {errors.confirmPassword}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className={`input-group ${styles.customInputGroup}`}>
                  <span className={`input-group-text ${styles.inputGroupText}`}>
                    <FontAwesomeIcon icon={faMapLocation} />
                  </span>
                  <input
                    type="text"
                    name="address"
                    className={`form-control ${styles.formControl}`}
                    placeholder="會員寄送地址"
                    value={user.address}
                    onChange={handleFieldChange}
                  />
                  <span className="error">{errors.address}</span>
                </div>
              </div>

              <div className="form-check d-flex justify-content-center mb-4">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  name="agree"
                  checked={user.agree}
                  onChange={handleFieldChange}
                />
                <label className="form-check-label" htmlFor="termsCheck">
                  我已閱讀並同意{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowTerms(true) // 打開條款 Modal
                    }}
                  >
                    會員條款
                  </a>
                </label>
                <span className="error ms-3 mt-1">{errors.agree}</span>
              </div>

              <button type="submit" className={`btn ${styles.submitButton}`}>
                註冊
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* 會員條款 Modal */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>會員條款</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <br></br>1. 會員資格 會員需年滿 18
            歲並提供真實、完整的個人資料註冊成為會員。
            <br></br>2. 會員責任
            會員需妥善保管帳號密碼，若因個人疏忽導致帳號遭盜用，本公司不負責任何損失。
            <br></br>3. 隱私保護
            會員資料僅供服務之用，本公司承諾不會將會員個人資料外洩給第三方，除非法律要求。
            <br></br>4. 禁止行為
            會員不得以本網站從事任何非法或有害他人權益之行為。
            <br></br>5. 交易條款
            會員在購物時，需仔細確認商品資訊及交易條件，一旦確認訂單即視為同意相關條款。
            <br></br>6. 退貨規範
            會員享有收到商品七日內無條件退貨的權利，但商品需保持全新狀態且不得損壞包裝。
            <br></br>7. 活動參與
            會員需遵守本公司舉辦活動的規定與指引，不得舞弊或提供虛假資訊。
            <br></br>8. 積分規則
            會員購物可累積積分，積分僅限於本公司指定用途，不得轉讓或折現。
            <br></br>9. 會員權益
            會員可享有特定優惠及專屬服務，詳細內容以官網公告為準。
            <br></br>10. 帳戶中止
            若會員違反本條款或相關法規，本公司有權中止或終止其會員資格。
            <br></br>11. 系統維護
            本公司有權在不事先通知的情況下對系統進行維護，會員服務可能暫時中斷。
            <br></br>12. 會員通知
            本公司會透過電子郵件或簡訊向會員發送通知，會員需確保聯絡資訊正確。
            <br></br>13. 付款安全
            本公司使用第三方支付平台提供安全交易環境，會員需自行確認付款資訊。
            <br></br>14. 商品責任
            本公司對於已售出之商品僅負責法律規定範圍內的瑕疵責任。
            <br></br>15. 爭議解決
            若會員與本公司間有爭議，雙方應本著誠信原則協商解決，未果可依法律途徑解決。
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="text-white"
            variant="secondary"
            onClick={() => setShowTerms(false)}
          >
            關閉
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>
        {`
          .error {
            color: red;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  )
}
