// pages/PK/PK.js
const app = getApp()
var sw = null;
var totalItems = 4;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStopWatch:true,//显示秒表
    thisTotalTime: 0,//当前题目的总时间
    nowrightIndex: null,//当前题目正确选项的索引
    totalItems: totalItems,//总题号
    nowItem: 1,//题号默认为1，之后根据服务器端更新qid
    showResult: false,//显示对局结果
    userNA: null,//用户昵称、头像
    canChoosed: true,//防止用户选择答案后再选，一开始设置为true
    isReadyed: false,//可以开始答题的标志
    cfg: app.globalData.cfg,
    nowCostTime: null,//当前题目花费的时间
    nowChoose: null,//当前题目的选择项
    StopWatchCost: 0,//秒表花费的时间
    type: "",//哪一年级的
    nowTiData: {//测试
      // "analyse": "【分析】根据倒数的定义可知倒数等于本身的数是±1．",
      // "answer": "D",
      // "catename": "选择题",
      // "content": "倒数等于本身的 <image class='timuPic' mode='aspectFit' src='http://img.tiku.cn/tikuimg/q_500014/a/09/02/48/9af1b3e02f.png'></image>数是（）",
      // "create_date": 1517310106000,
      // "degreed": "中档题",
      // "id": 17949,
      // "label": "2011-2012学年上海市浦东新区第四教育署六年级（下）期中数学试卷",
      // "methods": "【解答】解：因为只有（+1）×（+1）=1，（-1）×（-1）=1，所以倒数等于本身的数是±1．故选D．",
      // "nj": "六年级",
      // "optiontype": ["1", "0", "-1", "±1"],
      // "status": 0,
      // "viewcount": "1348954"
    },
    nowscore: 200,
    hasTiData: false,
    oidA: null,
    oidB: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    console.log("我的ID" + this.data.myID)
    console.log(options)
    var usersInfo = {
      uidA: options.uidA,
      uidB: options.uidB,
      photoA: options.photoA,
      photoB: options.photoB
    }
    console.log("-+-+--+-+-+-+-+-+")
    console.log(usersInfo)
    this.setData({
      systemInfo: wx.getSystemInfoSync(),
      systemInfoWidth: wx.getSystemInfoSync().windowWidth,
      systemInfoHeight: wx.getSystemInfoSync().windowHeight,
      type: options.type,
      oidA: options.inviteA,
      oidB: options.inviteB,
      userNA: usersInfo
    })
    var that = this;
    var thisCostTime = 0;
    //wx.sendSocketMessage({ data: "pk_" + encodeURI(encodeURI(that.data.type))})
    console.log("PK开始")
    wx.sendSocketMessage({ data: JSON.stringify({ "msgp": "pk_" + that.data.type }) })
    //监听服务器发送的消息
    wx.onSocketMessage(function (res) {
      console.log("服务器返回数据")
      console.log(res)
      var respData = JSON.parse(res.data);
      console.log("解析后")
      console.log(respData)
      if (respData.code == "4008") {//开始的标志

        //处理选项
        if (typeof (respData.data[0].optiontype) == "string" && respData.data[0].optiontype.length > 0) {
          respData.data[0].optiontype = JSON.parse(respData.data[0].optiontype)
        }

        console.log("4008")
        console.log(respData)
        //一秒后出现答题画面
        setTimeout(function () {
          that.setData({
            isReadyed: true,
          })
        }, 1000)
        //存头像用户名、设置可以开始状态
        that.setData({
          hasTiData: true,
          nowTiData: respData.data[0],
          nowItem: respData.qid,//设置题号
          thisTotalTime: respData.data[0].totaltime//重置总时间
        })
        that.countDown(respData.data[0].totaltime)
      }
      if (respData.code == "4009") {//收到下一题
        if (typeof (respData.data[0].optiontype) == "string" && respData.data[0].optiontype.length > 0) {
          respData.data[0].optiontype = JSON.parse(respData.data[0].optiontype)
        }
        console.log("4009")
        console.log(respData)
        that.setData({
          hasTiData: true,
          StopWatchCost: 0,//重置秒表已运行时间
          nowTiData: respData.data[0],
          nowItem: respData.qid,//设置题号
          thisTotalTime: respData.data[0].totaltime//重置总时间
        })
        that.countDown(respData.data[0].totaltime)
      }
      if (respData.code == "4011") {//结束了
        that.setData({
          showStopWatch:false,//隐藏秒表
          myID: app.globalData.userID,
          showResult: true,//弹出结果
          roomId: respData.showid,//设置场次
          winner: respData.winer
        })
        wx.closeSocket()
      }
    })
    //画秒表
    that.drawStopWatch(0, thisCostTime)
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
  countDown: function (thisTotalTime) {//倒计时函数
    console.log("进入秒表函数");
    var that = this;
    var thisTotalTime = thisTotalTime;
    var thisCostTime = 0;
    //启动秒表计时
    if (sw == null) {
      sw = setInterval(function () {
        if (thisCostTime >= thisTotalTime) {//答题时间到console.log("进入秒表函数");
          clearInterval(sw);
          sw = null;
          var useranswer = that.data.nowChoose + "";
          switch (useranswer) {
            case ("0"): useranswer = "A"; break;
            case ("1"): useranswer = "B"; break;
            case ("2"): useranswer = "C"; break;
            case ("3"): useranswer = "D"; break;
          }
          //发消息
          var sendJson = {};
          sendJson.userid = getApp().globalData.userID;//用户的ID
          sendJson.tid = that.data.nowTiData.id;//题目ID
          sendJson.mdanswer = that.data.nowTiData.answer;//标准答案
          sendJson.useranswer = useranswer;//当前题目用户选的那个
          sendJson.score = that.data.nowscore;
          sendJson.costTime = that.data.nowCostTime;
          sendJson.options = "tijiao";
          sendJson.totalscore = that.data.nowTiData.totalscore;
          console.log("tijiao答案")
          console.log(sendJson)
          wx.sendSocketMessage({//发送用户选项以及答案
            data: JSON.stringify(sendJson)
          })
          setTimeout(function () {
            if (parseInt(that.data.nowItem) <= that.data.totalItems) {
              wx.sendSocketMessage({
                data: JSON.stringify({ "msgn": "next_" + that.data.type })
              })
            } else {
              wx.sendSocketMessage({
                data: JSON.stringify({ "msgc": "end", "oidA": that.data.oidA, "oidB": that.data.oidB })
              })
            }

          }, 500)
          //重置 选项、按钮可点、用户花费时间
          // that.data.nowChoose = null;//重置选择
          // that.data.canChoosed = true;//重置可选择按钮
          // that.data.nowrightIndex = null;//重置正确选项
          that.setData({
            nowChoose: null,
            canChoosed: true,
            nowrightIndex: null,
            nowscore:0
          })
        }
        that.drawStopWatch(thisTotalTime, thisCostTime + 1)
        thisCostTime++;
        //设置全局花费时间
        that.data.StopWatchCost = thisCostTime;
      }, 1000)
    }
  },
  drawStopWatch: function (totalTime, costTime) {
    //处理时间为数字
    var totalTime = parseInt(totalTime);
    var costTime = parseInt(costTime);
    //防止出现负数
    if (costTime > totalTime) {
      return false;
    }
    /** canvas中的自适应尺寸 屏幕宽度/750*想设置的尺寸 **/
    var context = wx.createCanvasContext('canvas-C');
    //画底图
    context.drawImage("../../images/stopWatch.png", 0, 0, this.data.systemInfoWidth / 750 * 180, this.data.systemInfoWidth / 750 * 202);
    //画秒数
    context.setFontSize(this.data.systemInfoWidth / 750 * 60);
    context.setTextAlign('center');
    context.setFillStyle('#ffffff');
    context.fillText(totalTime - costTime, this.data.systemInfoWidth / 750 * 88, this.data.systemInfoWidth / 750 * 130);
    //逆时针画弧，新开一个路径
    context.beginPath();
    context.setStrokeStyle("#88a7ff");
    context.setLineWidth(this.data.systemInfoWidth / 750 * 20);
    context.arc(this.data.systemInfoWidth / 750 * 90, this.data.systemInfoWidth / 750 * 112, this.data.systemInfoWidth / 750 * 75, 1.5 * Math.PI, (costTime / totalTime - 0.25) * 2 * Math.PI, true);
    context.stroke()
    context.draw()
  },
  //答题函数
  chooseOption: function (event) {
    console.log(event)
    var that = this;
    if (event.currentTarget.dataset.index == undefined) {
      console.log("手快了，没选上")
      return false;
    }
    if (that.data.canChoosed) {//可以选择
      that.data.canChoosed = false;//防止一道题点好几下


      var userChoose = event.currentTarget.dataset.index + "";//用户选项
      var userChoose_v = event.currentTarget.dataset.index;//用户的索引
      //转换用户的索引为ABCD
      switch (event.currentTarget.dataset.index + "") {
        case "0": userChoose = "A"; break;
        case "1": userChoose = "B"; break;
        case "2": userChoose = "C"; break;
        case "3": userChoose = "D"; break;
      }
      //转正确答案为索引
      var rightIndex = "";
      switch (that.data.nowTiData.answer) {
        case "A": rightIndex = "0"; break;
        case "B": rightIndex = "1"; break;
        case "C": rightIndex = "2"; break;
        case "D": rightIndex = "3"; break;
      }
      console.log("选择了" + event.currentTarget.dataset.index);
      //计算分数
      var nowScore = 0;//题目所得分数
      that.data.StopWatchCost//设置花费的时间
      that.data.nowTiData.answer//当前题目正确选项ABCD
      console.log(that.nowTiData)
      console.log("正确答案+++用户选择")
      console.log(that.data.nowTiData.answer)
      console.log(userChoose)
      if (that.data.nowTiData.answer == userChoose) {//答对算分
        if (that.data.StopWatchCost < 0.5 * parseInt(that.data.thisTotalTime)) {//满分
          nowScore = that.data.nowTiData.totalscore;
        } else if (that.data.StopWatchCost > 0.75 * parseInt(that.data.thisTotalTime)) {//一般分
          nowScore = that.data.nowTiData.totalscore * 0.5;
        } else {//四分之三分
          nowScore = that.data.nowTiData.totalscore * 0.75;
        }
      }
      //页面显示用户所得分数
      wx.showToast({
        icon: "none",
        title: "获得" + nowScore + "分",
        duration: 1000
      })
      //更新视图设置数据
      that.setData({
        nowrightIndex: rightIndex,
        nowscore: nowScore,//分数
        nowChoose: userChoose_v,
        nowCostTime: that.data.StopWatchCost, //设置花费的时间
      })
      //   case "D": that.setData({
      //     nowrightIndex: 3, //设置当前题目正确选项
      //     nowChoose: event.target.dataset.index, //设置用户的选择项
      //     nowCostTime: that.data.StopWatchCost, //设置花费的时间
      //     nowscore: that.data.nowCostTime + that.data.StopWatchCost
    }
  },
  //跳转到结果详情页
  goDetailResult: function (event) {
    var that = this;
    console.log(event)
    if (!that.data.userNA.uidA) {
      that.data.userNA.uidA = ""
    }
    if (!that.data.userNA.uidB) {
      that.data.userNA.uidB = ""
    }
    if (!that.data.userNA.photoA) {
      that.data.userNA.photoA = ""
    }
    if (!that.data.userNA.photoB) {
      that.data.userNA.photoB = ""
    }
    wx.redirectTo({
      url: '../detailResult/detailResult?roomId=' + that.data.roomId 
      + '&oidA=' + that.data.oidA 
      + '&oidB=' + that.data.oidB
    })
  }

})