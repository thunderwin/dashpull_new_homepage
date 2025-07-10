<template>
  <div v-if="locale !== 'en'" class="relative w-full">
    <UPageCard variant="subtle" class="rounded-2xl">
      <video 
        class="w-full h-auto rounded-xl" 
        preload="auto" 
        :controls="true"
        autoplay
        loop
      >
        <source
          src="https://img.dashpull.com/helper-dashpull.mp4"
          type="video/mp4"
        />
      </video>
    </UPageCard>
  </div>
</template>

<script setup>
const { locale } = useI18n()
</script>
