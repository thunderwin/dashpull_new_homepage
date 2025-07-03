<script setup>
const { t } = useI18n()
const route = useRoute()

const localePath = useLocalePath()

// 页面元数据
useHead({
  title: t('screeners.title'),
  meta: [
    { name: 'description', content: t('screeners.description') }
  ]
})

// 筛选器导航项
const screenerNavItems = [
  { id: 'growth', name: t('screeners.growth.title'), icon: 'TrendingUp', description: t('screeners.growth.description') },
  { id: 'value', name: t('screeners.value.title'), icon: 'DollarSign', description: t('screeners.value.description') },
  { id: 'dividend', name: t('screeners.dividend.title'), icon: 'Banknote', description: t('screeners.dividend.description') },
  { id: 'momentum', name: t('screeners.momentum.title'), icon: 'Zap', description: t('screeners.momentum.description') }
]

// 检查当前活跃的导航项
const isActiveItem = (itemId) => {
  return route.path.includes(`/screeners/${itemId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex">
      <!-- 左侧导航 -->
      <aside class="w-72 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700 shadow-sm">
        <!-- 导航头部 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-lucide-filter" class="w-5 h-5 text-primary-500" />
            {{ t('screeners.title') }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ t('screeners.subtitle') }}
          </p>
        </div>

        <!-- 导航菜单 -->
        <nav class="p-4">
          <ul class="space-y-3">
            <li v-for="item in screenerNavItems" :key="item.id">
              <UButton
                :to="localePath(`/screeners/${item.id}`)"
                variant="ghost"
                size="lg"
                :color="isActiveItem(item.id) ? 'primary' : 'gray'"
                :ui="{
                  base: 'w-full justify-start text-left',
                  variant: {
                    ghost: isActiveItem(item.id) 
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                }"
                class="group"
              >
                <template #leading>
                  <UIcon 
                    :name="`i-lucide-${item.icon}`" 
                    class="w-5 h-5 transition-transform group-hover:scale-110"
                    :class="isActiveItem(item.id) ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'"
                  />
                </template>
                
                <div class="flex flex-col items-start">
                  <span class="font-medium">{{ item.name }}</span>
                  <span class="text-xs opacity-70">{{ item.description }}</span>
                </div>
              </UButton>
            </li>
          </ul>
        </nav>

       
      </aside>

      <!-- 右侧主内容 -->
      <main class="flex-1 p-6 overflow-auto">
        <NuxtPage />
      </main>
    </div>
  </div>
</template> 