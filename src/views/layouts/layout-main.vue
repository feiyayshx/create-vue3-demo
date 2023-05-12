<template>
  <el-container class="el-container_wrapper">
    <el-header class="el-header_wrapper" :height="headerHeight">
      <layout-header />
    </el-header>
    <el-container>
      <el-aside width="208px">
        <layout-nav />
      </el-aside>
      <el-main class="main-block">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import LayoutHeader from './layout-header.vue'
import LayoutNav from './layout-nav.vue'
import { headerHeight } from '@/styles/vars.module.scss'
</script>

<style lang="scss" scoped>
.el-container_wrapper {
  height: 100%;

  .el-header_wrapper {
    background: #001529;
  }

  .main-block {
    overflow-y: auto;
    height: calc(100vh - 48px);
    background-color: $background-base;
  }
}
</style>
