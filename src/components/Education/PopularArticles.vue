<template>
  <div v-if="getArticlesPopular.length">
    <Loader v-if="!getArticlesPopular.length" color="orange" />
    <div v-else class="popular_container">
      <Heading level="3" class="card_education__subtitle">
        {{ $t('main.popular') }}
      </Heading>
      <div class="similar_news__slider">
        <div slot="button-prev" class="swiper__arrow_prev">
          <svg-icon name="arrow_swipe_left" />
        </div>
        <swiper ref="swiper" class="swiper" :options="swiperOptions">
          <swiper-slide
            v-for="article in getArticlesPopular"
            :key="article.id"
            class="swiper_slide categories__list_item"
            @click.native="
              openDetailCard(
                article.slug,
                article.category.slug,
                article.subcategory.slug
              )
            "
          >
            <img :src="`${article.poster_url}`" />
            <div class="text-content">
              <div class="sub-content">
                <p class="date">
                  {{ formatDate(article.published_at) }}
                </p>
                <div class="like_container">
                  <svg-icon name="like_sign" />
                  <p class="evaluation">
                    {{ article.likes_count }}
                  </p>
                </div>
              </div>
              <h4 class="title">{{ article.title }}</h4>
              <p class="description">{{ article.category.description }}</p>
            </div>
          </swiper-slide>
        </swiper>
        <div slot="button-next" class="swiper__arrow_next">
          <svg-icon name="arrow_swipe_right" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Loader from '@/elements/Loader/Loader';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: {
    Loader,
  },

  data() {
    return {
      getDateFromString,

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
            spaceBetween: 20,
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters(['getSelectedLanguage', 'getArticlesPopular']),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.getPopularArticlesData();
    },
  },

  mounted() {
    this.getPopularArticlesData();
  },

  methods: {
    formatDate(date) {
      return getDateFromString(
        date.slice(0, 10).split('.').reverse().join('-')
      );
    },
    async getPopularArticlesData() {
      await this.$store.dispatch('getPopularArticlesData');
    },
    openDetailCard(slug, category_slug, sub_category_slug) {
      this.$router.push({
        name: 'current-article',
        params: {
          category_slug: sub_category_slug,
          subcategory_slug: category_slug,
          article_slug: slug,
        },
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.popular_container
  margin-right: -16px
  margin-left: -16px
  overflow: hidden
  @include xs
    margin: 0
.like_container
  display: flex
  flex-wrap: wrap
  align-items: center
  svg
    margin-right: 6px
    max-width: 16px

.evaluation
  font-size: 14px
  line-height: 18px

.sub-content
  display: flex
  justify-content: space-between
.card_education__subtitle
  margin-bottom: 60px
  @include xs
    margin-bottom: 32px
    font-size: 24px
.categories__list_item .title
  font-size: 19px
  font-style: normal
  font-weight: 600
  line-height: 28px
  letter-spacing: 0em
  text-align: left
  margin-bottom: 8px
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
  @include m
    font-size: 16px
    line-height: 18px

.categories__list_item .description
  font-size: 16px
  line-height: 22px
  height: 70px

.categories__list
  margin-top: 50px
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin-bottom: 30px

.categories__list_item
  width: 30%
  max-width: 373px
  flex-direction: column
  background-color: white
  margin-bottom: 60px
  cursor: pointer
  .text-content
    background-color: white
    border: 1px solid #D8D8D8
    border-top: none
    //height: 182px
    padding: 16px 35px
    margin-top: -4px

.sub-content
  display: flex
  justify-content: space-between
.card_education__subtitle
  margin-bottom: 60px
  @include xs
    margin-bottom: 32px
    font-size: 24px
.categories__list_item .title
  font-size: 19px
  font-style: normal
  font-weight: 600
  line-height: 28px
  letter-spacing: 0em
  text-align: left
  margin-bottom: 8px
  @include m
    font-size: 16px
    line-height: 18px

.categories__list_item .description
  font-size: 16px
  line-height: 22px

.categories__list
  margin-top: 50px
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin-bottom: 60px

.categories__list_item
  width: 30%
  max-width: 373px
  background-color: white
  margin-bottom: 60px
  cursor: pointer
  .text-content
    background-color: white
    border: 1px solid #D8D8D8
    border-top: none
    //height: 182px
    padding: 16px 35px
    margin-top: -4px
.similar_news
  padding-bottom: 108px
  @include s
    padding-bottom: 50px
.date
  color: #949AA1
  font-size: 14px
.sub-content
  margin-bottom: 12px
.similar_news__head
  padding-bottom: 40px
  @include s
    padding-bottom: 32px

.similar_news__slider
  position: relative

.swiper-slide
  .card_lesson_wrapper
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
      top: 47%
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
      left: -85px
      padding-right: 8px
      justify-content: flex-end

    @media screen and (max-width: 350px)
      left: -95px
      padding-right: 4px

  .swiper__arrow_next
    right: 0

    @media screen and (max-width: 600px)
      right: -85px
      padding-left: 8px

    @media screen and (max-width: 350px)
      right: -95px
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
</style>
