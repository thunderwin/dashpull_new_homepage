<script setup>
const { locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

// 获取URL中的slug参数
const slug = route.params.slug

// 查询对应语言的博客文章，使用locale筛选
const { data: posts } = await useAsyncData(`posts-${locale.value}`, () => 
  queryCollection('posts')
    .where('locale', '=', locale.value)
    .all()
)

// 从结果中找到包含slug的文章
const post = posts.value?.find(p => p.path.includes(slug))

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

// 处理博客文章路径，移除语言前缀
const getBlogPostPath = (postPath) => {
  if (!postPath) return '#'
  // 移除路径开头的语言前缀 (/en, /zh, /zh-Hant)
  const cleanPath = postPath.replace(/^\/(en|zh|zh-Hant)/, '')
  
  // 对于默认语言（英文），直接返回清理后的路径
  if (locale.value === 'en') {
    return cleanPath
  }
  
  // 对于其他语言，使用localePath生成带语言前缀的链接
  return localePath(cleanPath)
}

// 查询当前语言的所有文章来生成相关文章
const currentIndex = posts.value?.findIndex(p => p.path === post.path) || 0
const relatedPosts = []

// 获取前一篇文章
if (currentIndex > 0 && posts.value && posts.value[currentIndex - 1]) {
  const prevPost = posts.value[currentIndex - 1]
  relatedPosts.push({
    ...prevPost,
    _path: getBlogPostPath(prevPost.path),
    title: prevPost.title,
    description: prevPost.description
  })
} else {
  relatedPosts.push(null)
}

// 获取后一篇文章
if (currentIndex < (posts.value?.length || 0) - 1 && posts.value && posts.value[currentIndex + 1]) {
  const nextPost = posts.value[currentIndex + 1]
  relatedPosts.push({
    ...nextPost,
    _path: getBlogPostPath(nextPost.path),
    title: nextPost.title,
    description: nextPost.description
  })
} else {
  relatedPosts.push(null)
}

const title = post.title
const description = post.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

if (post.image?.src) {
  defineOgImage({
    url: post.image.src
  })
} else {
  defineOgImageComponent('Saas', {
    headline: 'Blog'
  })
}
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader
      :title="post.title"
      :description="post.description"
    >
      <template #headline>
        <UBadge
          v-bind="post.badge"
          variant="subtle"
        />
        <span class="text-(--ui-text-muted)">&middot;</span>
        <time class="text-(--ui-text-muted)">{{ new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in post.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer
          v-if="post"
          :value="post"
        />

        <USeparator v-if="relatedPosts.some(item => item !== null)" />

        <!-- 自定义的上一篇/下一篇导航，样式模仿UContentSurround -->
        <div v-if="relatedPosts.some(item => item !== null)" class="grid gap-8 sm:grid-cols-2">
          <!-- 上一篇文章 -->
          <div v-if="relatedPosts[0]" class="group">
            <NuxtLink :to="relatedPosts[0]._path" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <UIcon name="i-lucide-arrow-left" class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors flex-shrink-0" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ relatedPosts[0].title }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{{ relatedPosts[0].description }}</div>
              </div>
            </NuxtLink>
          </div>
          
          <!-- 占位符，如果没有上一篇 -->
          <div v-else></div>

          <!-- 下一篇文章 -->
          <div v-if="relatedPosts[1]" class="group">
            <NuxtLink :to="relatedPosts[1]._path" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div class="min-w-0 text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ relatedPosts[1].title }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{{ relatedPosts[1].description }}</div>
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors flex-shrink-0" />
            </NuxtLink>
          </div>
        </div>
      </UPageBody>

      <template
        v-if="post?.body?.toc?.links?.length"
        #right
      >
      
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
