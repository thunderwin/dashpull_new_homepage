<script setup lang="ts">
useSeoMeta({
  title: '关于我们 - 青岛麦神网络有限公司发展历程',
  ogTitle: '关于我们 - 青岛麦神网络有限公司发展历程', 
  description: '了解青岛麦神网络有限公司从创立到发展成为专业电子商务解决方案提供商的历程',
  ogDescription: '了解青岛麦神网络有限公司从创立到发展成为专业电子商务解决方案提供商的历程'
})

defineOgImageComponent('Saas')

const timelineItems = ref([
  {
    date: '创业初期',
    title: '团队成立',
    description: '青岛麦神网络有限公司开始于一个团队，主要由国内首批接触Magento的程序员组成。开始时并没有中文名字，以英文名"Mygod Commerce"长期为海外客户提供Magento开发外包服务，那时还是基于Magento 1.4。',
    icon: 'i-lucide-users',
    color: 'primary'
  },
  {
    date: '2011年',
    title: '进入国内市场',
    description: '随着Magento系统在国内逐渐知名，我们开始进入国内市场，为中国企业提供专业的电子商务解决方案。',
    icon: 'i-lucide-map-pin',
    color: 'blue'
  },
  {
    date: '2012年',
    title: '公司正式成立',
    description: '青岛麦神网络有限公司正式成立，开始正式化运营，公司开始有了中文名字"麦神"，标志着我们在中国市场的正式起步。',
    icon: 'i-lucide-building',
    color: 'green'
  },
  {
    date: '2012年4月',
    title: '团队实力大增',
    description: '同样位于青岛的Rocket-internet（国际知名的电子商务技术公司）解散，部分技术人员加入麦神电子商务，我们实力大增，开始向专业的企业级市场迈进。',
    icon: 'i-lucide-rocket',
    color: 'orange'
  },
  {
    date: '2012年5月',
    title: '推出专用服务器',
    description: '推出电子商务专用服务器 www.lanpx.com，为客户提供更专业的托管服务。',
    icon: 'i-lucide-server',
    color: 'purple'
  },
  {
    date: '2013年2月',
    title: '移动端技术突破',
    description: '麦神电子商务在移动设备端技术积累完成，推出麦神移动电子商务，开始提供移动端购物应用，让客户的网站登录苹果商城和Android商城。',
    icon: 'i-lucide-smartphone',
    color: 'pink'
  },
  {
    date: '2013年5月',
    title: 'Lanpx 极速级上线',
    description: '推出Lanpx 极速级，是当时市场上最快的Magento系统，为客户提供更优秀的性能体验。',
    icon: 'i-lucide-zap',
    color: 'yellow'
  },
  {
    date: '2013年6月',
    title: '获得官方认证',
    description: '公司的程序员首次通过美国Magento公司的开发者认证，标志着我们的技术实力得到国际认可。',
    icon: 'i-lucide-award',
    color: 'emerald'
  },
  {
    date: '2013年12月',
    title: '海外业务扩展',
    description: '公司新英文网站上线 www.mygodtechnologies.com 以应对海外的客户需求，正式开启国际化服务。',
    icon: 'i-lucide-globe',
    color: 'teal'
  },
  {
    date: '2014年2月',
    title: '团队规模翻倍',
    description: '公司技术人员扩大一倍到10人，已经达到中型IT公司水准，为更大规模的项目提供支持。',
    icon: 'i-lucide-users-2',
    color: 'cyan'
  },
  {
    date: '2014年5月',
    title: '推广部门成立',
    description: '公司推广部门成立，以便为客户提供更多支持，从单纯的技术服务扩展到全方位的营销服务。',
    icon: 'i-lucide-megaphone',
    color: 'indigo'
  },
  {
    date: '2014年6月',
    title: 'PayPal合作伙伴',
    description: '公司正式成为PayPal中国区合作伙伴，为客户提供更完善的支付解决方案。',
    icon: 'i-lucide-credit-card',
    color: 'violet'
  },
  {
    date: '2014年7月',
    title: '上海办事处成立',
    description: '上海办事处成立，标志着公司开始在华东地区建立业务据点，服务网络进一步扩大。',
    icon: 'i-lucide-building-2',
    color: 'rose'
  },
  {
    date: '2016年3月',
    title: '苏州办事处成立',
    description: '苏州办事处成立，进一步完善了我们在长三角地区的服务网络，为更多客户提供就近服务。',
    icon: 'i-lucide-map',
    color: 'amber'
  }
])
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UPageHero 
      title="关于我们" 
      description="青岛麦神网络有限公司发展历程"
    >
      <template #top>
        <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>
    </UPageHero>

    <!-- Company Story Section -->
    <UContainer>
      <UPageSection>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            从创业团队到行业领先
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            青岛麦神网络有限公司是国内最早一批专注于Magento电子商务系统的专业公司，
            从2011年开始为中国企业提供世界级的电子商务解决方案。
          </p>
        </div>

        <!-- Custom Timeline -->
        <div class="max-w-4xl mx-auto">
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            <!-- Timeline items -->
            <div class="space-y-8">
              <div 
                v-for="(item, index) in timelineItems" 
                :key="index"
                class="relative flex items-start md:items-center"
                :class="[
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                ]"
              >
                <!-- Timeline dot -->
                <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center">
                  <UBadge
                    :color="item.color"
                    variant="solid"
                    size="lg"
                    class="p-2 rounded-full shadow-lg"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4" />
                  </UBadge>
                </div>

                <!-- Content card -->
                <div 
                  class="ml-12 md:ml-0 flex-1"
                  :class="[
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  ]"
                >
                  <UCard class="shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <template #header>
                      <div :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                        <UBadge 
                          :color="item.color" 
                          variant="subtle" 
                          size="sm"
                          class="mb-2"
                        >
                          {{ item.date }}
                        </UBadge>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                          {{ item.title }}
                        </h3>
                      </div>
                    </template>
                    
                    <div :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                      <p class="text-gray-600 dark:text-gray-300">
                        {{ item.description }}
                      </p>
                    </div>
                  </UCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UPageSection>
    </UContainer>

    <!-- Current Status Section -->
    <UPageSection>
      <UContainer>
        <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12">
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              今天的麦神
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-users" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">专业团队</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  由国内首批Magento认证开发者组成的专业团队
                </p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-globe" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">国际视野</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  服务海内外客户，具备丰富的国际化项目经验
                </p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-award" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">行业领先</h4>
                <p class="text-gray-600 dark:text-gray-300">
                  基于全球第一的Magento系统，提供企业级解决方案
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>
  </div>
</template>
