<template>
  <div class="header-view" :style="{height: height,position:position}">
    
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
          this.$electron.ipcRenderer.send("win-close");
        })
        .catch(() => {});
    },
    minimize() {
      this.$electron.ipcRenderer.send("win-minimize");
    },
    back() {
      if (this.$route.name == "login") {
        this.$router.go(-1);
        this.$electron.ipcRenderer.send("back-Login");
      }
    },
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>

</style>
