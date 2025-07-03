<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

const columns = computed(() => [{
  label: t('nav.screeners'),
  children: [{
    label: t('screeners.growth.title'),
    to: localePath('/screeners/growth')
  }, {
    label: t('screeners.momentum.title'),
    to: localePath('/screeners/momentum')
  }, {
    label: t('screeners.dividend.title'),
    to: localePath('/screeners/dividend')
  }, {
    label: t('screeners.value.title'),
    to: localePath('/screeners/value')
  }]
}, {
  label: t('footer.platform'),
  children: [{
    label: t('nav.predictions'),
    to: localePath('/predictions')
  }, {
    label: t('screeners.title'),
    to: localePath('/screeners')
  }, {
    label: t('nav.plans'),
    to: localePath('/plans')
  }]
}, {
  label: t('footer.resources'),
  children: [{
    label: t('nav.blog'),
    to: localePath('/blog')
  }, {
    label: t('footer.docs'),
    to: localePath('/docs')
  }]
}])

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator
    icon="i-simple-icons-nuxtdotjs"
    class="h-px"
  />
  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Enter your email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        to="https://x.com/dashpull"
        target="_blank"
        icon="i-simple-icons-x"
        aria-label="X"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
