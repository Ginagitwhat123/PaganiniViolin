import express from 'express'
const router = express.Router()

// 資料庫使用，使用原本的 mysql2 + sql
import sequelize from '#configs/db.js'

import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// GET - 得到單筆資料(注意，有動態參數時要寫在 GET 區段最後面)
router.get('/', authenticate, async function (req, res) {
  const id = req.user.id

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  const rows = await sequelize.query('SELECT * FROM users WHERE id = :id', {
    replacements: { id },
    type: sequelize.QueryTypes.SELECT,
  })

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '沒有找到會員資料' })
  }

  const user = rows[0]
  delete user.password
  // 取得購物車數量
  const [cartResult] = await sequelize.query(
    `
    SELECT COALESCE(SUM(quantity),0)::int AS cartcount
    FROM cart
    WHERE user_id = :user_id AND checked = 1
    `,
    {
      replacements: { user_id: id },
      type: sequelize.QueryTypes.SELECT,
    }
  )

  const cartCount = cartResult?.cartcount ?? 0
  return res.json({ status: 'success', data: { user, cartCount } })
})

router.get('/:id', authenticate, async function (req, res) {
  const id = Number(req.params.id)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (!id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const rows = await sequelize.query('SELECT * FROM users WHERE id = :id', {
    replacements: { id },
    type: sequelize.QueryTypes.SELECT,
  })

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '沒有找到會員資料' })
  }

  const user = rows[0]
  // 確保 gender 欄位存在，並提供一個默認值
  if (!user.gender) {
    user.gender = '未指定'; // 或根據需求設置默認值
  }

  // 不回傳密碼
  delete user.password
  return res.json({ status: 'success', data: { user } })
})

// 會員註冊
router.post('/', async (req, res, next) => {
  console.log(req.body)

  const newUser = req.body

  // 檢查是否有重覆的 email 或 account
  const rows = await sequelize.query(
    'SELECT * FROM users WHERE email = :email OR account = :account',
    {
      replacements: { email: newUser.email, account: newUser.account },
      type: sequelize.QueryTypes.SELECT,
    }
  )

  if (rows.length > 0) {
    return res.json({ status: 'error', message: '有重覆的 email 或帳號' })
  }

  // 直接使用明文密碼
  const result = await sequelize.query(
    `INSERT INTO users
      (member_name, account, password, email, gender, phone, birthdate, address)
     VALUES (:member_name, :account, :password, :email, :gender, :phone, :birthdate, :address)
     RETURNING id`,
    {
      replacements: {
        member_name: newUser.member_name,
        account: newUser.account,
        password: newUser.password, 
        email: newUser.email,
        gender: newUser.gender,
        phone: newUser.phone,
        birthdate: newUser.birthdate,
        address: newUser.address,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  )

    // 註冊成功後自動分配兩張新會員優惠券(目前狀態一直呈現4，已過期)
    const userId = result[0].id
    if (!userId) { 
      return res.json({ status: 'error', message: '新增到資料庫失敗' })
    }

    const couponIds = [32, 33]
    const claimedAt = new Date()

    for (const couponId of couponIds) {
      await sequelize.query(
        `INSERT INTO member_coupon
          (user_id, coupon_id, status, claimed_at, expiration_date)
         VALUES (:user_id, :coupon_id, :status, :claimed_at, NOW() + INTERVAL '90 days')`,
        {
          replacements: {
          user_id: userId,
          coupon_id: couponId,
          status: 2,
          claimed_at: claimedAt,
        },
          type: sequelize.QueryTypes.INSERT,
        }
      )
    }

    return res.json({
      status: 'success',
      message: '註冊成功，已自動分配新會員優惠券',
      data: null,
    })
  })

// 登入用
router.post('/login', async (req, res, next) => {
  const loginUser = req.body

  // 1. 先用 account 查詢該會員
  const rows = await sequelize.query(
    'SELECT * FROM users WHERE account = :account',
    {
      replacements: { account: loginUser.account },
      type: sequelize.QueryTypes.SELECT,
    }
  )

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '帳號不存在或大小寫錯誤' })
  }

  const dbUser = rows[0]

  // 使用明文密碼進行比對
  const isValid = loginUser.password === dbUser.password

  if (!isValid) {
    return res.status(401).json({ status: 'error', message: '密碼錯誤' })
  }

  const returnUser = {
    id: dbUser.id,
    account: dbUser.account,
  }

  const [cartResult] = await sequelize.query(
    `
    SELECT
        COALESCE(SUM(quantity), 0)::int AS cartcount
    FROM
        cart
    WHERE
        user_id = :user_id AND checked = 1;
    `,
    {
      replacements: { user_id: dbUser.id },
      type: sequelize.QueryTypes.SELECT,
    }
  )
  
  // Postgres 回傳會是 { cartcount: 3 } 這樣
  const cartCount = cartResult.cartcount ?? 0


  // 產生存取令牌 (access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用 httpOnly cookie 來讓瀏覽器端儲存 access token
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 只有 production 才強制 https
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 天
  })
  return res.json({ status: 'success', message: '登入成功', data: {
      user: returnUser,
      cartCount, 
    } })
})

// 登出用
router.post('/logout', authenticate, (req, res) => {
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

// 更新會員資料
router.put('/update-profile', authenticate, async (req, res, next) => {
  const id = req.user.id
  const updateUser = req.body

  const result = await sequelize.query(
    `UPDATE users
     SET member_name = :member_name,
         email = :email,
         gender = :gender,
         phone = :phone,
         birthdate = :birthdate,
         address = :address
     WHERE id = :id
     RETURNING *`,
    {
      replacements: {
        member_name: updateUser.member_name,
        email: updateUser.email,
        gender: updateUser.gender,
        phone: updateUser.phone,
        birthdate: updateUser.birthdate,
        address: updateUser.address,
        id,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  )

  if (result.length > 0) {
    const updatedUser = result[0]
    return res.json({ status: 'success', data: updatedUser })
  } else {
    return res.json({ status: 'error', message: '更新失敗' })
  }
})

router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { origin, newPassword } = req.body

    // 1. 取得目前的密碼
    const rows = await sequelize.query(
      'SELECT password FROM users WHERE id = :id',
      {
        replacements: { id: req.user.id },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!rows.length || rows[0].password !== origin) {
      return res.status(400).json({ status: 'error', message: '原密碼錯誤' })
    }

    // 2. 更新密碼
    const [result] = await sequelize.query(
      'UPDATE users SET password = :newPassword WHERE id = :id RETURNING id, account',
      {
        replacements: { newPassword, id: req.user.id },
        type: sequelize.QueryTypes.SELECT, 
      }
    )

    if (!result) {
      return res.status(500).json({ status: 'error', message: '密碼更新失敗' })
    }

    return res.json({ status: 'success', message: '密碼修改成功' })
  } catch (error) {
    console.error('修改密碼時發生錯誤:', error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})



export default router
