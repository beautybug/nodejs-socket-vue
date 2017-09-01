<template>
  <div class="container">
    <!--<el-tabs type="border-card" v-model="activeName" @tab-click="handleTabSwitch">
      <el-tab-pane name="login">
        <span slot="label" class="coe-login">登录</span>
      </el-tab-pane>
      <el-tab-pane name="register">
        <span slot="label" class="">注册</span>
      </el-tab-pane>
    </el-tabs>-->
    <el-form :label-position="labelPosition" ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register('form')">注册</el-button>
      </el-form-item>
    </el-form>

  </div> <!-- /container -->
</template>

<script>
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (this.form.password !== this.form.confirmPassword) {
        callback(new Error('密码不一致'));
      } else {
        callback();
      }
    };
    return {
			user: {},
      form: {
        username: '',
        password: '',
				confirmPassword: '',
      },
      activeName: 'login',
      labelPosition: 'top',
			rules: {
				username: [
					{ required: true, message: '请输入账号', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
				],
				confirmPassword: [
					{ required: true, message: '请再次输入密码确认', trigger: 'blur' },
					{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
					{ validator: validatePassword, trigger: 'blur' }
				],
			}
    }
  },
  methods: {
    login() {
      this.$http.post('/login', this.form).then(res => {
        console.log('登录成功');
        this.$router.push({name: 'chatroom'});
      })
    },
    handleTabSwitch(tab, event) {
      console.log(tab, event);
    },
		register(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$http.post('/register', this.form).then(res => {
						this.user = res.body;
            this.$cookie.set('currentUser', this.user, 1);
            this.$router.push({name: 'chatroom'});
					})
				}
			});
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
  margin: 20px 50px;
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
