<script setup>
const { locale } = useI18n()
const { data: page } = await useAsyncData(
  () => `plans-${locale.value}`,
  () => queryCollection("plans")
    .where('locale', '=', locale.value)
    .first(),
)

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <div v-if="page">
    <UPageHero v-bind="page.hero" />

    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan
          v-for="(plan, index) in page.plans"
          :key="index"
          v-bind="plan"
          :price="plan.price.month"
          :billing-cycle="plan.billing_cycle"
        >
          <!-- QR Code Section - Only show for the premium plan (index 1) -->
          <template v-if="index === 1 && plan.highlight" #footer>
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="text-center mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ $t('plans.qr_contact_title') }}
                </h4>
              
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <!-- WeChat QR Code -->
                <div class="text-center">
                  <div class="bg-white rounded-lg shadow-sm p-3 mb-2">
                    <img 
                      src="/images/qrcode/wechat.jpg" 
                      alt="WeChat QR Code" 
                      class="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                  <div class="flex items-center justify-center gap-1">
                    <UIcon name="i-lucide-message-circle" class="w-4 h-4 text-green-600" />
                    <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {{ $t('plans.wechat_contact') }}
                    </span>
                  </div>
                </div>

                <!-- WhatsApp QR Code -->
                <div class="text-center">
                  <div class="bg-white rounded-lg shadow-sm p-3 mb-2">
                    <img 
                      src="/images/qrcode/whatsapp.jpg" 
                      alt="WhatsApp QR Code" 
                      class="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                  <div class="flex items-center justify-center gap-1">
                    <UIcon name="i-lucide-message-circle" class="w-4 h-4 text-green-600" />
                    <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {{ $t('plans.whatsapp_contact') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UPricingPlan>
      </UPricingPlans>
    </UContainer>

    <UPageSection>
      <UPageLogos>
        <UIcon
          v-for="icon in page.logos.icons"
          :key="icon"
          :name="icon"
          class="w-12 h-12 flex-shrink-0 text-(--ui-text-muted)"
        />
      </UPageLogos>
    </UPageSection>

    <UPageSection
      :title="page.faq.title"
      :description="page.faq.description"
    >
      <UPageAccordion
        :items="page.faq.items"
        multiple
        class="max-w-4xl mx-auto"
      />
    </UPageSection>
  </div>
</template> 