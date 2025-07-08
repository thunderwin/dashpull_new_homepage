export default defineNuxtPlugin(() => {
  // 捕获 Vue 应用内的错误
  const nuxtApp = useNuxtApp()
  
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.warn('Vue error caught:', error, info)
    
    // 过滤掉一些已知的无害错误
    const errorMessage = error?.message || error?.toString() || ''
    
    if (errorMessage.includes('chrome-extension') ||
        errorMessage.includes('sentry') ||
        errorMessage.includes('Response with null body status') ||
        errorMessage.includes('Cannot read properties of undefined')) {
      return // 静默处理这些错误
    }
    
    // 对于其他错误，记录但不影响用户体验
    console.error('Application error:', error)
  }

  // 捕获全局未处理的 Promise 拒绝
  if (process.client) {
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      
      // 过滤掉一些无害的错误信息
      if (message.includes('chrome-extension') ||
          message.includes('sentry-fee195ad.js') ||
          message.includes('Response with null body status') ||
          message.includes('Cannot read properties of undefined')) {
        return // 不输出这些错误到控制台
      }
      
      originalConsoleError.apply(console, args)
    }
  }
}) 