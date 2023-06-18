<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="current_news__wraper">
    <div class="container">
      <Loader v-if="!currentNews" color="orange" />
      <div v-else class="current_news">
        <div class="current_news__top_caption_wrapper">
          <span
            class="current_news__top_caption"
            :style="`background-color: ${currentNews.category.color_hex}`"
            >{{ currentNews.category.title }}</span
          >
          <span class="current_news__date">{{
            getDateFromString(currentNews.published_at)
          }}</span>
        </div>
        <!-- {{ currentNews }} -->
        <Heading level="3">{{ currentNews.title }}</Heading>
        <div class="current_news__img">
          <img :src="currentNews.poster.article_url" alt="" />
        </div>

        <Heading level="4" class="current_news__subtitle">
          {{ currentNews.description }}
        </Heading>

        <div
          v-for="{ title, content } in currentNews.content_blocks"
          :key="content"
          class="current_news__block"
        >
          <div class="current_news__block_title">
            {{ title }}
          </div>
          <div class="current_news__block_text" v-html="content"></div>
        </div>

        <div class="current_news__socitial_block">
          <div class="modal_socials_block">
            <a href="mailto:support@ilmonline.uz">
              <svg-icon name="send_letter_news" />
            </a>

            <ShareNetwork
              network="telegram"
              :title="currentNews.title"
              :quote="currentNews.title"
              :url="backUrl"
            >
              <svg-icon name="telegram" />
            </ShareNetwork>
            <ShareNetwork
              network="facebook"
              :url="backUrl"
              :quote="currentNews.title"
              :description="currentNews.title"
              :title="currentNews.title"
              hashtags="ilm"
            >
              <svg-icon name="quiz_facebook" />
            </ShareNetwork>
            <ShareNetwork
              network="twitter"
              :url="backUrl"
              :title="currentNews.title"
              hashtags="ilm"
            >
              <!-- :twitter-user="'Yurii'" -->
              <svg-icon name="twitter" />
            </ShareNetwork>
          </div>
        </div>
      </div>
      <div class="similar_news">
        <div class="similar_news__head">
          <Heading level="2">{{ $t('titles.similar_news') }}</Heading>
        </div>
        <div class="similar_news__slider">
          <div slot="button-prev" class="swiper__arrow_prev">
            <svg-icon name="arrow_swipe_left" />
          </div>
          <swiper ref="swiper" class="swiper" :options="swiperOptions">
            <swiper-slide
              v-for="card in popularNews"
              :key="card.id"
              class="swiper_slide news_slide"
            >
              <NewsEventsCard
                :occurrent-data="card"
                class="card_lesson_wrapper"
                @fetchCurrentNewsBySlug="fetchCurrentNewsBySlug"
              />
            </swiper-slide>
          </swiper>
          <div slot="button-next" class="swiper__arrow_next">
            <svg-icon name="arrow_swipe_right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import NewsEventsCard from '@/components/NewsEventsCard/NewsEventsCard.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: { Heading, NewsEventsCard, Loader },
  data() {
    return {
      getDateFromString,

      currentNews: null,
      popularNews: [],
      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 80,
        navigation: {
          prevEl: '.swiper__arrow_prev',
          nextEl: '.swiper__arrow_next',
        },
        breakpoints: {
          1199: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 1,
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters(['getSelectedLanguage']),

    backUrl() {
      return process.env.VUE_APP_HOST + `${this.$route.path}`;
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchSimilarNews() && this.fetchCurrentNewsBySlug();
    },
  },
  async created() {
    this.fetchSimilarNews();
  },

  mounted() {
    this.fetchCurrentNewsBySlug();
  },

  methods: {
    async fetchCurrentNewsBySlug() {
      this.currentNews = await this.$store.dispatch('getNewsBySlug', {
        slug: this.$route.params.slug,
      });

      this.$store.commit('SET_CURR_BREAD_LABEL', {
        current_news_name: this.currentNews.title,
      });
    },

    async fetchSimilarNews() {
      this.popularNews = await this.$store.dispatch('getNewsSimilar');
    },
  },
};
</script>

<style lang="sass" scoped>
.current_news__wraper
  overflow: hidden

.news_slide
  display: flex
  align-items: center
.similar_news
  padding-bottom: 108px
  @include s
    padding-bottom: 50px

.similar_news__head
  padding-bottom: 40px
  @include s
    padding-bottom: 32px

.similar_news__slider
  position: relative

.swiper-slide
  .card_lesson_wrapper
    width: 100%
    margin: 0 auto

.similar_news__slider
  .swiper__arrow_prev,
  .swiper__arrow_next
    display: flex
    align-items: center
    position: absolute
    top: -78px
    z-index: 9

    @include s
      top: -68px

    @media screen and (max-width: 600px)
      top: 50%
      transform: translateY(-50%)
      width: 124px
      height: 98px
      background-color: var(--color-main)
      border-radius: 50%

      .svg-icon
        fill: var(--color-white)

  .swiper__arrow_prev
    right: 48px

    @media screen and (max-width: 600px)
      right: auto
      left: -100px
      padding-right: 8px
      justify-content: flex-end

    @media screen and (max-width: 350px)
      left: -110px
      padding-right: 4px

  .swiper__arrow_next
    right: 0

    @media screen and (max-width: 600px)
      right: -100px
      padding-left: 8px
      overflow: hidden
      position: absolute

    @media screen and (max-width: 350px)
      right: -110px
      padding-left: 4px
      padding-left: 4px

  .swiper__arrow_prev.swiper-button-disabled,
  .swiper__arrow_next.swiper-button-disabled
    @media screen and (max-width: 600px)
      background-color: var(--color-main-light)

.similar_news__head .title
  @include adaptive-font-size(48, 40, 24)
  @include adaptive-line-height(60, 50, 30)
  max-width: 85%

.current_news
  padding: 72px 0 120px
  @include m
    padding: 40px 0 70px
  @include s
    padding: 30px 0 50px

.current_news__top_caption_wrapper
  display: flex
  align-items: center
  padding-bottom: 24px

.current_news__top_caption
  margin-right: 32px
  padding: 8px 24px
  @include adaptive-font-size(18, 18, 14)
  @include adaptive-line-height(32, 32, 18)

  @include s
    margin-right: 24px
  @include xs
    padding: 6px 10px
  @include xxs
    margin-right: 16px

.current_news__date
  color: var(--color-font-light-dark)
  @include adaptive-font-size(18, 16, 15)
  @include adaptive-line-height(23, 20, 20)

.current_news__img
  display: flex
  justify-content: center
  padding: 40px 0 70px
  @include s
    padding: 24px 0 60px
  @include xxs
    padding: 16px 0 36px

.current_news__subtitle
  padding-bottom: 70px
  @include s
    padding-bottom: 16px
  @include xxs
    padding-bottom: 8px

.current_news__block
  display: flex
  @include xxs
    flex-direction: column

.current_news__block_title
  flex: 1 0 30%
  font-weight: 600
  font-size: 20px
  padding-right: 25px
  line-height: 28px
  text-transform: uppercase
  @include s
    font-size: 18px
    line-height: 22px
  @include xs
    font-size: 16px
    line-height: 18px
  @include xxs
    margin-bottom: 16px

.current_news__block_img
  padding-bottom: 65px

.current_news__socitial_block
  display: flex
  justify-content: center
  margin-top: 80px
  padding: 26px 0
  border-top: 1px solid #E8E4E4
  border-bottom: 1px solid #E8E4E4

.modal_socials_block
  display: flex
  max-width: 300px
  width: 100%
  justify-content: center
  gap: 20px

.modal_socials_block svg
  max-width: 40px
  max-height: 40px
</style>
