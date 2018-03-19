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
  formSubmit: function (e) {
    // 获取表单id
    var formId = e.detail.formId;
    // 非真机运行时 formId 应该为 the formId is a mock one
    console.log(e)
    console.log(formId);
    this.setData({
      formId: formId,
      openId: getApp().globalData.userID
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})