<template>
  <div class="roomList">
    <el-table :data="roomList" border style="width: 100%" max-height="600" :loading="loading">
      <el-table-column fixed prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="birth" label="生日" width="120"></el-table-column>
      <el-table-column prop="addr" label="省份"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">创建房间</el-button>
          <el-button type="text" size="small">进入房间</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    props:{
        roomList:{
            type:Array,
            default:[]
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handleClick(item){
            this.$bus.emit('handleClick',item)
        }
    }
};
</script>
<style lang="scss" scope>
</style>
