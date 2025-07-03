<template>
  <div class="relative">
    <UPageCard
      variant="subtle"
      class="rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 border-primary-200 dark:border-primary-800"
    >
      <div class="text-center space-y-6">
        <!-- 标题和描述 -->
        <div class="space-y-3">
          <UIcon 
            name="i-lucide-mail" 
            class="mx-auto h-12 w-12 text-primary-500" 
          />
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ title || $t('email_subscription.title') }}
          </h3>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {{ description || $t('email_subscription.description') }}
          </p>
        </div>

        <!-- 订阅表单 -->
        <UForm 
          :schema="schema" 
          :state="state" 
          @submit="handleSubmit"
          class="max-w-xl mx-auto flex flex-col items-center gap-4"
        >
          <!-- 桌面版：水平布局 -->
          <div class="hidden md:block w-full max-w-lg">
            <UButtonGroup size="xl" class="w-full">
              <UInput
                v-model="state.email"
                :placeholder="$t('email_subscription.email_placeholder')"
                icon="i-lucide-mail"
                size="xl"
                :disabled="loading"
                :color="emailInputColor"
                class="flex-1 large-input"
              />
              <UButton
                type="submit"
                :loading="loading"
                :disabled="loading || !isValidEmail"
                class="px-10 py-4 text-lg"
                color="primary"
                size="xl"
              >
                <template #leading>
                  <UIcon v-if="!loading" name="i-lucide-send" class="h-6 w-6" />
                </template>
                <template #default>
                  <span v-if="!loading">{{ $t('email_subscription.submit_button') }}</span>
                  <span v-else>{{ $t('common.loading') }}</span>
                </template>
              </UButton>
            </UButtonGroup>
          </div>

          <!-- 手机版：垂直布局 -->
          <div class="md:hidden w-full max-w-sm space-y-3">
            <UInput
              v-model="state.email"
              :placeholder="$t('email_subscription.email_placeholder')"
              icon="i-lucide-mail"
              size="xl"
              :disabled="loading"
              :color="emailInputColor"
              class="w-full large-input-mobile"
            />
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading || !isValidEmail"
              class="w-full py-4 text-lg"
              color="primary"
              size="xl"
            >
              <template #leading>
                <UIcon v-if="!loading" name="i-lucide-send" class="h-6 w-6" />
              </template>
              <template #default>
                <span v-if="!loading">{{ $t('email_subscription.submit_button') }}</span>
                <span v-else>{{ $t('common.loading') }}</span>
              </template>
            </UButton>
          </div>
        </UForm>

        <!-- 成功消息 -->
        <div 
          v-if="showSuccess" 
          class="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-600 dark:text-green-400" />
            <p class="text-green-800 dark:text-green-200 font-medium">
              {{ $t('email_subscription.success_message') }}
            </p>
          </div>
        </div>

        <!-- 错误消息 -->
        <div 
          v-if="error" 
          class="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600 dark:text-red-400" />
            <p class="text-red-800 dark:text-red-200 font-medium">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- 额外说明 -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ $t('email_subscription.privacy_note') }}
        </p>
      </div>
    </UPageCard>
  </div>
</template>

<script setup>
import { z } from 'zod'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

// 组合式API
const { t, locale } = useI18n()
const config = useRuntimeConfig()

// 响应式数据
const loading = ref(false)
const error = ref('')
const showSuccess = ref(false)

// 表单状态
const state = reactive({
  email: ''
})

// 表单验证Schema
const schema = z.object({
  email: z.string().email(t('email_subscription.validation.email'))
})

// 实时邮箱格式验证
const isValidEmail = computed(() => {
  if (!state.email) return true // 空值时不显示错误
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(state.email)
})

// 输入框颜色控制
const emailInputColor = computed(() => {
  if (!state.email) return 'primary' // 空值时使用默认颜色
  return isValidEmail.value ? 'primary' : 'red'
})

// 提交处理
const handleSubmit = async (data) => {
  loading.value = true
  error.value = ''
  showSuccess.value = false

  try {
    // 获取客户端信息
    const userAgent = navigator.userAgent
    const referrer = document.referrer
    
    // 构建API请求数据
    const requestData = {
      data: {
        email: data.email,
        subscribe_type: 'newsletter',
        source: 'website',
        language: locale.value,
        status: 'pending',
        verified: false,
        user_agent: userAgent,
        referrer: referrer,
        preferences: {},
        tags: ['website_signup'],
        metadata: {
          signup_page: 'homepage',
          timestamp: new Date().toISOString()
        }
      }
    }

    // 调用Strapi API
    const baseUrl = config.public.strapiApiUrl || 'https://api.dashpull.com'
    const endpoint = `${baseUrl}/api/email-subscriptions`
    
    const response = await $fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.strapiApiToken}`
      },
      body: requestData
    })

    if (response && response.data) {
      showSuccess.value = true
      // 重置表单
      state.email = ''
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    }
  } catch (err) {
    console.error('Failed to subscribe:', err)
    if (err.data?.error?.message) {
      error.value = err.data.error.message
    } else if (err.message?.includes('duplicate')) {
      error.value = t('email_subscription.error.duplicate')
    } else {
      error.value = t('email_subscription.error.general')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 桌面版输入框样式 */
.large-input :deep(input) {
  height: 60px !important;
  font-size: 18px !important;
  padding: 12px 16px 12px 48px !important;
  line-height: 1.5 !important;
}

.large-input :deep(.absolute) {
  height: 60px !important;
  display: flex !important;
  align-items: center !important;
  left: 16px !important;
  top: 0 !important;
  padding: 0 !important;
}

.large-input :deep(svg) {
  width: 20px !important;
  height: 20px !important;
}

/* 手机版输入框样式 */
.large-input-mobile :deep(input) {
  height: 56px !important;
  font-size: 18px !important;
  padding: 12px 16px 12px 48px !important;
  line-height: 1.5 !important;
}

.large-input-mobile :deep(.absolute) {
  height: 56px !important;
  display: flex !important;
  align-items: center !important;
  left: 16px !important;
  top: 0 !important;
  padding: 0 !important;
}

.large-input-mobile :deep(svg) {
  width: 20px !important;
  height: 20px !important;
}

/* 确保按钮组高度一致 */
:deep(.group) {
  height: 60px !important;
}

/* 手机版适配 */
@media (max-width: 768px) {
  .large-input-mobile {
    margin-bottom: 0;
  }
}
</style> 