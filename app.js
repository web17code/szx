var cfg = require('./utils/cfg.js');
//app.js
App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.showLoading({
      title: '登录中',
      mask: false
    })
    //登录，存一下他的openID或unionID
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("开始getUserInfo")
        wx.request({
          url: cfg.cfg.http_ip + '/user/getUserInfo', //仅为示例，并非真实的接口地址
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
          },
          data: {
            code: res.code
          },
          success: (res) => {
            console.log("getUserInfo的数据");
            console.log(res.data)
            //存储oid数据
            var oid = res.data.oid;
            this.globalData.userID = oid
            //存头像,暂时没有获取到wx提供的，先用库里的数据
            if (this.globalData.userInfo == null && res.data.username != null) {
              this.globalData.userInfo = {};
              this.globalData.userInfo.nickName = res.data.username;
              this.globalData.userInfo.avatarUrl = res.data.photo;

            }
            this.globalData.totalscore = res.data.totalscore;
            //首页总分提前完成
            if (this.indexTotalScoreCallBack) {
              this.indexTotalScoreCallBack();
            }

            //被邀请页提前加载完成
            if (this.callBackWaitPassiveUserID) {
              console.log("app-callback")
              this.callBackWaitPassiveUserID();
            }
            //获取用户信息提前完成
            if (this.saveUserInfoCallBack) {
              this.saveUserInfoCallBack()
            }
            //当有type:getFormId时触发
            //接口地址：/msg/first/ send  参数：String userId,String formId
            if (res.data.type=="getFormId"){//需要发送后台，在服务里发送推送欢迎消息
              that.globalData.isNewPerson = true;//新人标志
            }
          },
          complete: (res) => {
            wx.hideLoading()
            if (this.globalData.userID == null) {
              wx.showToast({
                title: '登录失败',
                image: '/images/error.png',
                mask: false,
                duration: 1000
              })
            }
          }
        })
      }
    })
    // 获取用户信息，更新一波数据。没拿到就算了
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况 
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //用户信息存库
              var oid = this.globalData.userID;
              if (oid == null) {
                this.saveUserInfoCallBack = () => {
                  console.log("saveUserInfoCallBack")
                  var userInfo = this.globalData.userInfo
                  wx.request({
                    url: cfg.cfg.http_ip + '/user/update.do',
                    data: { oid: this.globalData.userID, username: userInfo.nickName, userphoto: userInfo.avatarUrl },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    method: "POST",
                    success: function (res) {
                      console.log(res)
                    }
                  })
                }
              } else {
                this.saveUserInfo();
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo'
          })
        }
      }
    }),
    //监听长连接打开状态
    wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        console.log(res) 
    })
    //监听长连接关闭状态
    wx.onSocketClose(function (res) {
      console.log('WebSocket 关闭！')
      that.globalData.roomId = null;
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    //监听服务器发来的信息
    // wx.onSocketMessage(function(res){
    //   console.log('收到服务器信息app.js')
    //   console.log(res)
    //   var data = JSON.parse(res.data);
    //   if (data.type =="createRoom"){
    //     that.globalData.roomId = data.roomId;
    //     console.log("跳转url"+ that.globalData.isActive + '&roomId=' + that.globalData.roomId)
    //     wx.navigateTo({
    //       url: '../invite/invite?isActive=' + that.globalData.isActive + '&roomId=' + that.globalData.roomId
    //     })
    //   }
      //重连
      // if (data.flag == "reconnection") {
      //   that.globalData.roomId = data.roomId;
      //   console.log("跳转url" + that.globalData.isActive + '&roomId=' + that.globalData.roomId)
      //   wx.navigateTo({
      //     url: '../PK/PK?reconnection=' + that.globalData.isActive + '&roomId=' + that.globalData.roomId
      //   })
      // }
    //})

  },
  globalData: {
    userInfo: null,//用户头像等
    userID: null,//用户的唯一标示
    cfg: cfg,
    totalscore: null,
    roomId:null,//房间号
    type:"",
    isNewPerson:false
  },
  getOid: function () {
    if (this.globalData == null) {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: cfg.cfg.http_ip + '/user/getUserInfo', //仅为示例，并非真实的接口地址
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
            },
            data: {
              code: res.code
            },
            success: (res) => {
              console.log(res.data)
              //存储数据
              var oid = res.data.oid;
              this.globalData.userID = oid
              if (this.globalData.userID != null) {
                wx.hideLoading()
              }
            }
          })
        }
      })
    }
  },
  saveUserInfo: function () {
    console.log("保存或更新用户数据！")
    //上传数据库
    var oid = this.globalData.userID;
    var userInfo = this.globalData.userInfo
    wx.request({
      url: cfg.cfg.http_ip + '/user/update.do',
      data: { oid: oid, username: userInfo.nickName, userphoto: userInfo.avatarUrl },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "POST",
      success: function (res) {
        console.log(res)
      }
    })
  }
})