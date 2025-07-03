<template>
  <UCard class="prediction-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="flex items-center space-x-4">
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-8 w-8 text-primary animate-spin"
        />
        <span class="text-xl font-semibold text-gray-600 dark:text-gray-300">
          {{ $t("prediction_component.loading") }}
        </span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-10">
      <div class="flex flex-col items-center space-y-6">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="h-16 w-16 text-red-500"
        />
        <div class="space-y-4">
          <p class="text-xl font-semibold text-red-600 dark:text-red-400">
            {{ $t("prediction_component.error") }}
          </p>
          <UButton
            @click="fetchPrediction"
            color="primary"
            size="lg"
            :loading="loading"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" />
            </template>
            {{ $t("common.refresh") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- 预测还未发布 (北京时间8点前) -->
    <div v-else-if="!isPredictionTime" class="text-center py-10">
      <div class="flex flex-col items-center space-y-6">
        <div class="relative">
          <div
            class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center"
          >
            <UIcon name="i-heroicons-clock" class="h-10 w-10 text-primary" />
          </div>
          <div
            class="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
          >
            <UIcon name="i-heroicons-bell" class="h-3 w-3 text-white" />
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t("prediction_component.no_prediction_yet") }}
          </h3>
          <UBadge
            color="amber"
            variant="soft"
            size="lg"
            class="text-lg px-6 py-3 font-semibold"
          >
            {{ formatTimeUntilPrediction() }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- 显示预测结果 - 居中显眼布局 -->
    <div v-else-if="prediction && shouldShowPrediction" class="py-8">
      <!-- 主要预测信息 - 居中显示 -->
      <div class="text-center mb-8">
        <!-- 预测圆圈 - 更大更显眼 -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div
              :class="[
                'flex items-center justify-center w-28 h-28 rounded-full text-white shadow-xl transform transition-all duration-300 hover:scale-105',
                prediction.side === 'long'
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/40'
                  : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/40',
              ]"
            >
              <UIcon
                :name="
                  prediction.side === 'long'
                    ? 'i-heroicons-arrow-trending-up'
                    : 'i-heroicons-arrow-trending-down'
                "
                class="h-12 w-12"
              />
            </div>
            <!-- 脉冲动画环 -->
            <div
              :class="[
                'absolute inset-0 rounded-full animate-ping opacity-30',
                prediction.side === 'long' ? 'bg-green-400' : 'bg-red-400',
              ]"
            ></div>
          </div>
        </div>

        <!-- 预测方向 - 大标题 -->
        <div class="mb-6">
          <UBadge
            :color="prediction.side === 'long' ? 'green' : 'red'"
            variant="soft"
            size="lg"
            class="text-2xl font-bold px-8 py-4 mb-3"
          >
            {{
              prediction.side === "long"
                ? $t("prediction_component.side_long")
                : $t("prediction_component.side_short")
            }}
          </UBadge>
          <p class="text-lg font-medium text-gray-600 dark:text-gray-300">
            {{ $t("prediction_component.current_prediction") }}
          </p>
        </div>
      </div>

      <!-- 合并后的市场评分卡片 -->
      <div class="flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200/60 dark:border-blue-800/60 rounded-xl px-8 py-5 text-center shadow-lg max-w-xl mx-auto mb-8">
        <UIcon name="i-heroicons-chart-bar-square" class="h-8 w-8 text-blue-600 mr-3" />
        <span class="text-xl font-bold text-blue-800 dark:text-blue-200 mr-6">
          {{ $t("prediction_component.market_score") }}
        </span>
        <div class="flex items-end mr-4">
          <span class="text-4xl font-black text-blue-900 dark:text-blue-100 leading-none">{{ predictionData.market_score }}</span>
        </div>
        <UBadge 
          :color="Math.abs(predictionData.market_score) >= 0.2 ? 'green' : 'amber'" 
          variant="soft"
          size="lg"
          class="text-lg font-bold px-4 py-2"
        >
          {{ Math.abs(predictionData.market_score) >= 0.2 ? '强势' : '温和' }}
        </UBadge>
      </div>

      <!-- 止损信息 - 如果有的话 -->
      <div v-if="hasStopLoss" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-if="prediction.long_stoploss"
          class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200/60 dark:border-green-800/60 rounded-xl p-6 text-center shadow-lg"
        >
          <div class="flex items-center justify-center space-x-2 mb-3">
            <UIcon
              name="i-heroicons-shield-check"
              class="h-6 w-6 text-green-600"
            />
            <span
              class="text-lg font-bold text-green-800 dark:text-green-200"
            >
              多头止损
            </span>
          </div>
          <div class="text-2xl font-black text-green-900 dark:text-green-100">
            {{ prediction.long_stoploss }}
          </div>
        </div>

        <div
          v-if="prediction.short_stoploss"
          class="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-red-200/60 dark:border-red-800/60 rounded-xl p-6 text-center shadow-lg"
        >
          <div class="flex items-center justify-center space-x-2 mb-3">
            <UIcon
              name="i-heroicons-shield-exclamation"
              class="h-6 w-6 text-red-600"
            />
            <span class="text-lg font-bold text-red-800 dark:text-red-200">
              空头止损
            </span>
          </div>
          <div class="text-2xl font-black text-red-900 dark:text-red-100">
            {{ prediction.short_stoploss }}
          </div>
        </div>
      </div>

      <!-- 最后更新时间 -->
      <div
        class="text-center pt-6 border-t-2 border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex items-center justify-center space-x-3 text-base font-medium text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-heroicons-clock" class="h-5 w-5" />
          <span
            >{{ $t("common.last_updated") }}:
            {{ formatDate(prediction.day) }}</span
          >
        </div>
      </div>
    </div>

    <!-- 没有建议状态 - 居中布局 -->
    <div
      v-else-if="prediction && !shouldShowPrediction"
      class="text-center py-10"
    >
      <div class="max-w-lg mx-auto space-y-6">
        <div
          class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto"
        >
          <UIcon
            name="i-heroicons-minus-circle"
            class="h-10 w-10 text-gray-400"
          />
        </div>

        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {{ $t("prediction_component.no_suggestion") }}
          </h3>
          <p class="text-lg text-gray-500 dark:text-gray-400">
            {{ $t("prediction_component.market_score_too_low") }}
          </p>

          <!-- 市场评分显示 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div class="text-center">
              <div class="flex items-center justify-center space-x-3 mb-3">
                <UIcon
                  name="i-heroicons-chart-bar-square"
                  class="h-6 w-6 text-gray-500"
                />
                <span
                  class="text-lg font-bold text-gray-600 dark:text-gray-300"
                >
                  {{ $t("prediction_component.market_score") }}
                </span>
              </div>
              <div class="text-3xl font-black text-gray-900 dark:text-white">
                {{ predictionData.market_score }}
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>

    <!-- 无数据状态 - 居中布局 -->
    <div v-else class="text-center py-10">
      <div class="flex flex-col items-center space-x-4">
        <div
          class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4"
        >
          <UIcon
            name="i-heroicons-document-magnifying-glass"
            class="h-10 w-10 text-gray-400"
          />
        </div>
        <p class="text-xl font-semibold text-gray-600 dark:text-gray-300">
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

    // 是否应该显示预测建议
    shouldShowPrediction() {
      if (!this.prediction || !this.predictionData.market_score) {
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
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    async fetchPrediction() {
      this.loading = true;
      this.error = false;

      try {
        const config = useRuntimeConfig();

        // 获取今天的日期
        const today = new Date().toISOString().split("T")[0];

        // 构建Strapi API URL和查询参数
        const baseUrl = "https://api.dashpull.com";
        const endpoint = `${baseUrl}/api/human-predicts`;

        const searchParams = new URLSearchParams({
          "filters[day][$eq]": today,
          sort: "day:desc",
          "pagination[limit]": "1",
          populate: "*",
        });

        const fullUrl = `${endpoint}?${searchParams.toString()}`;

        // 直接调用Strapi API
        const response = await $fetch(fullUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer d500bca2021bcb781b01959a2b5c7eca35104ead14e5a1c7a113e1b77030a9d798e3d0ea3be290c20050d000ac5d7c6cc021e57eda01e40b3c545e2d8da2b6c4b75ead96fa5e3ac2cae31ae76de74415371a7928094e271535d1ef786a1f2216e745df26d4aacf85021f5b86c9f2fe92644a9fa5a1f9d63699e43340409661ff`,
          },
        });

        if (response && response.data && response.data.length > 0) {
          this.prediction = response.data[0].attributes;
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

      if (currentHour < 20) {
        const hoursUntil = 20 - currentHour;
        const minutesUntil = 60 - beijingTime.getMinutes();

        if (this.$i18n.locale === "zh") {
          return `距离预测发布还有 ${hoursUntil} 小时 ${minutesUntil} 分钟`;
        } else {
          return `${hoursUntil} hours ${minutesUntil} minutes until prediction`;
        }
      }

      return "";
    },

    goToPredictionHistory() {
      // 根据当前语言构建正确的路由路径
      const localePath = useLocalePath();
      this.$router.push(localePath("/prediction-history"));
    },
  },
};
</script>
