<template>
  <div
    :class="
      windowWidth <= 710
        ? 'occurrent_wrapper__background--touch_device'
        : 'occurrent_wrapper__background'
    "
    height="425"
    @click="goToCurrentNews(occurrentData.slug, occurrentData.title)"
  >
    <div class="occurrent_wrapper">
      <div class="occurrent__img">
        <div
          class="occurrent__major"
          :style="`background-color: ${occurrentData.category.color_hex}`"
        >
          {{ occurrentData.category.title }}
        </div>
        <img :src="occurrentData.poster.original_url" alt="" />
      </div>

      <div class="occurrent__info">
        <div class="occurrent__date">
          <span>{{ getDateFromString(occurrentData.published_at) }}</span>
        </div>

        <div class="occurent_content_wrapper">
          <Heading v-if="occurrentData.title.length >= 45" level="5"
            >{{ occurrentData.title.slice(0, 45) }}...</Heading
          >
          <Heading v-else level="5">{{ occurrentData.title }}</Heading>
          <div
            v-if="occurrentData.description.length >= 50"
            class="occurent_content__text"
          >
            {{ occurrentData.description.slice(0, 50) }}...
          </div>
          <div v-else class="occurent_content__text">
            {{ occurrentData.description }}
          </div>
        </div>

        <!-- {{ occurrentData }} -->
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: { Heading },
  props: {
    occurrentData: {
      type: Object,
      required: true,
    },
    windowWidth: {
      type: Number,
      default: 711,
    },
  },
  data() {
    return { getDateFromString };
  },
  computed: {
    ...mapGetters(['getSelectedLanguage']),
  },
  mounted() {},
  methods: {
    goToCurrentNews(slug, title) {
      if (this.$route.params.slug !== slug) {
        this.$router.push({
          name: 'current-news',
          params: { slug: slug, title: title },
        });

        this.$emit('fetchCurrentNewsBySlug');
      }
    },
  },
};
</script>
<style lang="sass">
.occurrent_wrapper__background
  background-color: #6951FF
  cursor: pointer
  @include s
    max-width: 335px
  @media screen and (max-width: 768px)
    width: 100%
    max-width: 335px

.occurrent_wrapper__background:nth-child(odd)
  @include s
    justify-self: end

.occurrent_wrapper__background:nth-child(odd),
.occurrent_wrapper__background:nth-child(even)
  @include xs
    justify-self: center

.occurrent_wrapper__background:hover .occurrent_wrapper
  outline: 1px solid #6951FF
  transform: translate(8px, -8px)
  @include s
    outline: none
    transform: none

.occurrent_wrapper__background--touch_device:hover .occurrent_wrapper
  transform: translate(0px, 0px)

.occurrent_wrapper
  width: 100%
  background: var(--color-white)
  border: 1px solid var(--color-border)

.occurrent_wrapper__background--touch_device .occurrent_wrapper
  margin: 0 14px
  border: 1px solid var(--color-border)
  @include xs
    margin: 0

.occurrent__img
  position: relative
  img
    width: 100%
    height: 250px
    object-fit: cover

.pro-courses .occurrent__img img
  @include s
    height: 143px
  @include xs
    height: 180px
    width: 100%
    max-width: 334px
.occurrent__info
  padding: 16px 24px 28px
  height: 170px

.pro-courses .occurrent__info
  height: 175px
  @include s
    height: 150px
    @include xs
      height: 172px
.occurrent__info .title.title--5
  @include adaptive-font-size(20, 18, 16)
  @include adaptive-line-height(28, 24, 20)
  padding-top: 0px

.pro-courses .occurrent__info .title.title--5
  font-size: 20px
  @include s
    font-size: 14px
    font-weight: 600
    line-height: 20px
    @include xs
      font-size: 18px
      font-weight: 600
      line-height: 24px

.pro-courses .occurrent__date
  @include s
  margin-bottom: 8px
  font-size: 10px
  font-weight: 400
  line-height: 13px
  @include xs
    font-size: 14px
    line-height: 18px

.occurrent__date
  margin-bottom: 13px
  color: var(--color-font-light-dark)
  span
    @include adaptive-font-size(14, 14, 12)
    @include adaptive-line-height(18, 18, 15)

.occurrent__major
  position: absolute
  right: 16px
  top: 16px
  padding: 6px 24px
  background-color: #DBD5FF
  @include adaptive-font-size(18, 18, 14)
  @include adaptive-line-height(32, 32, 18)

.pro-courses .occurrent__major
  @include s
    padding: 0px 9px
    font-size: 13px
    font-weight: 400
    line-height: 23px

.occurrent__major.news
  color: var(--color-business-font)
  background-color: #D8F4D9

.occurent_content_wrapper
  display: flex
  justify-content: space-between
  flex-direction: column

.occurent_content_wrapper .title--5
  padding-bottom: 8px
  @include xxs
    font-size: 16px

.occurent_content__text
  font-weight: 300
  @include adaptive-font-size(16, 16, 14)
  @include adaptive-line-height(22, 22, 18)

.pro-courses .occurent_content__text
  font-size: 16px
  @include s
    font-size: 11px
    font-weight: 400
    line-height: 16px
    @include xs
      font-size: 16px
      font-weight: 400
      line-height: 22px
</style>
