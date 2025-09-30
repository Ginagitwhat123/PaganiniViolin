import express from 'express'
const router = express.Router()

// 資料庫連線
import sequelize from '#configs/db.js'

// GET - 取得所有資料
router.get('/', async function (req, res) {
  const {
    page = 1,
    limit = 9,
    search = '',
    category = '',
    brand = '',
    sort = 'default',
  } = req.query
  const offset = (page - 1) * limit

  const conditions = []
  const replacements = {}

  if (category) {
    conditions.push(`product_category.name = :category`)
    replacements.category = category
  }

  if (brand) {
    conditions.push(`product_brand.name = :brand`)
    replacements.brand = brand
  }

  if (search) {
    conditions.push(`(
      product.product_name ILIKE :search OR 
      product_brand.name ILIKE :search OR 
      product_category.name ILIKE :search
    )`)
    replacements.search = `%${search}%`
  }

  if (req.query.minPrice && !isNaN(parseFloat(req.query.minPrice))) {
    conditions.push(
      `COALESCE(product.discount_price::NUMERIC, product.price::NUMERIC) >= :minPrice`
    )
    replacements.minPrice = parseFloat(req.query.minPrice)
  }
  if (req.query.maxPrice && !isNaN(parseFloat(req.query.maxPrice))) {
    conditions.push(
      `COALESCE(product.discount_price::NUMERIC, product.price::NUMERIC) <= :maxPrice`
    )
    replacements.maxPrice = parseFloat(req.query.maxPrice)
  }

  // 主查詢：用子查詢取得 pictures 與 sizes（避免 join 造成的重複）
  let baseQuery = `
    SELECT
      product.id,
      product.product_name,
      product.price::NUMERIC,
      product.discount_price::NUMERIC,
      product.description,
      product_category.name AS category_name,
      product_brand.name AS brand_name,
      -- correlated subquery for pictures (returns postgres array -> JS array)
      (
        SELECT COALESCE(ARRAY_AGG(pp.picture_url ORDER BY pp.id), ARRAY[]::text[])
        FROM product_picture pp
        WHERE pp.product_id = product.id
      ) AS pictures,
      -- correlated subquery for sizes (string aggregated)
      (
        SELECT COALESCE(STRING_AGG(
          CASE 
            WHEN ps.size IS NOT NULL AND ps.size != '' THEN ps.size || ':' || ps.stock::text
            ELSE ps.stock::text
          END
        , ',' ORDER BY ps.id), '')
        FROM product_size ps
        WHERE ps.product_id = product.id
      ) AS sizes
    FROM product
    JOIN product_brand ON product.brand_id = product_brand.id
    JOIN product_category ON product.category_id = product_category.id
  `

  if (conditions.length > 0) {
    baseQuery += ` WHERE ` + conditions.join(' AND ')
  }

  baseQuery += ` GROUP BY product.id, product.product_name, product.price, product.discount_price, product.description, product_category.name, product_brand.name`

  if (sort === 'priceAsc')
    baseQuery += ` ORDER BY COALESCE(product.discount_price::NUMERIC, product.price::NUMERIC) ASC`
  else if (sort === 'priceDesc')
    baseQuery += ` ORDER BY COALESCE(product.discount_price::NUMERIC, product.price::NUMERIC) DESC`
  else if (sort === 'newest') baseQuery += ` ORDER BY product.id DESC`
  else if (sort === 'oldest') baseQuery += ` ORDER BY product.id ASC`

  baseQuery += ` LIMIT :limit OFFSET :offset`
  replacements.limit = parseInt(limit, 10)
  replacements.offset = parseInt(offset, 10)

  try {
    const [products] = await sequelize.query(baseQuery, { replacements })
    const processedProducts = products.map((product) => ({
      ...product,
      price: parseFloat(product.price) || 0,
      discount_price: product.discount_price
        ? parseFloat(product.discount_price)
        : null,
      pictures: product.pictures || [], // 確保為陣列
      sizes: product.sizes || '',
    }))

    // total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM product
      JOIN product_brand ON product.brand_id = product_brand.id
      JOIN product_category ON product.category_id = product_category.id
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `
    const [totalResult] = await sequelize.query(countQuery, { replacements })
    const total = parseInt(totalResult[0].count, 10)

    const [overallCountResult] = await sequelize.query(
      `SELECT COUNT(DISTINCT product.id) as count FROM product`
    )
    const overallTotal = parseInt(overallCountResult[0].count, 10)

    return res.json({
      status: 'success',
      data: { products: processedProducts, total, overallTotal },
    })
  } catch (error) {
    console.error('無法取得資料:', error)
    return res.status(500).json({ status: 'error', message: '無法取得資料' })
  }
})

// 新增: 取得所有類別和品牌的路由
router.get('/categories-and-brands', async function (req, res) {
  try {
    // 取得所有類別
    const [categories] = await sequelize.query(`
      SELECT DISTINCT 
        product_category.name,
        COUNT(product.id)::INTEGER as count
      FROM product_category
      LEFT JOIN product ON product.category_id = product_category.id
      GROUP BY product_category.name
      ORDER BY product_category.name
    `)

    // 取得所有品牌
    const [brands] = await sequelize.query(`
      SELECT DISTINCT 
        product_brand.name,
        COUNT(product.id)::INTEGER as count
      FROM product_brand
      LEFT JOIN product ON product.brand_id = product_brand.id
      GROUP BY product_brand.name
      ORDER BY product_brand.name
    `)

    // 取得價格範圍，確保返回正確的數字格式
    const [priceRange] = await sequelize.query(`
      SELECT 
        MIN(CASE 
          WHEN product.discount_price IS NOT NULL AND product.discount_price > 0 
          THEN product.discount_price::NUMERIC 
          ELSE product.price::NUMERIC 
        END)::INTEGER as min_price,
        MAX(CASE 
          WHEN product.discount_price IS NOT NULL AND product.discount_price > 0 
          THEN product.discount_price::NUMERIC 
          ELSE product.price::NUMERIC 
        END)::INTEGER as max_price
      FROM product
      WHERE product.price > 0
    `)

    // 確保價格範圍為有效數字
    const processedPriceRange = priceRange[0]
      ? {
          min_price: parseInt(priceRange[0].min_price, 10) || 0,
          max_price: parseInt(priceRange[0].max_price, 10) || 1000000,
        }
      : {
          min_price: 0,
          max_price: 1000000,
        }

    return res.json({
      status: 'success',
      data: {
        categories: categories.map((cat) => ({
          ...cat,
          count: parseInt(cat.count, 10) || 0,
        })),
        brands: brands.map((brand) => ({
          ...brand,
          count: parseInt(brand.count, 10) || 0,
        })),
        priceRange: processedPriceRange,
      },
    })
  } catch (error) {
    console.error('無法取得類別和品牌資料:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '無法取得類別和品牌資料' })
  }
})

// 新增取得推薦商品的路由
router.get('/recommend/:id', async (req, res) => {
  const { id } = req.params
  console.log('進入 recommend route, id =', id)

  try {
    // 先獲取當前商品的類別和品牌
    const [currentProduct] = await sequelize.query(
      `
      SELECT 
        product.category_id,
        product.brand_id
      FROM product
      WHERE product.id = :id
    `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!currentProduct) {
      return res.status(404).json({ status: 'error', message: '找不到商品' })
    }

    // 查詢推薦商品
    const [recommendProducts] = await sequelize.query(
      `
      (
        -- 第一順位：相同類別且相同品牌的商品
        SELECT 
          product.id, 
          product.product_name, 
          product.price::NUMERIC, 
          product.discount_price::NUMERIC,
          product_brand.name AS brand_name,
          STRING_AGG(product_picture.picture_url::text, ',' ORDER BY product_picture.id) AS pictures
        FROM product
        JOIN product_brand ON product.brand_id = product_brand.id
        LEFT JOIN product_picture ON product.id = product_picture.product_id
        WHERE product.category_id = :category_id 
        AND product.brand_id = :brand_id
        AND product.id != :product_id
        GROUP BY product.id, product.product_name, product.price, product.discount_price, product_brand.name
        ORDER BY RANDOM()
        LIMIT 4
      )
      UNION ALL
      (
        -- 第二順位：相同類別的其他品牌商品
        SELECT 
          product.id, 
          product.product_name, 
          product.price::NUMERIC, 
          product.discount_price::NUMERIC,
          product_brand.name AS brand_name,
          STRING_AGG(product_picture.picture_url::text, ',' ORDER BY product_picture.id) AS pictures
        FROM product
        JOIN product_brand ON product.brand_id = product_brand.id
        LEFT JOIN product_picture ON product.id = product_picture.product_id
        WHERE product.category_id = :category_id 
        AND product.brand_id != :brand_id
        AND product.id != :product_id
        GROUP BY product.id, product.product_name, product.price, product.discount_price, product_brand.name
        ORDER BY RANDOM()
      )
      LIMIT 4
    `,
      {
        replacements: {
          category_id: currentProduct.category_id,
          brand_id: currentProduct.brand_id,
          product_id: id,
        },
      }
    )

    // 確保價格為數字格式
    const processedRecommendProducts = recommendProducts.map((product) => ({
      ...product,
      price: parseFloat(product.price) || 0,
      discount_price: product.discount_price
        ? parseFloat(product.discount_price)
        : null,
    }))

    return res.json({ status: 'success', data: processedRecommendProducts })
  } catch (error) {
    console.error('無法取得推薦商品:', error)
    return res
      .status(500)
      .json({ status: 'error', message: '無法取得推薦商品' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const productRows = await sequelize.query(
      `SELECT 
          product.id,
          product.product_name,
          product.price::NUMERIC,
          product.discount_price::NUMERIC,
          product.description,
          product_category.name AS category_name,
          product_brand.name AS brand_name,
          (
            SELECT COALESCE(ARRAY_AGG(pp.picture_url ORDER BY pp.id), ARRAY[]::text[])
            FROM product_picture pp
            WHERE pp.product_id = product.id
          ) AS pictures,
          (
            SELECT COALESCE(STRING_AGG(
              CASE 
                WHEN ps.size IS NOT NULL AND ps.size != '' THEN ps.size || ':' || ps.stock::text
                ELSE ps.stock::text
              END
            , ',' ORDER BY ps.id), '')
            FROM product_size ps
            WHERE ps.product_id = product.id
          ) AS sizes
        FROM product
        JOIN product_brand ON product.brand_id = product_brand.id
        JOIN product_category ON product.category_id = product_category.id
        WHERE product.id = :id;
      `,

      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    )
    console.log('查詢 id =', id, '回傳結果:', productRows)
    const product = productRows.length > 0 ? productRows[0] : null

    if (product) {
      const processedProduct = {
        ...product,
        price: parseFloat(product.price) || 0,
        discount_price: product.discount_price
          ? parseFloat(product.discount_price)
          : null,
        pictures: product.pictures || [], // 確保為陣列
        sizes: product.sizes || '',
      }
      return res.json({ status: 'success', data: processedProduct })
    } else {
      return res.status(404).json({ error: { message: 'Not Found' } })
    }
  } catch (error) {
    console.error('資料庫查詢錯誤:', error)
    return res.status(500).json({ error: { message: 'Server Error' } })
  }
})

export default router
