<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

// 页面元数据
useHead({
  title: t('screeners.value.title'),
  meta: [
    { name: 'description', content: t('screeners.value.description') }
  ]
})

// 响应式数据
const selectedMarketCap = ref(null)
const peRatio = ref(null)
const pbRatio = ref(null)

const marketCapOptions = [
  { label: '小型股 (< $2B)', value: 'small' },
  { label: '中型股 ($2B - $10B)', value: 'mid' },
  { label: '大型股 (> $10B)', value: 'large' }
]

const applyFilters = () => {
  console.log('Applying value filters...')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <UButton
          :to="localePath('/screeners')"
          variant="ghost"
          icon="i-lucide-arrow-left"
          :label="t('common.back')"
        />
      </div>

      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('screeners.value.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ t('screeners.value.description') }}
        </p>
      </div>

      <!-- 筛选器表单 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ t('screeners.filter_criteria') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('screeners.market_cap') }}
            </label>
            <USelectMenu
              v-model="selectedMarketCap"
              :options="marketCapOptions"
              placeholder="选择市值范围"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              市盈率 (P/E)
            </label>
            <UInput
              v-model="peRatio"
              placeholder="最大市盈率"
              type="number"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              市净率 (P/B)
            </label>
            <UInput
              v-model="pbRatio"
              placeholder="最大市净率"
              type="number"
            />
          </div>
        </div>
        
        <div class="mt-8 flex justify-center">
          <UButton
            :label="t('screeners.apply_filters')"
            color="primary"
            size="lg"
            @click="applyFilters"
          />
        </div>
      </div>

      <!-- 结果展示区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {{ t('screeners.results') }}
        </h2>
        
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-dollar-sign" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p class="text-gray-600 dark:text-gray-300">
            {{ t('screeners.no_results_yet') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 