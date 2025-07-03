<script setup>
const { locale } = useI18n();
const route = useRoute()
const localePath = useLocalePath()

// 根据当前 locale 查询对应语言的 blog 配置
const { data: page } = await useAsyncData(
  () => `blog-${locale.value}`, 
  () => queryCollection('blog')
    .where('locale', '=', locale.value)
    .first()
)

// 查询对应语言的博客文章，使用 locale 字段
const { data: posts } = await useAsyncData(
  () => `posts-${locale.value}`, 
  () => queryCollection('posts')
    .where('locale', '=', locale.value)
    .all()
)

// 处理博客文章路径
const getBlogPostPath = (postPath) => {
  if (!postPath) return '#'
  
  // 对于英文，去掉 /en 前缀
  if (locale.value === 'en') {
    return postPath.replace(/^\/en/, '')
  }
  
  // 其他语言直接使用原路径
  return postPath
}

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <UContainer>
    <!-- <UPageHeader
      v-bind="page"
      class="py-[50px]"
    /> -->

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="getBlogPostPath(post.path)"
          :title="post.title"
          :description="post.description"
          :image="post.image"
          :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
          :authors="post.authors"
          :badge="post.badge"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
