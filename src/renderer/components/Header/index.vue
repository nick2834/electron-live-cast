<template>
  <div class="header-view" :style="{height: height,position:position}">
    <div class="left flex-c-l"></div>
    <div class="right">
      <el-button @click="minimize" class="no-drag" size="mini" type="text">
        <i class="btn el-icon-minus" :style="{color: color}"></i>
      </el-button>
      <el-button @click="close" class="no-drag hover-color" size="mini" type="text">
        <i class="btn el-icon-close" :style="{color: color}"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
const { BrowserWindow } = require("electron");
export default {
  props: {
    height: {
      type: String,
      default: "40px"
    },
    position: {
      type: String,
      default: "relative"
    },
    color: {
      type: String,
      default: "#333"
    },
    mainBox: {
      type: Boolean,
      default: false
    },
    caseTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isNotLogin: false
    };
  },
  methods: {
    close() {
      this.$confirm("此操作将退出当前房间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$electron.ipcRenderer.send("close");
        })
        .catch(() => {});
    },
    minimize() {
      this.$electron.ipcRenderer.send("win-minimize");
    },
    back() {
      if (this.$route.name !== "login") {
        this.$router.go(-1);
        this.$electron.ipcRenderer.send("back-Login");
      }
    },
    advance() {
      this.$router.go(1);
    },
    refresh() {
      this.$bus.$emit("page-refresh", this.$route.name);
    }
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
