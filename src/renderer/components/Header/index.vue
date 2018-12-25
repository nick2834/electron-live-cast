<template>
  <div class="header-view">
    <div class="left flex-c-l">
      <div class="user_box" v-if="USERNAME != ''">欢迎您：{{USERNAME}}</div>
      <el-button class="no-drag" size="mini" type="text" v-if="isOpen" @click="handleLogout">
        <i class="btn el-icon-arrow-left"></i>
      </el-button>
    </div>
    <div class="center" v-if="courseName != ''">{{courseName}}</div>
    <div class="right">
      <el-button class="no-drag" size="mini" type="text" @click="minimize">
        <i class="btn el-icon-minus"></i>
      </el-button>
      <el-button class="no-drag hover-color" size="mini" type="text" @click="close">
        <i class="btn el-icon-close"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
const { BrowserWindow } = require("electron");
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    USERNAME:{
      type: String,
      default: ""
    },
    courseName:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      isNotLogin: false
    };
  },
  methods: {
    handleLogout() {
      this.$bus.emit('handleLogout')
    },
    minimize() {
      this.$electron.ipcRenderer.send("win-minimize");
    },
    close() {
      this.$bus.emit('handleClose')
    },
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.header-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  -webkit-app-region: drag;
  height: 50px;
  background: url('../../assets/images/bg.png');
  background-position: center;
  /deep/ .left {
    .user_box{
      color: #fff
    }
    .btn {
      font-size: 17px;
      color: #fff;
    }
    .btn:hover {
      color: #31c27c;
    }
  }
  .center{
    color: #fff;
  }
  .right {
    height: inherit;
    .btn {
      font-size: 17px;
      color: #fff;
    }
    .el-button {
      height: 100%;
      // padding: 0 10px;
    }
    .btn:hover {
      color: #31c27c;
    }
  }
}
</style>
