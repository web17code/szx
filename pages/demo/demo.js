// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.onSocketOpen(function(res){
      console.log('ws链接打开')
      console.log(res)
      that.data.logArr.push("WebSocket连接已打开！")
      that.setData({
        logArr:that.data.logArr
      })
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
  wxbuildWS:function(){
    wx.connectSocket({
      url: getApp().globalData.cfg.cfg.ws_ip + '/ows8A0SP_g02ZifL2EKIH6u5fCcs'  + '/invite',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: "POST"
    })
  },
  htmlbuildWS:function(){
    this.data.logArr.push("8795")
    this.setData({
      logArr: this.data.logArr
    })
  },
  clearLog:function(){
    this.setData({
      logArr:[]
    })
  }
})