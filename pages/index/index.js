//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ishowPopUp:false,
    userInfo: null,
    hasUserInfo: false,
    isActive:"",
    cfg: app.globalData.cfg,
    nodes: 'C.<span class="MathJye" mathtag="math" style="whiteSpace: nowrap;wordSpacing: normal;wordWrap: normal"><tr><td style="border-bottom:1px solid black">169</td></tr><tr><td>3</td></tr></span>'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  onLoad: function (options) {
    wx.onSocketMessage(function(res){
      console.log('收到服务器信息app.js')
      console.log(res)
      var data = JSON.parse(res.data);
      if (data.type == "createRoom") {
        getApp().globalData.roomId = data.roomId;
        console.log("跳转url" + getApp().globalData.isActive + '&roomId=' + getApp().globalData.roomId)
        wx.navigateTo({
          url: '../invite/invite?isActive=' + getApp().globalData.isActive + '&roomId=' + getApp().globalData.roomId
        })
      }
      //重连
      // if (data.flag == "reconnection") {
      //   getApp().globalData.roomId = data.roomId;
      //   console.log("跳转url" + that.globalData.isActive + '&roomId=' + getApp().globalData.roomId)
      //   wx.navigateTo({
      //     url: '../PK/PK?reconnection=reconnection&roomId=' + getApp().globalData.roomId
      //     + '&nameA=' + that.data.userA.username
      //     + '&nameB=' + that.data.userB.username
      //     + '&photoA=' + that.data.userA.userphoto
      //     + '&photoB=' + that.data.userB.userphoto
      //   })
      // }
    })
    if (options.change == "change"){
      this.setData({
        ishowPopUp:true
      })
    }
    //获取头像、用户名、
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      //app中没有则获取用户信息
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    //获取总分
    if (app.globalData.totalscore){
      console.log(app.globalData)
      this.setData({
        totalscore: app.globalData.totalscore
      })
    }else{
      console.log(app.globalData)
      app.indexTotalScoreCallBack = (res) => {
        this.setData({
          totalscore: app.globalData.totalscore
        })
      }
    }
  },
  chooseType: function(){
    this.setData({ishowPopUp:true});

  },
  choose:function(event){
    this.setData({
      isActive: event.currentTarget.dataset.num
    })
  },
  popDown:function(){
    this.setData({
      isActive: "",
      ishowPopUp:false
    })
  },
  goInvite:function(){
    if (this.data.isActive != "") {//选择了难度
      console.log("难度是" + this.data.isActive)
      if (getApp().globalData.roomId == null) {//房间号为空发起长连接
        /*建立长连接 */
        console.log("发起长连接")
        wx.connectSocket({
          url: getApp().globalData.cfg.cfg.ws_ip + '/' + getApp().globalData.userID + '/null',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          method: "POST"
        })
        //将isActive传入app.js globalData
        console.log("app.js跳转")
        getApp().globalData.isActive = this.data.isActive;
      }else{//存在跳转页面
        console.log("跳转页面url?isActive=" + this.data.isActive + '&roomId=' + getApp().globalData.roomId)
        wx.navigateTo({
          url: '../invite/invite?isActive=' + this.data.isActive + '&roomId=' + getApp().globalData.roomId
        })
      }
      
    }
  },
  goRankPage:function(){
    wx.navigateTo({
      url: '../ranks/ranks'
    })
  },
  gomyscore:function(){
    if (app.globalData.userID){
      wx.navigateTo({
        url: '../myscore/myscore?oid=' + app.globalData.userID
      })
    }else{
      wx.showToast({
        title: '登录中，请重试',
        icon:"none",
        duration:1500
      })
      app.getOid();
    }
    
  },
  goError:function(){
    if (app.globalData.userID) {
      wx.navigateTo({
        url: '../errorList/errorList?oid=' + app.globalData.userID
      })
    } else {
      wx.showToast({
        title: '登录中，请重试',
        icon: "none",
        duration: 1500
      })
      app.getOid();
    }
  },
  sendNewPerson:function(e){
    //显示选择题目类型
    this.setData({ ishowPopUp: true });
    var formId = e.detail.formId;
    if (getApp().globalData.isNewPerson){//是一个新人，就发送
      getApp().globalData.isNewPerson = false;
      wx.request({
        url: getApp().globalData.cfg.cfg.http_ip + '/msg/first/send', //仅为示例，并非真实的接口地址msg/first/ send
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          userId: getApp().globalData.userID,
          formId: formId
        },
        success: (res) => { }
      })
    }  
  }
})
