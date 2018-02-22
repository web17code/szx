// pages/ranks/ranks.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showright:false,
    cfg: app.globalData.cfg,
    hitRateArr:[],
    totalSArr:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求数据
    wx.request({//正确率
      url: getApp().globalData.cfg.cfg.http_ip +"/match/getUserRank",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          hitRateArr: res.data
        })
      }
    })
    wx.request({//总分排行
      url: getApp().globalData.cfg.cfg.http_ip + "/match/getScoreRank",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData({
          totalSArr:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goright:function(){
    this.setData({
      showright:true
    })
  },
  goleft:function(){
    this.setData({
      showright: false
    })
  }
})