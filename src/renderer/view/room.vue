<template>
  <div class="room_box shadow">
    <template v-if="isOpen">
      <header-view :isOpen="isOpen" :USERNAME="username"></header-view>
      <list-view :roomList="roomList" ref="listView" :loading="loading"></list-view>
    </template>
    <template v-else>
      <header-view :isOpen="isOpen" :courseName="courseName"></header-view>
      <room-view :query="query" ref="roomview" :isOpen="isOpen"></room-view>
    </template>
  </div>
</template>
<script>
import { getRoomList } from "../api/api";
import headerView from "../components/Header";
import listView from "../components/ListView";
import roomView from "../components/RoomView";
export default {
  data() {
    return {
      roomList: [],
      loading: true,
      ipcRenderer: this.$electron.ipcRenderer,
      query: {},
      isOpen: true,
      username: "",
      courseName: ""
    };
  },
  components: {
    headerView,
    listView,
    roomView
  },
  methods: {
    getRoomList(account) {
      var self = this;
      let para = {
        account: account
      };
      getRoomList(para).then(data => {
        let { msg, code, rooms } = data.data;
        if (code !== 200) {
          self.$toast.center(msg);
        } else {
          self.roomList = rooms;
          self.loading = false;
        }
      });
    }
  },
  mounted() {
    var _this = this;
    if (sessionStorage.user) {
      var user = JSON.parse(sessionStorage.user) || "null";
      if (user) {
        _this.username = user.name;
        var account = user.username;
        _this.getRoomList(account);
      } else {
        _this.$electron.ipcRenderer.on("user-access", (event, data) => {
          sessionStorage.user = JSON.stringify(data);
          _this.userInfo = data;
          _this.username = data.name;
          var account = _this.userInfo.username;
          _this.getRoomList(account);
        });
      }
    } else {
      _this.$electron.ipcRenderer.on("user-access", (event, data) => {
        sessionStorage.user = JSON.stringify(data);
        _this.userInfo = data;
        _this.username = data.name;
        var account = _this.userInfo.username;
        _this.getRoomList(account);
      });
    }
  },
  created() {
    let _this = this;
    _this.$bus.on("logoutFlag", function(data) {
      _this.isOpen = data;
    });
    _this.$bus.on("handleClose", function() {
      if (!self.isOpen) {
        _this
          .$confirm("此操作将退出软件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            _this.$electron.ipcRenderer.send("win-close");
          })
          .catch(() => {});
      }
    });
    _this.$bus.on("handleClick", function(data) {
      _this.query = {
        cmd: "create",
        creator: data.name,
        courseName: data.addr,
        userID: data.id
      };
      _this.isOpen = false;
      _this.courseName = data.addr;
    });
  }
};
</script>
<style lang="scss">
</style>
