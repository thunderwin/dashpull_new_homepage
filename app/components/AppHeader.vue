<script setup>
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const items = computed(() => [{
  label: t('nav.predictions'),
  to: localePath('/predictions'),
  active: route.path.startsWith('/predictions')
}
// , {
//   label: t('nav.screeners'),
//   to: localePath('/screeners'),
//   active: route.path.startsWith('/screeners'),
//   children: [{
//     label: t('screeners.growth.title'),
//     to: localePath('/screeners/growth')
//   }, {
//     label: t('screeners.momentum.title'),
//     to: localePath('/screeners/momentum')
//   }, {
//     label: t('screeners.dividend.title'),
//     to: localePath('/screeners/dividend')
//   }, {
//     label: t('screeners.value.title'),
//     to: localePath('/screeners/value')
//   }]
// }
// ,
,{
  label: t('nav.plans'),
  to: localePath('/plans'),
  active: route.path.startsWith('/plans')
}
, {
  label: t('nav.guide'),
  to: localePath('/blog/dashpull-trading-guide')
}, {
  label: t('nav.about'),
  to: localePath('/blog/about-dashpull-journey')
}, {
  label: t('nav.blog'),
  to: localePath('/blog')
}])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink :to="localePath('/')">
        <UColorModeImage
          class="w-auto h-10 shrink-0"
          light="/logo/dashpull_logo.svg"
          dark="/logo/dashpull_logo_light.svg"
          alt="DashPull Logo"
        />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <LanguageSwitcher />
      <!-- <UColorModeButton /> -->
      <!-- 
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
      -->
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

      <!-- 
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
      -->
    </template>
  </UHeader>
</template>
