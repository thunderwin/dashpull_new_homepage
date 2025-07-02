<script setup lang="ts">
const { locale, defaultLocale } = useI18n()
const route = useRoute()

// 获取URL中的slug参数
const slug = route.params.slug as string

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

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', post.path, {
    fields: ['description']
  })
})

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

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
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
