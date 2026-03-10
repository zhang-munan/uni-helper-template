export enum Platform {
  h5 = 'h5', // H5
  wxMinipg = 'wxMinipg', // 微信小程序
  wxPa = 'wxPa', // 微信公众号
  wxToutiao = 'wxToutiao', // 头条/抖音
}

export enum PayType {
  wxPay = 'wxPay', // 微信支付
  wxPaPay = 'wxPaPay', // 微信公众号支付
  ttPay = 'ttPay', // 抖音支付
}

export enum MessageStatus {
  notPay = 10, // 未支付
  waitSend = 15, // 定时中
  review = 20, // 审核中
  sendSuccess = 30, // 已发送
  read = 40, // 已读
  reviewFail = 70, // 审核失败
  sendFail = 80, // 发送失败
  deleted = 90, // 已删除（可恢复）
}
