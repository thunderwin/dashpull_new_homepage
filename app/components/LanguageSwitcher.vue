<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const languages = [
  { code: 'en', name: 'English', icon: 'i-lucide-globe' },
  { code: 'zh', name: '简体中文', icon: 'i-lucide-flag' },
  { code: 'zh-Hant', name: '繁體中文', icon: 'i-lucide-flag' }
]

const currentLanguage = computed(() => 
  languages.find(l => l.code === locale.value) || languages[0]
)

const menuItems = computed(() => 
  languages.map(lang => ({
    label: lang.name,
    icon: lang.icon,
    to: switchLocalePath(lang.code),
    disabled: lang.code === locale.value
  }))
)
</script>

<template>
  <UDropdownMenu :items="menuItems">
    <UButton
      :icon="currentLanguage.icon"
      :label="currentLanguage.name"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>
</template> 