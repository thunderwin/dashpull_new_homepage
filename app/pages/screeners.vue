<script setup>
const { t } = useI18n()

// 页面元数据
useHead({
  title: t('screeners.title'),
  meta: [
    { name: 'description', content: t('screeners.description') }
  ]
})





// 筛选器导航项
const screenerNavItems = [
  { id: 'growth', name: t('screeners.growth.title'), icon: '📈' },
  { id: 'value', name: t('screeners.value.title'), icon: '💰' },
  { id: 'dividend', name: t('screeners.dividend.title'), icon: '💸' },
  { id: 'momentum', name: t('screeners.momentum.title'), icon: '⚡' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex">
      <!-- 左侧导航 -->
      <aside class="w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700">
        

        <!-- 导航菜单 -->
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="item in screenerNavItems" :key="item.id">
              <NuxtLink :to="`/screeners/${item.id}`">
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        
      </aside>

      <!-- 右侧主内容 -->
      <main class="flex-1 p-6">
         <NuxtPage />
      </main>
    </div>
  </div>
</template> 