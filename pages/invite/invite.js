// pages/invite.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cfg: getApp().globalData.cfg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //于此同时，把几年级放到app.global中一份
    switch (options.isActive){
      case "1": this.setData({ type: "一年级", roomId: options.roomId }); getApp().globalData.type = "一年级"; break;
      case "2": this.setData({ type: "二年级", roomId: options.roomId }); getApp().globalData.type = "二年级"; break;
      case "3": this.setData({ type: "三年级", roomId: options.roomId }); getApp().globalData.type = "三年级"; break;
      case "4": this.setData({ type: "四年级", roomId: options.roomId }); getApp().globalData.type = "四年级"; break;
      case "5": this.setData({ type: "五年级", roomId: options.roomId }); getApp().globalData.type = "五年级"; break;
      case "6": this.setData({ type: "六年级", roomId: options.roomId }); getApp().globalData.type = "六年级"; break;
    }
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {//对战分享
      // 来自页面内转发按钮
      return {
        title: '骚年！来刷题吧',
        imageUrl: "../../images/sharePIC.jpg",
        path: '/pages/wait-passive/wait-passive?type=' + that.data.type + '&oid=' + getApp().globalData.userID + '&roomId=' + that.data.roomId,
        success: function (res) {// 转发成功
          if(getApp().globalData.userID!=null){
            wx.showToast({
              title: '邀请成功',
              icon: "none",
            })
            setTimeout(function(){
              wx.reLaunch({
                url: '../wait/wait?type=' + that.data.type
              })
            },400)
            // wx.redirectTo({
            //   url: '../wait/wait?type=' + that.data.type,
            // })
            // wx.showToast({
            //   title: 'relauch=',
            //   icon: "none",
            // })
          }else{
            wx.showToast({
              title: '邀请失败',
              icon:"none",
            })
            app.getOid();
          }
        }
      }
    } else {//普通分享
      return {
        title: '骚年！来刷题吧',
        path: '/pages/index/index'
      }
    }
  },
  goIndex:function(){
    // wx.redirectTo({
    //   url: '../index/index?change=change'
    // })
    wx.navigateBack()
  }
})