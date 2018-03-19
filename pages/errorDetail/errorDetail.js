// pages/errorDetail/errorDetail.js
var wxParse = require('../../wxParse/wxParse.js');
var FData = '<img  src=\"https://homework.zmlearn.com/api/jyeoo/proxyImage?urlImage=/upimages/quiz/images/201201/82/2a7ada62.png\" style=\"vertical-align:middle;FLOAT:right\" />如图，这个几何体的主视图是（　　)'
/*
wxParse.wxParse(‘article’, ‘html’, content, that, 5);
参数说明
article：节点名称，会在 wxml 中引用
html：代表解析的是html代码，其实wxparse还可以解析markdown代码
content：代表从服务器取到取html内容
that：代表 app 实例
5：代表图片的内边距
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FData: "",
    FData1: FData 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    wxParse.wxParse('analyse', 'html', FData, that, 5)
    //options.tid//题目id
    wx.request({
      url: getApp().globalData.cfg.cfg.http_ip + '/match/subjectAnalyze',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: options.oid,
        tid: options.tid
      },
      success: (res) => {
        res.data.data[0].optiontype = JSON.parse(res.data.data[0].optiontype);
        this.setData({
          timuData: res.data.data[0]
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
  
  }
})