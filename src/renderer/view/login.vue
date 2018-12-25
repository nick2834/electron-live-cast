<template>
  <section style="-webkit-app-region: drag" class="login shadow">
    <div class="form">
      <form>
        <h2 class="title">登录</h2>
        <div class="form-group">
          <!-- <label for="AccessKey">AccessKey</label> -->
          <input
            type="text"
            class="form-control"
            id="account"
            v-model="loginForm.account"
            placeholder="account"
          >
        </div>
        <div class="form-group">
          <!-- <label for="SecretKey">SecretKey</label> -->
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="loginForm.password"
            placeholder="password"
          >
        </div>
        <el-button type="primary" @click.prevent="handleRoomList" size="small" class="btn">确定</el-button>
      </form>
    </div>
  </section>
</template>

<script>
import { requestLogin, getRoomList } from "../api/api";
import { Loading } from "element-ui";
function randomUserId() {
  var userid = "userid_web_" + Date.now().toString();
  return userid;
}
export default {
  data() {
    return {
      loginForm: {
        account: "283448189",
        password: "123456"
      }
    };
  },
  methods: {
    handleRoomList() {
      var _this = this
      if (_this.loginForm.account === "" || _this.loginForm.password === "") {
        _this.$message.error("账号密码不能为空");
      } else {
        let loadingInstance = Loading.service({ fullscreen: true });
        var loginParams = {
          username: _this.loginForm.account,
          password: _this.loginForm.password
        };
        requestLogin(loginParams).then(data => {
          let { msg, code, user } = data;
          if (code !== 200) {
            _this.$toast.center(msg);
            loadingInstance.close();
          } else {
            loadingInstance.close();
            _this.$electron.ipcRenderer.send("roomList", user);
            // localStorage.user = JSON.stringify(user);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.login {
  background: #409eff;
  width: 100%;
  height: 100%;
}
.form form {
  width: 300px;
  margin: 0 auto;
  background: #fff;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 30px;
}

.form form .title {
  text-align: center;
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 15px;
  color: #409eff;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
}

.form-control {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d7dae2;
  border-radius: 4px;
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.btn {
  width: 100%;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #d7dae2;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #d7dae2;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #d7dae2;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #d7dae2;
}
</style>