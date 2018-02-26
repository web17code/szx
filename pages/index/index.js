//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ishowPopUp:false,
    userInfo: null,
    hasUserInfo: false,
    isActive:"",
    cfg: app.globalData.cfg
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  onLoad: function (options) {
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
    if (this.data.isActive!=""){
      wx.navigateTo({
        url: '../invite/invite?isActive=' + this.data.isActive
      })
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
  }
})
