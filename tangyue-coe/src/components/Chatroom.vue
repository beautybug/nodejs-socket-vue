<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;" @click="changeToUser('大厅')">大厅聊天</span>
            <el-button style="float: right;" type="default" @click="logout">退出</el-button>
          </div>
          <div v-for="(user, index) in users" :key="index" class="text item">
            <span @click="changeToUser(user.name)">
              <el-badge :value="user.msgCount" :max="99" class="item">
                {{ user.name }}
              </el-badge>
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <div class="chat-content">
          <div class="chat-header">
            {{ toUser }}
          </div>
          <div class="chat-body">
            <div v-for="(message, index) in msgs[toUser].messages" :key="index">
              <div v-if="message.type === 'notify'">{{ message.msg }}</div>
              <div v-else-if="message.type === 'file'">
                <router-link :to="{path: '/play?resNo=' + message.content}"  target="_blank">这是一个文件，点击打开</router-link>
              </div>
              <div v-else>
                <p>{{ message.user }}: </p>
                <p>{{ message.content }}</p>
              </div>
            </div>
          </div>
          <div class="chat-footer">
            <div class="toolbar">
              <el-button type="text" icon="document" @click="dialogFormVisible = true"></el-button>
            </div>
            <el-input type="textarea" :rows="8" class="send-message" v-model="sendMessage" @keyup.enter.native="send('chat')"></el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="发生文件" :visible.sync="dialogFormVisible">
      <p>请选择文件点击发送</p>
      <ul v-for="(resNo, index) in resNos" :key="index">
        <li @click="sendFile(resNo)">文件{{ index + 1 }}</li>
      </ul>
    </el-dialog>
    <el-dialog title="发生文件" :visible.sync="dialogPlayVisible">
      <div id="player"></div>
    </el-dialog>
  </div>
</template>

<script>
import io from 'socket.io-client';
var socket = io.connect('http://127.0.0.1:10086');

export default {
  data() {
		return {
			user: '',
			messages: [],
			users: [],
      chatHeader: '大厅',
      sendMessage: '',
      toUser: '大厅',
      chatMode: 'public',
      msgs: {
        '大厅': {
          messages: [],
        },
      },
      dialogFormVisible: false,
      dialogPlayVisible: false,
      resNos: [
        '56e61a5c78e74dc9ac0c0359efe0c75f',
        '6b96aebadf6444fe8336a21d05965a6a',
        '1f4991567c9841e3ab5bc37302936afe'
      ],
      resNo: '',
      playerToken: '',
      hallCount: 0,
		}
  },
	created() {
		this.user = this.$cookie.get('currentUser');
		if (!this.user) {
			this.$router.push({name: 'login'});
		}
    socket.emit('user join', {user: this.user, fromUser: '大厅'});
		let self = this;
    socket.on('sendmsg', function(data) {
      self.users = data.users;
      if (data.fromUser !== self.user) {
        if (data.fromUser === '大厅') {
          console.log(111);
        } else {
          self.users[data.fromUser].msgCount++;
          console.log(self.users[data.fromUser]);
        }
      }
      self.messages.push(data);
      if (!self.msgs[data.fromUser]) {
        self.msgs[data.fromUser] = {messages: []};
      }
      if (self.user === data.fromUser) {
        self.msgs[data.toUser].messages.push(data);
      } else {
        self.msgs[data.fromUser].messages.push(data);
      }
    });
	},
	methods: {
		send(type) {
      if (this.chatMode === 'public') {
			  socket.emit('public chat', {user: this.user, fromUser: '大厅', toUser: this.toUser, content: this.sendMessage, type: type});
      } else if (this.chatMode === 'private') {
        socket.emit('private chat', {user: this.user, fromUser: this.user, toUser: this.toUser, content: this.sendMessage, type: type});
      }
      this.sendMessage = '';
		},
    sendFile(resNo) {
      this.sendMessage = resNo;
      this.send('file');
      this.dialogFormVisible = false;
    },
    startPlay(resNo, playerToken) {
      this.resNo = resNo;
      this.playerToken = playerToken;
      this.dialogPlayVisible = true;
    },
    changeToUser(toUser) {
      this.toUser = toUser;
      if (!this.msgs[toUser]) {
        this.msgs[toUser] = {messages: []};
      }
      if (toUser === '大厅') {
        this.hallCount = 0;
        this.chatMode = 'public';
      } else {
        this.users[toUser].msgCount = 0;
        this.chatMode = 'private';
      }
    },
    logout() {
      this.$http.get('/logout', {params: {username: this.user}}).then(res => {
        if (res.body.success) {
					this.$message({
						message: '成功退出聊天',
						type: 'success',
					});
          socket.emit('user quit', {user: this.user, fromUser: '大厅'});
					this.$router.push({name: 'login'});
        }
      })
    },
	},
}
</script>

<style lang="less" scoped>
.container {
	margin: 0px 180px;
  border: 1px solid #d8d8d8;
  width: 850px;
  height: 730px;
  background-color: #f3f3f3;

  .user-list {
    width: 100%;
    height: 730px;
    border: 1px solid #D8D8D8;
    overflow: scroll;
  }

  .chat-content {
    width: 100%;
    height: 730px;
    border: 1px solid #D8D8D8;

    .chat-header {
      width: 100%;
      height: 70px;
      line-height: 36px;
      border: 0.5px solid #D8D8D8;
      background-color: #fff;
    }

    .chat-body {
      width: 100%;
      height: 450px;
      overflow: scroll;
    }

    .chat-footer {
      width: 100%;
      height: 210px;
      background-color: #fff;
      border: 0.5px solid #d8d8d8;
      .toolbar {
        height: 30px;
      }
    }
  }
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}

.box-card {
  width: 100%;
  height: 730px;
  overflow: scroll;
}

.file {
  font-size: 24px;
  color: red;
}
</style>
