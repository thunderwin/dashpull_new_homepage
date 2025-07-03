<script setup>
const { t } = useI18n()

// 页面元数据
useHead({
  title: t('screeners.title'),
  meta: [
    { name: 'description', content: t('screeners.description') }
  ]
})

// 预设的筛选器类型
const screenerTypes = [
  {
    id: 'growth',
    name: t('screeners.growth.title'),
    description: t('screeners.growth.description'),
    icon: 'i-lucide-trending-up',
    color: 'green'
  },
  {
    id: 'value',
    name: t('screeners.value.title'),
    description: t('screeners.value.description'),
    icon: 'i-lucide-dollar-sign',
    color: 'blue'
  },
  {
    id: 'dividend',
    name: t('screeners.dividend.title'),
    description: t('screeners.dividend.description'),
    icon: 'i-lucide-coins',
    color: 'yellow'
  },
  {
    id: 'momentum',
    name: t('screeners.momentum.title'),
    description: t('screeners.momentum.description'),
    icon: 'i-lucide-zap',
    color: 'purple'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('screeners.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {{ t('screeners.subtitle') }}
        </p>
      </div>

      <!-- 筛选器类型网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="screener in screenerTypes"
          :key="screener.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center mb-4">
            <div :class="`p-3 rounded-lg bg-${screener.color}-100 dark:bg-${screener.color}-900`">
              <UIcon :name="screener.icon" :class="`w-6 h-6 text-${screener.color}-600 dark:text-${screener.color}-400`" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ screener.name }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            {{ screener.description }}
          </p>
          <UButton
            :label="t('screeners.launch')"
            color="primary"
            variant="soft"
            class="mt-4 w-full"
            @click="navigateTo(`/screeners/${screener.id}`)"
          />
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {{ t('screeners.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UIcon name="i-lucide-search" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('screeners.features.search.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('screeners.features.search.description') }}
            </p>
          </div>
          <div class="text-center">
            <div class="p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UIcon name="i-lucide-filter" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('screeners.features.filter.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('screeners.features.filter.description') }}
            </p>
          </div>
          <div class="text-center">
            <div class="p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UIcon name="i-lucide-brain" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('screeners.features.ai.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('screeners.features.ai.description') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 