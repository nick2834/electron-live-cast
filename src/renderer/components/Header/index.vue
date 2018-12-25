<template>
  <div class="header-view">
    <div class="left flex-c-l">
      <div class="user_box" v-if="USERNAME != ''">欢迎您：{{USERNAME}}</div>
      <el-button class="no-drag" size="mini" type="text" v-if="!isOpen" @click="handleLogout">
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
      default: true
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
      
    };
  },
  methods: {
    handleLogout() {
      this.$bus.emit('handleLogout',true)
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

</style>
