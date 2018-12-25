<template>
  <section>
    <div class="main_box">
      <div class="wrapper">
        <div class="wrapper-item">
          <video
            id="localVideo"
            style=" margin: 0 auto; width: 100%; height: 100%;"
            muted
            autoplay
            playinline
          ></video>
        </div>
        <template v-if="members.length <= 0">
          <div class="wrapper-item"></div>
          <div class="wrapper-item"></div>
          <div class="wrapper-item"></div>
        </template>
        <div class="wrapper-item" v-for="(item, index) in members" :key="index">
          <video
            :id="'v_'+(item.id)"
            style=" margin: 0 auto; width: 100%; height: 100%;"
            autoplay
            playsinline
          ></video>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    query: {
      type: Object,
      default: {}
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mainBox: true,
      courseName: null, //房间名
      courseId: null, //房间id
      selfName: null,
      selfRole: "主播",
      userID: null, //用户id
      canLink: false,
      showSelfPreviewed: 0,
      toggleSketchPage: false,
      isRoomCreator: false,
      togglePusherText: "",
      inputSketchpadData: null,
      showSketchpad: false,
      members: [],
      member_list: [],
      requestMembers: [],
      refleshTask: null,
      pushers: {},
      nameMap: {
        "@TIM#SYSTEM": ""
      }, // userId : nickName
      inputMessage: "",
      lastUpdateTime: moment(Date.now() - 10 * 1000 * 60).format("hh:mm:ss A"),
      recentMembers: [],
      mode: "camera",
      memberUpdateTimer: null,
      getMemberListSto: null,
      userAuthData: {},
      heartBeatTask: null, // 心跳任务定时器
      courseName: "",
      ipcRenderer: this.$electron.ipcRenderer
    };
  },
  watch: {
    members: {
      handler: function(newData, oldData) {
        var self = this;
        console.warn("members:", newData);
        self.$nextTick(function() {
          for (var index in newData) {
            var videoElement = document.getElementById(
              "v_" + newData[index].id
            );
            if (videoElement) {
              videoElement.srcObject = newData[index].stream;
            }
          }
        });
      },
      deep: true
    },

    requestMembers: {
      handler: function(newData, oldData) {
        var self = this;
        if (newData.length == 0) {
          self.refleshTask = null;
        } else {
          if (!self.refleshTask) {
            self.refleshTask = setTimeout(function() {
              self.refleshRequestMembers();
            }, 1000);
          }
        }
      },
      deep: true
    },
    showSelfPreviewed: function(newValue, oldValue) {
      var self = this;
      if (newValue) {
        self.$nextTick(function() {
          var previewId = "video_previewed";
        });
      } else {
      }
    },
    selfRole: function(newValue, oldValue) {
      console.log("selfRole: " + oldValue + "-> newValue:" + newValue);
      switch (newValue) {
        case "主播": {
          if (oldValue == "观众") {
            this.canLink = true;
            this.togglePusherText = "断开连麦";
          }
          break;
        }
        case "观众": {
          this.canLink = true;
          // this.togglePusherText = '请求连麦'
          this.togglePusherText = "";
          this.members = [];
          break;
        }
      }
    }
  },
  mounted: function() {
    // var query = this.$route.query;
    var self = this;
    var query = self.query;
    var isOpen = self.isOpen;
    console.log(query);
    if (!query) {
      alert("请先登录!");
    } else if (query.cmd == "create") {
      self.userID = query.userID;
      self.selfRole = "教师";
      self.isRoomCreator = true;
      self.courseName = query.courseName || "新房间";
      self.selfName = query.creator;
    } else if (query.cmd == "enter") {
      self.userID = query.userID;
      if (query.roomCreator === self.userID) {
        // 相当于老师重新加入房间
        self.selfRole = "教师";
        self.isRoomCreator = true;
      } else {
        self.selfRole = "学生";
        self.isRoomCreator = false;
      }
      self.selfName = query.userName;
      self.roomID = query.roomID;
    } else if (query.cmd != "create" && query.cmd != "enter") {
      alert("发生错误，无法识别身份");
    }
    WebRTCRoom.getLoginInfo(
      self.userID,
      function(res) {
        console.log(res);
        self.userAuthData = res.data;
        self.userID = res.data.userID;
        self.userSig = res.data.userSig;
        self.accountType = res.data.accountType;
        self.sdkAppID = res.data.sdkAppID;
        localStorage.setItem("userID", self.userID);
        self.initRTC();
      },
      function(res) {}
    );
  },
  methods: {
    initRTC: function() {
      var self = this;
      var query = self.query;
      trtc_report.send({
        type: "event",
        event: 1206
      });
      var RTC = (self.RTC = new WebRTCAPI(
        {
          sdkAppId: self.sdkAppID,
          openid: self.userID,
          userSig: self.userSig,
          accountType: self.accountType
        },
        function() {
          if (query.cmd == "create") {
            self.actionCreateRoom(query);
          } else if (query.cmd == "enter") {
            self.actionEnterRoom(query);
          }
        },
        function(error) {
          console.error(error);
        }
      ));

      RTC.on("onLocalStreamAdd", function(info) {
        var videoElement = document.getElementById("localVideo");
        videoElement.srcObject = info.stream;
        videoElement.muted = true;
      });

      RTC.on("onRemoteStreamUpdate", function(info) {
        var videoElement = document.getElementById("v_" + info.videoId);
        if (videoElement) {
          videoElement.srcObject = null;
        }
        if (info.stream) {
          var temp = [];
          for (var i = 0; i < self.members.length; i++) {
            if (self.members[i].openId != info.openId) {
              temp.push(self.members[i]);
            }
          }
          var member = {
            id: info.videoId,
            name: info.openId,
            request: false,
            role: "主播",
            roleText: "连麦",
            ts: Date.now(),
            stream: info.stream,
            openId: info.openId
          };
          temp.push(member);
          self.members = temp;
        } else {
          console.info(info.openId + "进入了房间");
        }
      });

      RTC.on("onRemoteStreamRemove", function(info) {
        var videoElement = document.getElementById("v_" + info.videoId);
        if (videoElement) {
          videoElement.srcObject = null;
        }
        var temp = [];
        for (var i = 0; i < self.members.length; i++) {
          if (self.members[i].id != info.videoId) {
            temp.push(self.members[i]);
          }
        }
        self.members = temp;
      });

      RTC.on("onKickOut", function() {
        console.warn("其他地方登录，被踢下线");
        self.goHomeRouter();
      });

      RTC.on("onWebSocketClose", function() {
        console.warn("websocket断开");
        self.goHomeRouter();
      });

      RTC.on("onRelayTimeout", function() {
        console.warn("服务器超时断开");
        self.goHomeRouter();
      });
    },
    togglePusher: function() {
      var self = this;
      switch (self.togglePusherText) {
        case "请求连麦": {
          self.joinPusherBtnClick();
          break;
        }
        case "断开连麦": {
          LiveRoom.quitPusher({
            fail: function() {
              alert("发生错误(quitPusher)");
              self.selfRole = "观众";
            },
            success: function() {
              self.selfRole = "观众";
              console.log("退出连麦成功");
            }
          });
          break;
        }
      }
    },

    getMemberList: function() {
      var self = this;
      WebRTCRoom.get_room_members(
        self.courseId,
        function(data) {
          console.debug(data);
          if (data.data.code === 0) {
            data.data.members.forEach(function(item) {
              self.nameMap[item.userID] = item.nickName;
            });
            self.member_list = data.data.members;
          }
        },
        function(err) {
          if (err && err.errCode === 3) {
            self.goHomeRouter();
          }
        }
      );
    },

    renderMemberList: function() {
      var self = this;
      this.stopRenderMemberList();
      self.getMemberList();
      this.getMemberListSto = setTimeout(function() {
        self.renderMemberList();
      }, 3000);
    },
    stopRenderMemberList: function() {
      clearTimeout(this.getMemberListSto);
    },

    refleshRequestMembers: function() {
      var self = this;
      var temp = [];
      for (var i = 0; i < self.requestMembers.length; i++) {
        var mb = self.requestMembers[i];
        mb.count--;
        if (mb.count > 0) temp.push(mb);
      } //for
      self.refleshTask = null;
      self.requestMembers = temp;
      console.log("reflesh: ", JSON.stringify(self.requestMembers));
    },

    afterCreateRoom: function(courseInfo) {
      var self = this;
      self.courseId = courseInfo.courseId;
      self.courseName = courseInfo.courseName;
      //创建房间
      this.RTC.createRoom(
        {
          roomid: parseInt(self.courseId),
          role: "miniwhite"
        },
        function() {
          trtc_report.send({
            type: "event",
            event: 1207
          });
          console.info("ENTER RTC ROOM OK");
        },
        function(result) {
          if (result) {
            console.error("ENTER RTC ROOM failed");
            self.goHomeRouter();
          }
        }
      );
      self.renderMemberList();
    },

    actionCreateRoom: function(query) {
      console.log("-> action create room");
      var self = this;

      //本地存储，刷新的时候还是同一个房间号
      if (localStorage.getItem("course_info")) {
        var courseInfo = JSON.parse(localStorage.getItem("course_info"));
        console.log(" localstorage", courseInfo);
        self.afterCreateRoom(courseInfo);
        self.heartBeatTask = WebRTCRoom.startHeartBeat(
          self.userID,
          courseInfo.courseId,
          function() {},
          function() {
            self.$toast.center("心跳包超时，请重试~");
            self.goHomeRouter();
          }
        );
      } else {
        WebRTCRoom.createRoom(
          self.userID,
          self.selfName,
          query.courseName,
          function(res) {
            // 发送心跳包
            self.heartBeatTask = WebRTCRoom.startHeartBeat(
              self.userID,
              res.data.roomID,
              function() {},
              function() {
                self.$toast.center("心跳包超时，请重试~");
                self.goHomeRouter();
              }
            );
            //本地存储，刷新的时候还是同一个房间号
            localStorage.setItem(
              "course_info",
              JSON.stringify({
                courseId: res.data.roomID,
                courseName: query.courseName
              })
            );
            self.afterCreateRoom({
              courseId: res.data.roomID,
              courseName: query.courseName
            });
          },
          function(res) {
            // error, 返回
            self.goHomeRouter();
          }
        );
      }
    },

    actionEnterRoom: function(query) {
      var self = this;
      self.courseId = query.roomID;
      self.courseName = query.roomInfo;
      self.selfName = query.userName;
      WebRTCRoom.enterRoom(
        self.userID,
        query.userName,
        self.courseId,
        function(res) {
          // 发送心跳包
          self.heartBeatTask = WebRTCRoom.startHeartBeat(
            self.userID,
            res.data.roomID,
            function() {},
            function() {
              self.$toast.center("心跳包超时，请重试~");
              self.goHomeRouter();
            }
          );

          //进房间
          self.RTC.createRoom(
            {
              roomid: parseInt(self.courseId),
              role: "miniwhite"
            },
            function(result) {
              trtc_report.send({
                type: "event",
                event: 1208
              });
            },
            function() {
              if (result) {
                console.error("webrtc建房失败");
                self.goHomeRouter();
              }
            }
          );
          self.renderMemberList();
        },
        function(res) {
          // error, 返回
          self.goHomeRouter();
        }
      );
    },

    updateRecentMember: function(member, joined) {
      var self = this;
      if (self.recentMembers.length > 5) {
        self.recentMembers.splice(0, 1);
      }
      self.recentMembers.push({
        name: member.name,
        id: member.id,
        joined: joined
      });
      this.lastUpdateTime = moment(Date.now()).format("hh:mm:ss A");
      console.log("updateRecentMember： ", JSON.stringify(this.recentMembers));
    },

    setMode: function(mode) {
      this.mode = mode;
      this.showSketchpad = true;
      console.log("mode", this.mode);
    },
    onInviteButtonClick: function() {
      console.log("onBeginClassBtnClick() called");
    },

    joinPusherBtnClick: function() {
      var self = this;
      console.log(
        "请求连麦: userID= ",
        self.userID,
        " userName=",
        self.selfName
      );
      self.showSelfPreviewed = true;
    },

    toogleMemberVoice: function(id) {
      //关闭学生的声音
      console.log("toogleMemberVoice", id);
    },

    agreeSpeak: function(agree, id) {
      //连麦应答
      console.log("agreeSpeak", agree, id);
      var self = this;
      for (var i = 0; i < self.requestMembers.length; i++) {
        if (self.requestMembers[i].id == id) break;
      }
      self.requestMembers.splice(i, 1);
      if (agree) {
        console.log("同意" + id + "加入连麦");
      } else {
      }
    },

    kickMember: function(userID) {},

    onSendMessageClick: function() {
      var self = this;
      var msg = this.inputMessage;
      this.inputMessage = "";
      if (msg && msg.length > 0) {
        console.log("sending Msg: ", msg, {
          groupId: self.courseId,
          msg: msg,
          nickName: self.selfName,
          identifier: self.userID
        });
      }
    },
    goHomeRouter() {
      var self = this;
      var user = JSON.parse(sessionStorage.user) || "null";
      // WebRTCAPI.init({}, {});
      localStorage.removeItem("course_info");
      this.RTC && this.RTC.quit();
      this.stopRenderMemberList();
      WebRTCRoom &&
        WebRTCRoom.quitRoom(
          self.userID,
          self.courseId,
          function(res) {
            self.$bus.emit('logoutFlag',true)
          },
          function(res) {
            self.$bus.emit('logoutFlag',true)
          }
        );
    },
    logout() {
      var self = this;
      self
        .$confirm("此操作将退出软件并关闭当前房间, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.goHomeRouter();
        })
        .catch(() => {});
    },
    back() {
      var self = this;
      self
        .$confirm("此操作将退出当前房间, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.goHomeRouter();
        })
        .catch(() => {});
    },
    close() {
      var self = this;
      self
        .$confirm("此操作将退出软件并关闭当前房间, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.goHomeRouter();
          self.ipcRenderer.send("win-close");
        })
        .catch(() => {});
    }
  },
  beforeDestroy() {
    this.stopRenderMemberList();
    clearInterval(this.heartBeatTask);
  },
  created(){
      let self = this
      self.$bus.on('handleLogout',function(){
          self.back()
      })
      self.$bus.on('handleClose',function(){
          self.close()
      })
  }
};
</script>
<style lang="scss" scoped>
.main_box {
  background: #efefef;
  height: calc(100vh - 50px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-top: 50px;
}
.wrapper {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .wrapper-item {
    height: 50%;
    width: 50%;
    box-sizing: border-box;
    border: 1px solid #f3f3f3;
    position: relative;
    background: #000;
    span {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: #fff;
    }
  }
}
</style>
