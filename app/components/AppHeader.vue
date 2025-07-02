<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const items = computed(() => [{
  label: t('nav.docs'),
  to: localePath('/docs'),
  active: route.path.startsWith('/docs')
}, {
  label: t('nav.pricing'),
  to: localePath('/pricing')
}, {
  label: t('nav.about'),
  to: localePath('/about')
}, {
  label: t('nav.blog'),
  to: localePath('/blog')
}])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <LogoPro class="w-auto h-6 shrink-0" />
      </NuxtLink>
      <TemplateMenu />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <LanguageSwitcher />
      <UColorModeButton />
      <UButton
        :label="t('auth.login')"
        color="neutral"
        variant="ghost"
        :to="localePath('/login')"
      />
      <UButton
        :label="t('auth.register')"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:flex"
        :to="localePath('/signup')"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <div class="flex justify-between items-center mb-6">
        <span class="text-sm text-gray-500">{{ t('common.language') }}</span>
        <LanguageSwitcher />
      </div>

      <UButton
        :label="t('auth.login')"
        color="neutral"
        variant="subtle"
        :to="localePath('/login')"
        block
        class="mb-3"
      />
      <UButton
        :label="t('auth.register')"
        color="neutral"
        :to="localePath('/signup')"
        block
      />
    </template>
  </UHeader>
</template>
