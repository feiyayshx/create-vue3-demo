<!-- 用户中心顶部 tab -->
<style lang="scss" scoped>
.user-center-tabs {
  position: fixed;
  top: 64px;
  left: 272px;
  z-index: 99;
  padding-top: 20px;
  width: calc(100% - 20px - 272px);
  height: 70px;
  background: $base-background;

  .tab-panel-label {
    display: inline-block;
    vertical-align: middle;
    vertical-align: top;

    &:hover {
      color: $primary-text-hover; // $primary-text-hover;
    }
  }

  .refresh-icon {
    vertical-align: -0.2em;

    &:active {
      color: $actived-text;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    &.animating {
      pointer-events: none;
      animation: rotate 1s;
    }
  }

  :deep() {
    .el-tabs {
      height: 50px;
    }

    .el-tabs__header {
      margin: 0;
      border: none;

      .el-tabs__nav {
        border: none;
      }
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      --el-transition-duration: 0.3s;

      margin-right: 10px;
      border-left: none;
      font-size: 16px;
      background: $basic-white;
      vertical-align: top;

      &::before {
        position: absolute;
        top: 1px;
        left: 50%;
        width: 0%;
        height: 2px;
        background: $color-primary;
        content: '';
        transform: translate(-50%, -50%);
      }

      &.is-closable {
        padding-right: 16px;
        padding-left: 16px;
      }

      &:not(.is-active) {
        margin-top: 2px;
        height: 42px;
        line-height: 42px;
      }

      &.is-active {
        height: 50px;
        font-weight: 600;
        color: $color-primary;
        line-height: 46px;

        .is-icon-close {
          color: $color-primary;
        }

        &::before {
          width: 100%;
          transition: width 0.3s;
        }
      }

      .is-icon-close {
        overflow: visible;
        margin-left: 6px;
        width: 20px !important;
        height: 20px !important;
        font-size: 20px;
        color: $darker-text;
        background: transparent;
        transition: color 0s;

        &:hover {
          color: $color-primary;
        }
      }
    }
  }
}

@media screen and (width <= 1440px) {
  .user-center-tabs {
    width: calc(100% - 272px);
  }
}
</style>

<template>
  <div ref="userCenterTabsRef" class="user-center-tabs">
    <el-tabs
      v-model="activeName"
      :padding-highlight="true"
      type="card"
      @tab-click="handleClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane v-for="tab in tabs" :key="tab.path" :name="tab.path" :closable="closable">
        <template #label>
          <div class="tab-panel-label">
            {{ tab.title }}
            <el-tooltip
              v-if="activeName === tab.path"
              class="box-item"
              effect="dark"
              content="点击刷新"
              placement="top"
            >
              <icon
                type="icon-refresh"
                class="refresh-icon"
                :class="refreshAnimating && 'animating'"
                size="18"
                @click="refresh"
                @animationend="refreshAnimating = false"
              />
            </el-tooltip>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="jsx">
import { useEvent } from '@/event'
import { TAB_CLOSE, TAB_SET_TITLE } from '@/event/modules/site'
import { getDefaultPath } from '@/hooks/menus'
import { nextTick, defineEmits, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 所有 tab，默认包含基本信息 tab
const tabs = ref([])
// 是否可以关闭 tab
const closable = ref(false)
const router = useRouter()
watch(
  tabs,
  async () => {
    if (tabs.value.length > 1) {
      closable.value = true
    } else {
      const defaultRoute = await getDefaultPath(router)
      closable.value = tabs.value[0]?.path !== defaultRoute
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 当前 tab 名称，对应路由的 path
const activeName = ref('')
// 设置当前选中的 tab 名称
const setActiveName = (name) => {
  activeName.value = name
  setTimeout(async () => {
    // 先将其置空，再改回来，是因为 el-tabs 中有监听 activeName 的值，然后直接调用 tab-nav 的 scrollToActiveTab 方法滚动到当前激活的 tab
    // 但是此时由于 dom 还没更新，所以计算出来的位置是不准确的。故在此等到 setTimeout 后再次触发 activeName 变化，使得 scrollToActiveTab 方法重新执行，滚动到准确的位置
    activeName.value = ''
    await nextTick()
    activeName.value = name
  })
}
const route = useRoute()
// 监听路由变化，添加对应 tab
watch(
  route,
  () => {
    if (route.path === '/') {
      return
    }
    setActiveName(route.path)
    // 滚动到顶部
    document.querySelector('.main-content') &&
      (document.querySelector('.main-content').scrollTop = 0)
    const tab = {
      fullPath: route.fullPath,
      path: route.path,
      title: route.query.navTitle || route.params.navTitle || route.meta.title || '未命名',
      query: route.query
    }
    const index = tabs.value.findIndex((t) => t.path === route.path)
    if (index === -1) {
      tabs.value.push(tab)
    } else {
      tab.title = tabs.value[index].title
      tabs.value.splice(index, 1, tab)
    }
  },
  {
    immediate: true
  }
)

// 跳转到某个 tab
const goTab = (tab) =>
  router.push({
    path: tab.path,
    query: tab.query
  })
// 点击 tab，跳转到对应路由
const handleClick = (tab) => {
  if (tab.paneName !== route.path) {
    const savedTab = tabs.value.find((t) => t.path === tab.paneName)
    goTab(savedTab)
  }
}
const emits = defineEmits(['tab-remove', 'refresh'])
// 刷新动画是否正在执行
const refreshAnimating = ref(false)
// 刷新
const refresh = () => {
  refreshAnimating.value = true
  setTimeout(() => {
    refreshAnimating.value = false
  }, 1000)
  emits('refresh')
}
// 点击删除
const handleTabRemove = async (name, toPath, toQuery) => {
  const tabIndex = tabs.value.findIndex((tab) => tab.path === name)
  const isCurrentTab = name === activeName.value
  let promise
  // toPath 为关闭后跳转到哪个路径
  if (toPath) {
    promise = router.push({
      path: toPath,
      query: toQuery
    })
  } else if (isCurrentTab) {
    // 如果是关闭当前 tab，需要计算跳转位置
    if (tabIndex > 0) {
      // 跳转到前一个 tab
      const prevTab = tabs.value[tabIndex - 1]
      promise = goTab(prevTab)
    } else if (tabIndex === 0 && tabs.value.length > 1) {
      // 跳转到后一个 tab
      const nextTab = tabs.value[tabIndex + 1]
      promise = goTab(nextTab)
    } else {
      // 跳转到默认路由
      promise = router.push({
        path: '/'
      })
    }
  }
  if (promise) {
    try {
      await promise
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('关闭 tab 失败', e)
      return
    }
  }
  if (tabIndex > -1) {
    tabs.value.splice(tabIndex, 1)
  }
  setTimeout(() => {
    emits('tab-remove', name)
  })
}
// 更新 tab 标题
const handleTabTitleUpdate = (title) => {
  const activeTab = tabs.value.find((tab) => tab.path === activeName.value)
  activeTab.title = title
}
const event = useEvent()
// 监听 TAB_CLOSE 事件关闭
event.on(TAB_CLOSE, (toPath, toQuery) => handleTabRemove(route.path, toPath, toQuery))
// 监听 TAB_SET_TITLE 事件设置标题
event.on(TAB_SET_TITLE, handleTabTitleUpdate)

const userCenterTabsRef = ref()
// 页面滚动
const handleScroll = () => {
  if (!userCenterTabsRef.value) {
    return
  }
  // 左边菜单栏宽度
  let menuWidth = 272
  let { scrollLeft } = document.documentElement
  userCenterTabsRef.value.style.left = `${menuWidth - scrollLeft}px`
  if (scrollLeft) {
    userCenterTabsRef.value.style.width = `${
      document.documentElement.clientWidth - menuWidth + scrollLeft
    }px`
  } else {
    userCenterTabsRef.value.style.width = ''
  }
}
onMounted(() => {
  document.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll)
})
</script>
