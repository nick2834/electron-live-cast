<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-live-cast'
  }
</script>

<style lang="scss">
@import url(./assets/styles/public.scss);
body {
  padding: 0;
  margin: 0;
  -webkit-user-select: none;
  height: 800px;
  overflow: hidden;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.header-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
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
