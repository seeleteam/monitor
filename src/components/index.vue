// template define
<template>
  <div class="main">
    <Header @changeSelect="changeSelect"></Header>
    <div class="main-wrap">
      <div class="main-content">
        <SeeleList v-bind:netWork = "selectValue"></SeeleList>
      </div>
    </div>
  </div>
</template>

// script define
<script>
import Header from './header'
import SeeleList from './seeleList'
export default {
  data () {
    return {
      selectValue: 1
    }
  },
  components: {
    Header,
    SeeleList
  },
  methods: {
    changeSelect (data) {
      this.selectValue = data - 0
    }
  }
}
</script>

// css define
<style lang="less">
.main {
  height: 100%;
  min-width: 1366px;
  background: #08274f;
}
.main-wrap {
  .main-content {
    height: 100%;
  }
}
@media screen and (max-width: 768px) {
  .main {
    min-width: 100%;
  }
  .main-wrap {
    .main-content {
      height: 100%;
    }
  }
}
</style>
