<script setup>
const { locale, defaultLocale } = useI18n();
const route = useRoute();

const { data: page } = await useAsyncData(
  () => `index-${locale.value}`,
  () => queryCollection("index")
    .where('locale', '=', locale.value)
    .first(),
);

useSeoMeta({
  titleTemplate: "",
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description,
});
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      
     
    >
      <template #top>
        <div
          class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80"
        />

        <StarsBg />
      </template>

      <PromotionalVideo />
    </UPageHero>

    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
    >
      <UPageColumns class="xl:columns-4">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="subtle"
        >
          <template #description>
            <div v-html="testimonial.quote"></div>
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <div
        class="absolute rounded-full dark:bg-(--ui-primary) blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80"
      />

      <StarsBg />
    </UPageCTA>
  </div>
</template>
