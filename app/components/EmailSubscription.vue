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
                autocomplete="email"
                type="email"
                name="email"
              />
              <UButton
                type="button"
                :loading="loading"
                :disabled="loading || !isValidEmail"
                class="px-10 py-4 text-lg"
                color="primary"
                size="xl"
                @click="handleSubmit"
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
              autocomplete="email"
              type="email"
              name="email"
            />
            <UButton
              type="button"
              :loading="loading"
              :disabled="loading || !isValidEmail"
              class="w-full py-4 text-lg mt-4 text-center"
              color="primary"
              size="xl"
              @click="handleSubmit"
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

// 表单验证Schema - 使用计算属性确保翻译可用
const schema = computed(() => z.object({
  email: z.string().min(1, t('email_subscription.validation.required') || '请输入邮箱地址').email(t('email_subscription.validation.email') || '请输入有效的邮箱地址')
}))

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
const handleSubmit = async (data = null) => {
  loading.value = true
  error.value = ''
  showSuccess.value = false

  console.log('表单提交数据:', data)
  console.log('当前state:', state)

  try {
    // 直接使用state中的email，不依赖表单传递的data
    const emailToSubmit = state.email?.trim()
    
    if (!emailToSubmit) {
      error.value = '请输入邮箱地址'
      loading.value = false
      return
    }

    // 手动验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToSubmit)) {
      error.value = '请输入有效的邮箱地址'
      loading.value = false
      return
    }

    // 获取客户端信息
    const userAgent = navigator.userAgent
    const referrer = document.referrer
    
    // 构建API请求数据 - 简化结构避免验证错误
    const requestData = {
      data: {
        email: emailToSubmit,
        status: 'pending',
        source: 'website',
        language: locale.value || 'zh'
      }
    }

    // 调用Strapi API
    const baseUrl = config.public.strapiApiUrl || 'https://api.dashpull.com'
    const endpoint = `${baseUrl}/api/email-subscriptions`
    
    console.log('API请求详情:', {
      endpoint,
      requestData,
      token: config.public.strapiApiToken ? '已配置' : '未配置'
    })
    
    // 如果API有问题，可以暂时启用下面的模拟响应并注释真实API调用
    // const response = { data: { id: 1, email: data.email } }
    
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
    console.error('Error details:', {
      status: err.status,
      statusCode: err.statusCode, 
      data: err.data,
      message: err.message
    })
    
    // 处理不同类型的错误
    if (err.status === 400 || err.statusCode === 400) {
      // 检查是否是Strapi的验证错误
      if (err.data?.error?.details?.errors) {
        const validationErrors = err.data.error.details.errors
        const uniqueError = validationErrors.find(e => 
          e.message?.includes('unique') || 
          e.message?.includes('must be unique') ||
          e.path?.includes('email')
        )
        
        if (uniqueError) {
          error.value = t('email_subscription.error.duplicate')
        } else {
          error.value = '输入数据验证失败，请检查邮箱格式'
        }
      } else if (err.data?.error?.message?.includes('unique')) {
        error.value = t('email_subscription.error.duplicate')
      } else if (err.data?.error?.message) {
        error.value = err.data.error.message
      } else {
        error.value = '请求数据格式错误，请检查邮箱格式'
      }
    } else if (err.status === 401 || err.statusCode === 401) {
      error.value = 'API认证失败，请联系管理员'
    } else if (err.status === 409 || err.statusCode === 409) {
      error.value = t('email_subscription.error.duplicate')
    } else if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
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
  height: 60px !important;
  font-size: 18px !important;
  padding: 12px 16px 12px 48px !important;
  line-height: 1.5 !important;
}

.large-input-mobile :deep(.absolute) {
  height: 60px !important;
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