<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 页面标题 -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ $t('predictions.title') }}
          </h1>
        </div>
  
        <!-- 统计信息 -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics.totalRecords || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.total_records') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-blue-600">{{ statistics.tradedCount || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.trading_count') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-orange-600">{{ statistics.eventCount || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.event_predictions') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-green-600">{{ statistics.longCount || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.long_predictions') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-red-600">{{ statistics.shortCount || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.short_predictions') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-blue-600">{{ statistics.winRate || 0 }}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.win_rate') }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div class="text-2xl font-bold" :class="(statistics.averageProfitRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ statistics.averageProfitRate !== null ? ((statistics.averageProfitRate || 0) >= 0 ? '+' : '') + (statistics.averageProfitRate || 0).toFixed(2) + '%' : '-' }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ $t('predictions.average_profit_rate') }}</div>
          </div>
        </div>
  
        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="ml-3 text-gray-600 dark:text-gray-300">{{ $t('prediction_component.loading') }}</span>
        </div>
  
        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ $t('prediction_component.error') }}</p>
          <button 
            @click="fetchPredictions" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {{ $t('common.refresh') }}
          </button>
        </div>
  
        <!-- 预测历史表格 -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <!-- 桌面端表头 -->
              <thead class="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
                <tr>
                  <th class="w-1/6 px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.date') }}
                  </th>
                  <th class="w-1/6 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.prediction') }}
                  </th>
                  <th class="w-1/6 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.long_short_score') }}
                  </th>
                  <th class="w-1/6 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.chart') }}
                  </th>
                  <th class="w-1/6 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.profit_rate') }}
                  </th>
                  <th class="w-1/6 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {{ $t('predictions.result') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(prediction, index) in predictions" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <!-- 桌面端显示 -->
                  <template v-if="!isMobile">
                    <!-- 日期 -->
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatDate(prediction.day) }}
                    </td>
                    
                    <!-- 预测方向 -->
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <span v-if="!prediction.side" class="text-gray-400 text-xs">
                        -
                      </span>
                      <span 
                        v-else
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          prediction.side === 'long' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        ]"
                      >
                        {{ prediction.side === 'long' ? $t('prediction_component.side_long') : $t('prediction_component.side_short') }}
                      </span>
                    </td>
                    
                    <!-- 信号强度 -->
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      <span :class="(prediction.market_score || 0) > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ prediction.market_score || '-' }}
                      </span>
                    </td>
                    
                    <!-- K线图 -->
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <div class="flex justify-center">
                        <CandlestickBar 
                          v-if="prediction.spy_kline && prediction.spy_kline.length > 0"
                          :data="prediction.spy_kline[0]"
                          :width="40"
                          :height="36"
                        />
                        <span v-else class="text-gray-400 text-xs">-</span>
                      </div>
                    </td>
                    
                    <!-- 盈利率 -->
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                      <span v-if="Math.abs(prediction.market_score || 0) < 0.15" class="text-gray-400">
                        -
                      </span>
                      <span v-else-if="prediction.events && prediction.events !== 'none'" class="text-gray-400">
                        -
                      </span>
                      <span v-else-if="prediction.profit_rate !== null && prediction.profit_rate !== undefined" 
                            :class="prediction.profit_rate >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ (prediction.profit_rate >= 0 ? '+' : '') + prediction.profit_rate.toFixed(2) }}%
                      </span>
                      <span v-else class="text-gray-400">
                        -
                      </span>
                    </td>
                    
                    <!-- 结果 -->
                    <td class="px-4 py-4 whitespace-nowrap text-center">
                      <span 
                        v-if="prediction.result && prediction.result !== null"
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          prediction.result === 'yes' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          prediction.result === 'no' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        ]"
                      >
                        {{ 
                          prediction.result === 'yes' ? '✓ ' + $t('predictions.win') : 
                          prediction.result === 'no' ? '✗ ' + $t('predictions.loss') : 
                          '⊕ ' + $t('predictions.stop_loss')
                        }}
                      </span>
                      <span v-else class="text-gray-400 text-xs">
                        {{ $t('predictions.pending') }}
                      </span>
                    </td>
                  </template>
                  
                  <!-- 手机端紧凑显示 -->
                  <template v-else>
                    <td class="px-3 py-3 w-full" colspan="6">
                      <div class="flex flex-col space-y-2">
                        <!-- 第一行：日期和预测方向 -->
                        <div class="flex items-center justify-between">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ formatDate(prediction.day) }}
                          </div>
                          <div class="flex items-center space-x-2">
                            <span v-if="!prediction.side" class="text-gray-400 text-xs">
                              -
                            </span>
                            <span 
                              v-else
                              :class="[
                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                prediction.side === 'long' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              ]"
                            >
                              {{ prediction.side === 'long' ? $t('prediction_component.side_long') : $t('prediction_component.side_short') }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 第二行：信号强度、盈利率和结果 -->
                        <div class="flex items-center justify-between text-sm">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-1">
                              <span class="text-gray-500 dark:text-gray-400">评分:</span>
                              <span :class="(prediction.market_score || 0) > 0 ? 'text-green-600' : 'text-red-600'">
                                {{ prediction.market_score || '-' }}
                              </span>
                            </div>
                            <div class="flex items-center space-x-1">
                              <span class="text-gray-500 dark:text-gray-400">收益:</span>
                              <span v-if="Math.abs(prediction.market_score || 0) < 0.15" class="text-gray-400">-</span>
                              <span v-else-if="prediction.events && prediction.events !== 'none'" class="text-gray-400">-</span>
                              <span v-else-if="prediction.profit_rate !== null && prediction.profit_rate !== undefined" 
                                    :class="(prediction.profit_rate || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                                {{ ((prediction.profit_rate || 0) >= 0 ? '+' : '') + (prediction.profit_rate || 0).toFixed(2) }}%
                              </span>
                              <span v-else class="text-gray-400">-</span>
                            </div>
                          </div>
                          
                          <div>
                            <span 
                              v-if="prediction.result && prediction.result !== null"
                              :class="[
                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                prediction.result === 'yes' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                prediction.result === 'no' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              ]"
                            >
                              {{ 
                                prediction.result === 'yes' ? '✓ ' + $t('predictions.win') : 
                                prediction.result === 'no' ? '✗ ' + $t('predictions.loss') : 
                                '⊕ ' + $t('predictions.stop_loss')
                              }}
                            </span>
                            <span v-else class="text-gray-400 text-xs">
                              {{ $t('predictions.pending') }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 第三行：K线图 -->
                        <div v-if="prediction.spy_kline && prediction.spy_kline.length > 0" class="flex justify-center pt-2">
                          <CandlestickBar 
                            :data="prediction.spy_kline[0]"
                            :width="36"
                            :height="32"
                          />
                        </div>
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 无数据状态 -->
          <div v-if="predictions.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-2">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('common.no_data') }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  // 响应式数据
  const predictions = ref([])
  const statistics = ref({
    totalRecords: 0,
    tradedCount: 0,
    eventCount: 0,
    longCount: 0,
    shortCount: 0,
    winRate: 0,
    averageProfitRate: null
  })
  const loading = ref(true)
  const error = ref(false)
  const windowWidth = ref(0)
  
  // 检测是否为移动设备
  const isMobile = computed(() => windowWidth.value < 768)
  
  // 更新窗口宽度
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }
  
  // 事件翻译方法
  const translateEvent = (eventKey) => {
    try {
      const { $t } = useNuxtApp()
      return $t(`predictions.events.${eventKey}`, eventKey)
    } catch (error) {
      console.warn('Translation error for event:', eventKey, error)
      return eventKey || 'Unknown Event'
    }
  }
  
  // 方法
  const fetchPredictions = async () => {
    loading.value = true
    error.value = false
    
    try {
      const config = useRuntimeConfig()
      
      // 使用新的统计接口
      const baseUrl = config.public.strapiApiUrl || "https://api.dashpull.com"
      const endpoint = `${baseUrl}/api/human-predicts-statistics`
      
      // 获取认证token（如果有的话）
      const token = config.public.strapiApiToken || 'd500bca2021bcb781b01959a2b5c7eca35104ead14e5a1c7a113e1b77030a9d798e3d0ea3be290c20050d000ac5d7c6cc021e57eda01e40b3c545e2d8da2b6c4b75ead96fa5e3ac2cae31ae76de74415371a7928094e271535d1ef786a1f2216e745df26d4aacf85021f5b86c9f2fe92644a9fa5a1f9d63699e43340409661ff'
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // 如果有token，添加到headers中
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      // 调用新的统计接口
      const response = await $fetch(endpoint, {
        method: 'GET',
        headers,
        retry: 3,
        timeout: 10000
      })
      
      if (response && typeof response === 'object') {
        predictions.value = Array.isArray(response.predictions) ? response.predictions : []
        statistics.value = response.statistics && typeof response.statistics === 'object' ? response.statistics : {
          totalRecords: 0,
          tradedCount: 0,
          eventCount: 0,
          longCount: 0,
          shortCount: 0,
          winRate: 0,
          averageProfitRate: null
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Failed to fetch predictions:', err)
      error.value = true
      // 设置默认值防止页面崩溃
      predictions.value = []
      statistics.value = {
        totalRecords: 0,
        tradedCount: 0,
        eventCount: 0,
        longCount: 0,
        shortCount: 0,
        winRate: 0,
        averageProfitRate: null
      }
    } finally {
      loading.value = false
    }
  }
  
  const formatDate = (dateString) => {
    try {
      if (!dateString) return ''
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      
      const { $i18n } = useNuxtApp()
      return date.toLocaleDateString($i18n.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.warn('Date formatting error:', error)
      return dateString || ''
    }
  }
  
  // 生命周期
  onMounted(() => {
    fetchPredictions()
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })
  
  // SEO
  useHead({
    title: '预测历史 - DashPull',
    meta: [
      {
        name: 'description',
        content: 'AI 预测历史记录，查看最近100次预测结果和统计数据'
      }
    ]
  })
  </script> 