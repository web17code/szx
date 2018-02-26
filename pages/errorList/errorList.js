// pages/errorList/errorList.js
const app = getApp();
var out_options = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorList:[],
    pageSize:7,
    pageNum:1,
    hasMore:true,
    loading:true,//正在请求数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    out_options = options;
    console.log(options.oid)
    var that = this;
    wx.request({
      url: getApp().globalData.cfg.cfg.http_ip + '/match/errorProjects', 
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        uid: options.oid,
        pageSize:that.data.pageSize,
        pageNum:1
      },
      success: (res) => {
        that.data.loading = false;
        that.data.pageNum = that.data.pageNum+1;
        console.log(res.data)
        if (res.data.data.length < that.data.pageSize){//如果该请求的条数小于每页条数，hasMore设置为false，不再请求
          that.data.hasMore = false;
        }
        for (var i = 0; i < res.data.data.length; i++){
          res.data.data[i].optiontype = JSON.parse(res.data.data[i].optiontype);
        }
        var nowArr = that.data.errorList.concat(res.data.data);
        this.setData({
          errorList: nowArr
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
    var that = this;
    console.log("chudi")
    console.log(that.data.hasMore)
    var options = out_options;
    
    if (!that.data.hasMore){
      return false;
    }
    wx.request({
      url: getApp().globalData.cfg.cfg.http_ip + '/match/errorProjects',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: options.oid,
        pageSize: that.data.pageSize,
        pageNum: that.data.pageNum
      },
      success: (res) => {
        that.data.loading = false;
        that.data.pageNum = that.data.pageNum + 1;
        console.log(res.data)
        if (res.data.data.length < that.data.pageSize) {//如果该请求的条数小于每页条数，hasMore设置为false，不再请求
          that.data.hasMore = false;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].optiontype = JSON.parse(res.data.data[i].optiontype);
        }
        var nowArr = that.data.errorList.concat(res.data.data);
        this.setData({
          errorList: nowArr
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goAnalyze: function(event){
    console.log(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../errorDetail/errorDetail?tid=' + event.currentTarget.dataset.id + '&oid=' + app.globalData.userID,
    })
  }
})