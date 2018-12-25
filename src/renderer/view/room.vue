<template>
  <div class="room_box">
    <header-view :isOpen="isOpen"></header-view>
    <section v-if="!isOpen">
      <div class="roomList">
        <el-table :data="roomList" border style="width: 100%" max-height="550" v-loading="loading">
          <el-table-column fixed prop="id" label="ID" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="birth" label="生日" width="120"></el-table-column>
          <el-table-column prop="addr" label="省份"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">进入房间</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <room-view v-else :query="query" ref="roomview" :isOpen="isOpen"></room-view>
  </div>
</template>
<script>
import { getRoomList } from "../api/api";
import roomView from "../components/RoomView";
import headerView from "../components/Header";
export default {
  data() {
    return {
      roomList: [],
      loading: true,
      ipcRenderer: this.$electron.ipcRenderer,
      query: {},
      isOpen: false
    };
  },
  components: {
    roomView,
    headerView
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
    },
    handleClick(item) {
      this.query = {
        cmd: "create",
        creator: item.name,
        courseName: item.addr,
        userID: item.id
      };
      this.isOpen = !this.isOpen;
    }
  },
  mounted() {
    var _this = this;
    _this.$electron.ipcRenderer.on("user-access", (event, data) => {
      sessionStorage.user = JSON.stringify(data);
      _this.userInfo = data;
      var account = _this.userInfo.username;
      _this.getRoomList(account);
    });
  },
  created() {
    let self = this;
    self.$bus.on("logoutFlag", function(data) {
      self.isOpen = data;
    });
    self.$bus.on("handleClose", function() {
      if (!self.isOpen) {
        this.$confirm("此操作将退出软件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$electron.ipcRenderer.send("win-close");
          })
          .catch(() => {});
      }
    });
  }
};
</script>
<style lang="scss">
</style>
