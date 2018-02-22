// pages/detailResult/detailResult.js
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
    console.log("detailPage")
    console.log(options)
    this.setData({
      options: options
    })
    var options = options;
    console.log(options)
    wx.request({
      url: getApp().globalData.cfg.cfg.http_ip +"/match/getUserScore",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值application/json+application/x-www-form-urlencoded
      },
      data: {
        showid: options.roomId,
        oid: options.oidA,
        uid: options.oidB
      },
      success: (res) => {
        console.log(res.data)
        res.data.totalscore = parseInt(res.data.totalscore);
        res.data.oids = parseInt(res.data.oids);
        res.data.uids = parseInt(res.data.uids);
        this.setData({
          showData: res.data
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
    var that = this;
    return {
      title: '我在数学题战中成绩斐然,你也来试试吧',
      imageUrl: "../../images/sharePIC.jpg",
      path: '/pages/detailResult/detailResult?roomId=' + that.data.options.roomId + '&oidA=' + that.data.options.oidA + '&oidB=' + that.data.options.oidB+'&look=look',
      success: function (res) {}
    }
  },
  goIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})