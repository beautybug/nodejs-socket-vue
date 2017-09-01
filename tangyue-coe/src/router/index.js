import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';
import Chatroom from '../components/Chatroom.vue';
import Player from '../components/Player.vue';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'login'},
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/chatroom',
      name: 'chatroom',
      component: Chatroom
    },
    {
      path: '/play',
      name: 'play',
      component: Player
    },
  ]
})

export default router;