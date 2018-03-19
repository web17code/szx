// pages/wait-passive/wait-passive.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    inviteID:"",
    userInfo: null,
    userData:null,
    cfg: app.globalData.cfg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      type: options.type,
      inviteID: options.oid,
      roomId: options.roomId
    })
    getApp().globalData.type = options.type
    //向app.globalData中设置数据
    //获取自己的头像名称
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        userID: getApp().globalData.userID,
      })
    } else {
      //app中没有则获取用户信息
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
    console.log("根据userID走建立websocket连接")
    if (getApp().globalData.userID==null){
      console.log("回调websocket连接建立")
      getApp().callBackWaitPassiveUserID = ()=>{
        this.wsconnect();
      }
    }else{
      console.log("websocket建立")
      this.wsconnect();
    }
    
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      console.log(res)
    })
    wx.onSocketMessage(function (res) {
      var userData = JSON.parse(res.data);
      console.log('wait-passive')
      console.log(userData)
      if (userData.code=="4002"){
        that.setData({
          userData: userData
        })
      } else if (userData.code == "4006"){//开始pk的信号
        wx.redirectTo({
          url: '../PK/PK'
          + '?nameA=' + userData.userA.username
          + '&nameB=' + userData.userB.username
          + '&photoA=' + userData.userA.userphoto
          + '&photoB=' + userData.userB.userphoto
        })
      } else if (userData.code == "6001") {
        wx.closeSocket({})
        getApp().globalData.roomId = null;
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: '对局已失效',
          icon: "none",
          duration: 1500
        })
      } else if (userData.code == "6003"){
        wx.closeSocket({})
        getApp().globalData.roomId = null;
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: '房间已满',
          icon: "none",
          duration: 1500
        })
      } else{
        that.setData({
          userData: null,
        })
      }
      //if  setData
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
  wsconnect:function(){
    console.log("wscontent")
    console.log(this.data.inviteID)
    if (this.data.inviteID == "undefined" || this.data.inviteID == "" || this.data.inviteID == undefined || this.data.inviteID == null || this.data.inviteID=="null"){
      wx.showToast({
        title: '邀请过期啦',
        icon: "none",
        mask: false,
        duration: 1000
      })
      return false;
    }
    wx.connectSocket({
      url: getApp().globalData.cfg.cfg.ws_ip + '/' + getApp().globalData.userID + '/' + this.data.roomId ,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: "POST"
    })
  },
  goIndex_closeWS: function () {//关闭ws链接，跳转到首页
    wx.closeSocket()
    getApp().globalData.roomId = null;
    wx.reLaunch({
      url: '../index/index'
    })
  }
})