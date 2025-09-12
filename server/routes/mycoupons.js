import express from 'express'
const router = express.Router()
// 資料庫連線
import sequelize from '#configs/db.js'
// 身分驗證
import authenticate from '#middlewares/authenticate.js'

// GET - 取得會員的優惠券資料
router.get('/', authenticate, async function (req, res) {
  const userId = req.user.id

  try {
    // 更新過期的優惠券狀態為 4
    await sequelize.query(
      `
      UPDATE member_coupon
      SET status = 4
      WHERE (
        expiration_date < CURRENT_DATE 
        OR coupon_id IN (
          SELECT id FROM coupon 
          WHERE end_date < CURRENT_DATE AND end_date IS NOT NULL
        )
      )
      AND status != 4 AND status != 3 AND user_id = :userId
      `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.UPDATE,
      }
    )

    // 查詢會員優惠券
    const memberCouponsRaw = await sequelize.query(
      `
      SELECT
        mc.id AS member_coupon_id,
        mc.coupon_id,
        mc.user_id,
        mc.status,
        mc.claimed_at,
        mc.expiration_date,
        mc.used_at,
        c.sid,
        c.name,
        c.info,
        c.type,
        c.value,
        c.min_price,
        c.max_price,
        c.start_date,
        c.end_date,
        c.object
      FROM member_coupon mc
      JOIN coupon c ON mc.coupon_id = c.id
      WHERE mc.user_id = :userId
      `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    // 將需要的欄位轉成數字
    const memberCoupons = memberCouponsRaw.map(c => ({
      ...c,
      status: Number(c.status),
      type: Number(c.type),
      value: Number(c.value),
      min_price: Number(c.min_price),
      max_price: Number(c.max_price),
    }))

    return res.json({ status: 'success', data: memberCoupons })
  } catch (error) {
    console.error('無法取得資料:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '無法取得會員優惠券資料' })
  }
})

// POST - 新增會員的優惠券資料
router.post('/', authenticate, async function (req, res) {
  try {
    const userId = req.user.id
    const { couponId } = req.body

    if (!userId || !couponId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少會員ID或優惠券ID' })
    }

    // 檢查會員是否已經擁有該優惠券
    const existingCoupons = await sequelize.query(
      `
      SELECT * FROM member_coupon WHERE user_id = :userId AND coupon_id = :couponId
      `,
      {
        replacements: { userId, couponId },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (existingCoupons.length > 0) {
      return res
        .status(400)
        .json({ status: 'error', message: '您已經領取過此優惠券' })
    }

    const status = 2 // 已領取
    const claimedAt = new Date()

    // 新增會員優惠券
    await sequelize.query(
      `
      INSERT INTO member_coupon (user_id, coupon_id, status, claimed_at) 
      VALUES (:userId, :couponId, :status, :claimedAt)
      `,
      {
        replacements: { userId, couponId, status, claimedAt },
        type: sequelize.QueryTypes.INSERT,
      }
    )

    return res.json({ status: 'success', message: '優惠券已成功領取' })
  } catch (error) {
    console.error('無法新增會員優惠券資料:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '無法新增會員優惠券資料' })
  }
})

// POST - 搜尋優惠券代碼
router.post('/search', authenticate, async function (req, res) {
  try {
    const userId = req.user.id
    const { code } = req.body

    if (!code || !userId) {
      return res
        .status(400)
        .json({ status: 'error', message: '缺少優惠券代碼或取得用戶ID資訊' })
    }

    // 檢查優惠券是否存在
    const couponRaw = await sequelize.query(
      `SELECT * FROM coupon WHERE sid = :code`,
      {
        replacements: { code },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (couponRaw.length === 0) {
      return res.status(404).json({ status: 'error', message: '優惠券不存在' })
    }

    const coupon = {
      ...couponRaw[0],
      type: Number(couponRaw[0].type),
      value: Number(couponRaw[0].value),
      min_price: Number(couponRaw[0].min_price),
      max_price: Number(couponRaw[0].max_price),
    }

    // 檢查會員是否已經擁有該優惠券
    const existingCoupons = await sequelize.query(
      `
      SELECT * FROM member_coupon WHERE user_id = :userId AND coupon_id = :couponId
      `,
      {
        replacements: { userId, couponId: coupon.id },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (existingCoupons.length > 0) {
      return res
        .status(400)
        .json({ status: 'duplicate', message: '您已經領取過此優惠券' })
    }

    // 新增會員優惠券
    await sequelize.query(
      `
      INSERT INTO member_coupon (user_id, coupon_id, status, claimed_at)
      VALUES (:userId, :couponId, 2, NOW())
      `,
      {
        replacements: { userId, couponId: coupon.id },
        type: sequelize.QueryTypes.INSERT,
      }
    )

    return res.status(200).json({ status: 'success', message: '領取成功', coupon })
  } catch (error) {
    console.error('搜尋優惠券代碼失敗:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '搜尋優惠券代碼失敗' })
  }
})

export default router
