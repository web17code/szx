var http_ip = "https://mapp.zhunedu.com";
var ws_ip = "wss://mapp.zhunedu.com/websocket";
// var http_ip = "http://192.168.1.146:8084/tiku";
// var ws_ip = "ws://192.168.1.146:8084/tiku/websocket";
var defaultAvatar = "https://mapp.zhunedu.com/images/defaultAvatar1.png"
var defaultName = "无名氏"; 
var cfg = {};
cfg={
  http_ip: http_ip,
  ws_ip: ws_ip,
  defaultAvatar:defaultAvatar,
  defaultName: defaultName
}
module.exports.cfg = cfg;