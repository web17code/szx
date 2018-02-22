// pages/wait/wait.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    cfg: app.globalData.cfg,
    isReady: false,
    type: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    this.setData({
      type: options.type
    })
    console.log(app.globalData.userInfo)
    //获取自己头像、名称
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      //app中没有则获取用户信息
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
    /*暂时测试ws-start */
    wx.connectSocket({
      url: getApp().globalData.cfg.cfg.ws_ip + '/' + getApp().globalData.userID + '/invite',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: "POST"
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      console.log(res)
    })
    wx.onSocketMessage(function (res) {
      var userData = JSON.parse(res.data);
      console.log(userData)
      if (userData.code == "4002") {//准备就绪
        console.log("4002了")
        that.setData({
          userData: userData,
          isReady: true
        })
      } else if (userData.code == "4006") {//开始对战
        if (!that.data.userData.uidA){
          that.data.userData.uidA = ""
        }
        if (!that.data.userData.uidB) {
          that.data.userData.uidB = ""
        }
        if (!that.data.userData.photoA) {
          that.data.userData.photoA = ""
        }
        if (!that.data.userData.photoB) {
          that.data.userData.photoB = ""
        }
        wx.redirectTo({
          url: '../PK/PK?type=' + that.data.type + '&inviteA=' + that.data.userData.oidA
          + '&inviteB=' + that.data.userData.oidB
          + '&uidA=' + that.data.userData.uidA
          + '&uidB=' + that.data.userData.uidB
          + '&photoA=' + that.data.userData.photoA
          + '&photoB=' + that.data.userData.photoB
        })
      } else {
        that.setData({
          userData: null,
          isReady: false
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {//对战分享
      // 来自页面内转发按钮
      return {
        title: '骚年！来刷题吧',
        imageUrl: "../../images/sharePIC.jpg",
        path: '/pages/wait-passive/wait-passive?type=' + that.data.type + '&oid=' + getApp().globalData.userID,
        success: function (res) {// 转发成功
          wx.showToast({
            title: '邀请成功',
            icon: 'success',
            duration: 1000

          })
          
        }
      }
    } else {//普通分享
      return {
        imageUrl: "../../images/sharePIC.jpg",
        title: '骚年！来刷题吧',
        path: '/pages/index/index'
      }
    }
  },
  sendStart: function () {
    if (this.data.isReady) {//俩人都准备好了
      wx.sendSocketMessage({
        data: JSON.stringify({ "msgs": "start" })
      })
    } else {
      wx.showToast({
        title: '单人不能开始哦',
        icon: "none",
        mask: false,
        duration: 1000
      })
    }
  },
  goIndex_closeWS: function () {//关闭ws链接，跳转到首页
    wx.closeSocket()
    wx.redirectTo({
      url: '../index/index'
    })
  }
})