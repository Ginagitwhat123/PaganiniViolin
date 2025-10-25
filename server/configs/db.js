import { Sequelize } from 'sequelize'

// 建立 Sequelize 連線
const sequelize = new Sequelize(
    process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: false,
    pool: {
    max: 5, 
    min: 0, 
    idle: 10000, 
    acquire: 20000, 
    },
    define: {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
    retry: {
    max: 3, // 如果查詢超時自動重試 3 次
  },
  }
)

// ====== 自動重試連線機制 ======
async function connectWithRetry(retries = 5) {
  while (retries > 0) {
    try {
      await sequelize.authenticate()
      console.log('成功連線至 PostgreSQL'.bgGreen)
      return
    } catch (err) {
      retries--
      console.error(`⚠️ 資料庫連線失敗，剩餘重試次數：${retries}`.bgRed)
      console.error(err.message)
      if (retries === 0) {
        console.error('❌ 已達最大重試次數，放棄連線。'.bgRed)
        process.exit(1)  
      } else {
        // 等待 3 秒再嘗試
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }
  }
}

// 啟動時嘗試連線
connectWithRetry()

// 輸出模組
export default sequelize
