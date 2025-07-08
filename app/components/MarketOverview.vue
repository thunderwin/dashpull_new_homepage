<template>
  <UCard class="prediction-banner bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-2 border-blue-200/30 dark:border-blue-800/30">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center">
      <div class="flex items-center space-x-3">
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-5 w-5 text-primary animate-spin"
        />
        <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
          {{ $t("prediction_component.loading") }}
        </span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="h-6 w-6 text-red-500"
        />
        <p class="text-lg font-medium text-red-600 dark:text-red-400">
          {{ $t("prediction_component.error") }}
        </p>
      </div>
      <UButton
        @click="fetchPrediction"
        color="primary"
        size="sm"
        :loading="loading"
      >
        <template #leading>
          <UIcon name="i-heroicons-arrow-path" />
        </template>
        {{ $t("common.refresh") }}
      </UButton>
    </div>

    <!-- 预测还未发布 (北京时间8点前) -->
    <div v-else-if="!isPredictionTime" class="flex items-center justify-center">
      <!-- 居中的内容区域，内部左右排列 -->
      <div class="flex items-center justify-between w-full max-w-5xl">
        <!-- 左侧：主要内容 -->
        <div class="flex items-center space-x-3">
          <div class="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-clock" class="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("prediction_component.no_prediction_yet") }}
            </h3>
            <p class="text-base text-gray-500 dark:text-gray-400">
              {{ $t("prediction_component.waiting_for_prediction") }}
            </p>
          </div>
        </div>
        
        <!-- 右侧：倒计时 - 放大显示 -->
        <div class="flex items-center">
          <div class="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-lg px-6 py-2 shadow-lg">
                          <div class="text-center">
                <p class="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">{{ $t("prediction_component.countdown_label") }}</p>
                <div class="text-2xl font-black text-amber-900 dark:text-amber-100 font-mono tracking-wider">
                  {{ formatTimeUntilPrediction() }}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 显示预测结果 - 优化布局 -->
    <div v-else-if="prediction && (shouldShowPrediction || hasEvent)" class="flex items-center justify-center">
      <!-- 居中的内容区域，内部左右排列 -->
      <div class="flex items-center justify-between w-full max-w-6xl">
        <!-- 左侧：预测状态 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div
                :class="[
                  'flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg',
                  hasEvent 
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : prediction.side === 'long'
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'bg-gradient-to-br from-red-400 to-red-600',
                ]"
              >
                <UIcon
                  :name="
                    hasEvent
                      ? 'i-heroicons-exclamation-triangle'
                      : prediction.side === 'long'
                      ? 'i-heroicons-arrow-trending-up'
                      : 'i-heroicons-arrow-trending-down'
                  "
                  class="h-7 w-7"
                />
              </div>
              <div
                :class="[
                  'absolute inset-0 rounded-full animate-ping opacity-20',
                  hasEvent 
                    ? 'bg-orange-400'
                    : prediction.side === 'long' ? 'bg-green-400' : 'bg-red-400',
                ]"
              ></div>
            </div>

            <div>
              <UBadge
                :color="hasEvent ? 'orange' : prediction.side === 'long' ? 'green' : 'red'"
                variant="soft"
                size="lg"
                class="text-lg font-bold px-4 py-1 mb-1"
              >
                {{
                  hasEvent
                    ? translateEvent(prediction.events)
                    : prediction.side === "long"
                    ? $t("prediction_component.side_long")
                    : $t("prediction_component.side_short")
                }}
              </UBadge>
              <p class="text-base font-medium text-gray-600 dark:text-gray-300">
                {{ hasEvent ? $t("predictions.event") : $t("prediction_component.current_prediction") }}
              </p>
            </div>
          </div>

          <!-- 市场评分 -->
          <div v-if="!hasEvent" class="flex items-center space-x-3 bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800 rounded-lg px-4 py-1 shadow-lg">
            <UIcon name="i-heroicons-chart-bar-square" class="h-6 w-6 text-blue-600" />
            <span class="text-base font-bold text-blue-800 dark:text-blue-200">
              {{ $t("prediction_component.market_score") }}
            </span>
            <span class="text-2xl font-black text-blue-900 dark:text-blue-100">{{ predictionData.market_score }}</span>
          </div>
        </div>

        <!-- 右侧：更新时间和止损 -->
        <div class="text-right">
          <div class="flex items-center justify-end space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <UIcon name="i-heroicons-clock" class="h-5 w-5" />
            <span>{{ formatDate(prediction.day) }}</span>
          </div>
          <div v-if="hasStopLoss && !hasEvent" class="flex space-x-1 justify-end">
            <UBadge v-if="prediction.long_stoploss" color="green" variant="outline" size="sm" class="px-2 py-1 text-xs">
              多头止损: {{ prediction.long_stoploss }}
            </UBadge>
            <UBadge v-if="prediction.short_stoploss" color="red" variant="outline" size="sm" class="px-2 py-1 text-xs">
              空头止损: {{ prediction.short_stoploss }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有建议状态 - 优化布局 -->
    <div v-else-if="prediction && !shouldShowPrediction && !hasEvent" class="flex items-center justify-center">
      <!-- 居中的内容区域，内部左右排列 -->
      <div class="flex items-center justify-between w-full max-w-5xl">
        <!-- 左侧：主要内容 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-minus-circle" class="h-7 w-7 text-gray-400" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300">
                {{ $t("prediction_component.no_suggestion") }}
              </h3>
              <p class="text-base text-gray-500 dark:text-gray-400">
                {{ $t("prediction_component.market_score_too_low") }}
              </p>
            </div>
          </div>

          <!-- 市场评分显示 -->
          <div class="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-1 shadow-lg">
            <UIcon name="i-heroicons-chart-bar-square" class="h-6 w-6 text-gray-500" />
            <span class="text-base font-bold text-gray-600 dark:text-gray-300">
              {{ $t("prediction_component.market_score") }}
            </span>
            <span class="text-2xl font-black text-gray-900 dark:text-white">
              {{ predictionData.market_score }}
            </span>
          </div>
        </div>

        <!-- 右侧：空位，保持对称 -->
        <div></div>
      </div>
    </div>

    <!-- 无数据状态 - 横向布局 -->
    <div v-else class="flex items-center justify-center">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-document-magnifying-glass" class="h-5 w-5 text-gray-400" />
        </div>
        <p class="text-lg font-medium text-gray-600 dark:text-gray-300">
          {{ $t("common.no_data") }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script>
export default {
  name: "PredictionComponent",
  data() {
    return {
      prediction: null,
      loading: true,
      error: false,
      currentTime: new Date(),
      countdownInterval: null,
    };
  },
  computed: {
    // 判断是否到了预测发布时间 (北京时间晚上8点)
    isPredictionTime() {
      const beijingTime = new Date(
        this.currentTime.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }),
      );
      const currentHour = beijingTime.getHours();
      return currentHour >= 20 || currentHour < 8; // 晚上8点到次日早上8点
    },

    // 预测数据
    predictionData() {
      if (!this.prediction) {
        return {
          market_score: 0,
        };
      }
      return this.prediction;
    },

    // 是否有止损信息
    hasStopLoss() {
      return (
        this.prediction &&
        (this.prediction.long_stoploss || this.prediction.short_stoploss)
      );
    },

    // 是否有事件
    hasEvent() {
      return (
        this.prediction &&
        this.prediction.events &&
        this.prediction.events !== 'none' &&
        Math.abs(this.predictionData.market_score || 0) >= 0.15
      );
    },

    // 是否应该显示预测建议
    shouldShowPrediction() {
      if (!this.prediction || !this.predictionData.market_score) {
        return false;
      }
      // 如果有事件，不显示预测建议
      if (this.hasEvent) {
        return false;
      }
      return Math.abs(this.predictionData.market_score) >= 0.15;
    },
  },
  mounted() {
    this.fetchPrediction();
    // 每分钟更新时间
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
    
    // 每秒更新倒计时
    this.countdownInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    async fetchPrediction() {
      this.loading = true;
      this.error = false;

      try {
        // 使用 Nuxt runtimeConfig 获取后端API配置
        const config = useRuntimeConfig();
        const baseUrl = config.public.strapiApiUrl || 'https://api.dashpull.com';
        const token = config.public.strapiApiToken;

        // 获取今天的日期
        const today = new Date().toISOString().split("T")[0];

        // 使用新的统计接口
        const endpoint = `${baseUrl}/api/human-predicts-statistics`;
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // 如果有token，添加到headers中
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // 直接调用新的统计接口
        const response = await $fetch(endpoint, {
          method: "GET",
          headers
        });

        if (response && response.predictions && response.predictions.length > 0) {
          // 从预测数据中找到今天的数据
          const todayPrediction = response.predictions.find(p => p.day === today);
          this.prediction = todayPrediction || null;
        } else {
          this.prediction = null;
        }
      } catch (err) {
        console.error("Failed to fetch prediction:", err);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatTimeUntilPrediction() {
      const beijingTime = new Date(
        this.currentTime.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }),
      );
      const currentHour = beijingTime.getHours();
      const currentMinute = beijingTime.getMinutes();
      const currentSecond = beijingTime.getSeconds();

      if (currentHour < 20) {
        const hoursUntil = 19 - currentHour;
        const minutesUntil = 59 - currentMinute;
        const secondsUntil = 60 - currentSecond;

        if (this.$i18n.locale === "zh") {
          return `${hoursUntil}时${minutesUntil}分${secondsUntil}秒`;
        } else {
          return `${hoursUntil}h ${minutesUntil}m ${secondsUntil}s`;
        }
      }

      return "";
    },

    // 事件翻译方法
    translateEvent(eventKey) {
      return this.$t(`predictions.events.${eventKey}`, eventKey);
    },

    goToPredictionHistory() {
      // 根据当前语言构建正确的路由路径
      const localePath = useLocalePath();
      this.$router.push(localePath("/prediction-history"));
    },
  },
};
</script>

<style scoped>
.prediction-banner {
  min-height: auto;
}

@media (max-width: 768px) {
  .prediction-banner .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .prediction-banner .justify-between {
    justify-content: center;
    text-align: center;
  }
  
  .prediction-banner .max-w-5xl,
  .prediction-banner .max-w-6xl {
    max-width: 100%;
  }
}
</style>
