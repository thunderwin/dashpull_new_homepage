<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})

const { locale } = useI18n()
const route = useRoute()

// 获取URL中的slug参数
const slug = route.params.slug as string | string[]
const slugPath = Array.isArray(slug) ? slug.join('/') : slug

// 查询对应语言的文档，使用locale筛选
const { data: docs } = await useAsyncData(`docs-${locale.value}`, () => 
  queryCollection('docs')
    .where('locale', '=', locale.value)
    .all()
)

// 从结果中找到匹配slug的文档
const page = docs.value?.find(doc => {
  // 处理路径匹配，支持多级路径
  const docSlug = doc.path.split('/').slice(-1)[0] // 获取最后一部分作为slug
  const currentSlug = slugPath.split('/').slice(-1)[0] // 获取当前请求的最后一部分
  return doc.path.includes(slugPath) || docSlug === currentSlug
})

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', page.path, {
    fields: ['description']
  })
})

useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
    />

    <UPageBody>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>
