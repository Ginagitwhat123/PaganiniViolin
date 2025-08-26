export const PORT = 3000
export const DEV = true

// express 的位置
export const apiBaseUrl = 'http://localhost:3005/api'
export const avatarBaseUrl = 'http://localhost:3005/avatar'

// breadcrumb面包屑使用
// 用pathname英文對照中文的名稱(類似關聯陣列的物件)
// 使用方式需用 ex. pathnameLocale['home']
// 下面是防止自動格式化使用註解
/* eslint-disable */
// prettier-ignore
export const pathsLocaleMap = {
  'cart':'購物車',
  'forget-password':'重設密碼',
  'register':'註冊',
  'login':'登入',
  'member':'會員',
  'member-center':'會員中心',
  'news':'新聞',
  'about': '關於我們',
  'product': '產品列表',
  'men': '男性',
  'women': '女性',
  'category': '分類',
  'mobile': '手機',
  'pc': '電腦',
  'student': '學生資料',
  'com-test':'元件測試',
  'breadcrumb':'麵包屑',
  'home':'首頁',
  'posts':'張貼文章',
  'test':'測試',
  'user':'會員',
  'blog':'部落格',
  'coupon':'優惠券專區',
  'shop':'門市據點',
  'myblog':'我的部落格',
  'mylike':'我的收藏',
  'write':'發布文章',
  'profile':'會員基本資訊',
  'orders':'訂單查詢',
  'comments':'我的評價',
  'likes':'收藏列表',
  'mycoupons':'我的優惠券',
  'complete':'訂單完成',
  'details':'配送/付款',
  'course':'課程',
  'myorders':'訂單查詢',
  'edit':'編輯',
}


/* eslint-enable */
