import { Sequelize } from 'sequelize'
import 'dotenv/config.js'

// 資料庫連結資訊
// 建立 Sequelize 連線
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Supabase 預設需要這個
    },
  },
  logging: false,
  define: {
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
})

// 啟動時測試連線
sequelize
  .authenticate()
  .then(() => {
    console.log('INFO - 已連線至 PostgreSQL'.bgGreen)
  })
  .catch((error) => {
    console.log(
      'ERROR - 無法連線至資料庫 Unable to connect to the database.'.bgRed
    )
    console.error(error)
  })

// 輸出模組
export default sequelize
