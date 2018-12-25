<template>
  <div class="header-view">
    <div class="left flex-c-l">
      <el-button class="no-drag" size="mini" type="text" v-if="isOpen" @click="handleLogout">
        <i class="btn el-icon-arrow-left"></i>
      </el-button>
    </div>
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
  /deep/ .left {
    .btn {
      font-size: 17px;
      color: #999;
    }
    .btn:hover {
      color: #31c27c;
    }
    .el-icon-refresh {
      color: #333;
    }
    .search {
      margin-left: 15px;
      width: 200px;
      .el-input__inner {
        border: none;
        border-radius: 30px;
        background: #e9e9e9;
        color: #8c8c8c;
      }
    }
  }
  .right {
    height: inherit;
    .btn {
      font-size: 17px;
      color: #333;
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
