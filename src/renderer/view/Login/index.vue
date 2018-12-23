<template>
  <div class="login_box no_drag" :class="isLogined?'flipped':''">
    <div class="login_box_content login_box_before shadow" :class="isLogined?'isLogined':''">
      <header-view :height="height" :position="position" :color="color" :mainBox="mainBox"></header-view>
      <div class="header_background"></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="input_group">
        <el-form-item prop="account">
          <el-input
            v-model="ruleForm.account"
            prefix-icon="courtfont icon-weidenglu"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            prefix-icon="courtfont icon-zhucedenglumima"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login_box_content login_box_after shadow" :class="isLogined?'':'isLogined'">
      <header-view :height="height" :position="position" :color="color2"></header-view>
      <div class="case_content">
        <p>房间列表</p>
        <ul class="case_list">
          <li
            :class="isActive == index?'active':''"
            v-for="item,index in roomList"
            :key="index"
            @click="handleSelected(index)"
            v-if="roomList.length >0"
          >
            <a href="javascript:void(0);">{{item.addr}}</a>
          </li>
          <li v-if="roomList.length == 0">暂无房间</li>
        </ul>
        <div class="case_btn" v-if="roomList.length >0">
          <el-button type="primary" @click="openCourt()">开启房间</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderView from "../../components/Header/";
import { requestLogin, getRoomList } from "../../api/api";
import { Loading } from "element-ui";
function randomUserId() {
  var userid = "userid_web_" + Date.now().toString();
  return userid;
}
export default {
  data() {
    return {
      isShow: false,
      height: "auto",
      position: "absolute",
      color: "#ffffff",
      color2: "#333333",
      ruleForm: {
        account: "283448189",
        password: "123456"
      },
      rules: {
        account: [{ required: true, message: " ", trigger: "blur" }],
        password: [{ required: true, message: " ", trigger: "blur" }]
      },
      isLogined: false,
      mainBox: false,
      roomList: [],
      isActive: 0,
      userInfo: {}
    };
  },
  components: { HeaderView },
  methods: {
    submitForm(formName) {
      var _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          var loginParams = {
            username: _this.ruleForm.account,
            password: _this.ruleForm.password
          };
          requestLogin(loginParams).then(data => {
            let { msg, code, user } = data;
            if (code !== 200) {
              _this.$toast.center(msg);
              loadingInstance.close();
            } else {
              loadingInstance.close();
              _this.isLogined = true;
              sessionStorage.setItem("user", JSON.stringify(user));
              if (_this.isLogined) {
                _this.getRoomList(loginParams.username);
              }
            }
          });
        } else {
          _this.$toast.center("账号或密码错误");
          return false;
        }
      });
    },
    getRoomList(account) {
      var self = this;
      let para = {
        account: account
      };
      getRoomList(para).then(data => {
        let { msg, code, rooms } = data.data;
        if (code !== 200) {
          _this.$toast.center(msg);
        } else {
          self.roomList = rooms;
          console.log(self.roomList);
        }
      });
    },
    handleSelected(index) {
      this.isActive = index;
    },
    openCourt() {
      var _this = this;
      var target = _this.roomList[_this.isActive];
      console.log(target);
      _this.isLogined = false;
      var query = {
        cmd: "create",
        creator: target.name,
        courseName: target.addr,
        userID: target.id
      };
      // this.$router.push({
      //   name: "main",
      //   query: query
      // }); //路由跳转mainChat
      const ipcRenderer = require("electron").ipcRenderer;
      ipcRenderer.send("main-window", query);
    },
    checkLogin() {
      var _this = this;
      var USERINFO = sessionStorage.getItem("user");
      if (USERINFO) {
        _this.isLogined = true;
        if (_this.isLogined) {
          _this.getRoomList(JSON.parse(USERINFO).username);
        }
      }
    }
  },
  mounted() {
    var _this = this;
    var USERINFO = sessionStorage.getItem("user");
    if (USERINFO) {
      _this.isLogined = true;
      if (_this.isLogined) {
        _this.getRoomList(JSON.parse(USERINFO).username);
      }
    }
  },
  created() {
    this.checkLogin();
  }
};
</script>
<style lang="scss" scoped>
.header-view {
  width: 100%;
}
.header-view .right .btn {
  color: #ffffff;
}
.login_box {
  border-radius: 10px;
  margin: 0 auto;
  background-color: #ebf2f9;
  -webkit-transition: -webkit-transform 0.6s ease-in-out;
  transition: transform 0.6s ease-in-out;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .login_box_content {
    height: 100%;
    width: 100%;

    .header_background {
      background: url("../../assets/images/login-back.gif") no-repeat;
      background-size: 100% 180px;
      height: 140px;
    }
    .input_group {
      padding: 20px 90px;
      .el-form-item {
        margin-bottom: 15px;
      }
      input {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #ebf2f9;
        outline: none;
      }
      .el-button {
        background: #1c2445;
        color: #fff;
        border: none;
        cursor: pointer;
        display: block;
        margin: 0 auto;
        width: 100%;
        border-radius: 4px;
        height: 40px;
        span {
          padding: 0 30px;
        }
      }
    }
  }
  .shadow {
    box-shadow: 0 0 10px rgba(0, 0, 0, 1);
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .login_box_before {
    background-size: 100% 180px;
    position: absolute;
    transform: rotateY(0deg);
  }
  .login_box_after {
    position: absolute;
    background-size: 100% 180px;
    -webkit-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 2;
    .case_content {
      p {
        text-align: center;
        color: #333333;
        font-size: 14px;
      }
      .case_list {
        height: 230px;
        padding: 0 30px;
        overflow-y: scroll;
        list-style: none;
        line-height: 45px;
        text-align: center;
        margin: 0;
        li {
          cursor: pointer;
          border-bottom: 1px solid rgba(184, 184, 184, 0.18);
          box-shadow: 0 0 black;
          &.active {
            background: #1c2445;
          }
          &.active a {
            color: #ffffff;
          }
          &:hover {
            background: #1c2445;
          }
          &:hover a {
            color: #ffffff;
          }
          a {
            text-decoration: none;
            color: #333333;
          }
        }
      }
      button {
        width: 220px;
        background: #1c2445;
        height: 40px;
        border-radius: 4px;
        border: none;
        margin: 0 auto;
        display: block;
      }
    }
  }

  .isLogined {
    display: none;
  }
}
.login_box.flipped {
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
</style>
