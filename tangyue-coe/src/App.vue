<template>
  <div class="hello">
    <router-view></router-view>
  </div>
</template>

<script>
import myText from './Text.vue';

export default {
  components: {
    myText
  },
  data() {
    return {
      message: 'Hello Bug',
      items: [],
    }
  },
  methods: {
    submit() {
      this.items.push(this.message);
    },
    deleteItem(index) {
      this.items.splice(index, 1);
    },
  }
}
</script>

<style lang="less" scoped>
</style>