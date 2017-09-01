<template>
  <div class="container">
    <el-form :label-position="labelPosition" ref="form" :model="form" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">进入大厅</el-button>
      </el-form-item>
    </el-form>

  </div> <!-- /container -->
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
      },
      labelPosition: 'top',
    }
  },

  methods: {
    login() {
      this.$http.post('/login', this.form).then(res => {
        if (res.body.success) {
          this.$message({
            message: '恭喜，登录成功',
            type: 'success',
          });
          this.$cookie.set('currentUser', res.body.username, 1);
          this.$router.push({name: 'chatroom'});
        } else if (res.body.existed) {
          this.$message({
            message: '用户名已存在,请重新输入',
            type: 'error',
          });
        } else {
          this.$message({
            message: '登录失败，请重试',
            type: 'error',
          });
        }
      })
    },
    handleTabSwitch(tab, event) {
      console.log(tab, event);
    },
  }
}
</script>

<style lang="less" scoped>
@import '../style/login.less';
.container {
  margin: 50px auto;
  width: 460px;
  background: #fff;
  min-height: 400px;
  border: 1px solid #e4ecf3;
  border-radius: 5px;
}

.el-form {
  margin: 100px 50px;
}
.el-tabs__item {
  width: 230px;
  text-align: center;
  font-size: 22px;
  height: 80px;
  line-height: 82px;
}

.el-button {
  margin-top: 20px;
  width: 360px;
}
</style>
