// pages/myscore/myscore.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cfg: app.globalData.cfg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出参数：：：")
    console.log(options)
    var that = this;
    if (options.isShare == "share"){
      that.setData({
        isShare:true
      })      
      wx.request({//别人查看
        url: getApp().globalData.cfg.cfg.http_ip + "/match/getPersonalScore",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: { oid: options.oid},
        success: (res) => {
          console.log(res.data)
          that.setData({
            scoreData: res.data
          })
        }
      })
    }else{
      wx.request({////自己查看
        url: getApp().globalData.cfg.cfg.http_ip + "/match/getPersonalScore",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: { oid: options.oid},
        success: (res) => {
          console.log(res.data)
          that.setData({
            scoreData:res.data
          })
        }
      })
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
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我在数学题战中成绩斐然,你也来试试吧',
      imageUrl: "../../images/sharePIC.jpg",
      path: '/pages/myscore/myscore?isShare=share&oid=' + getApp().globalData.userID,
      success: function (res) {// 转发成功
        
      }
    }
  },
  goIndex:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  goback:function(){
    wx.navigateBack();
  }
})