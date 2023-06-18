<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->

    <Loader v-if="!getDetailArticle" color="orange" />
    <div v-else class="container detail_card__container">
      <div v-if="getDetailArticle" class="detail__navigation">
        <div class="details">
          <p class="subcategory">{{ getDetailArticle.category.title }}</p>
          <p class="card__details_date">
            {{ formatDate(getDetailArticle.published_at) }}
          </p>
        </div>
        <div class="like_container">
          <svg-icon name="like_sign" @click.native="putFavoriteItem" />
          <p class="evaluation">
            {{ getDetailArticle.likes_count }}
          </p>
        </div>
      </div>
      <Heading level="3" class="card_detail__subtitle">
        {{ getDetailArticle.title }}
      </Heading>
      <iframe
        v-if="getDetailArticle.video_url.length > 0"
        class="video"
        :src="`${getDetailArticle.video_url}`"
      />
      <img v-else :src="getDetailArticle.poster_url" class="card__detail_img" />
      <p class="description">{{ getDetailArticle.category.description }}</p>
      <div class="details">
        <ul v-if="getDetailArticle" class="details_list">
          <li
            v-for="item in getDetailArticle.content"
            :key="item.id"
            class="details_list__item"
          >
            <div class="title">{{ item.title }}</div>
            <div class="item__content" v-html="item.right_content"></div>
          </li>
        </ul>
      </div>
      <InterestedLesson
        v-if="Object.keys(getDetailArticle.related_course).length >= 1"
        :course="getDetailArticle.related_course"
      />
      <div
        v-if="getDetailArticle.related_articles.length >= 1"
        class="similar_news__slider"
      >
        <Heading level="3" class="card_education__subtitle">
          {{ $t('main.similar') }}
        </Heading>
        <div
          v-if="getDetailArticle.related_articles.length > 3"
          slot="button-prev"
          class="swiper__arrow_prev"
        >
          <svg-icon name="arrow_swipe_left" />
        </div>

        <swiper
          v-if="getDetailArticle"
          ref="swiper"
          class="swiper"
          :options="swiperOptions"
        >
          <swiper-slide
            v-for="article in getDetailArticle.related_articles"
            :key="article.id"
            class="swiper_slide categories__list_item"
            @click.native="openDetailRecomendCard(article.slug)"
          >
            <img :src="`${article.poster_url}`" />
            <div class="text-content">
              <div class="sub-content">
                <p class="date">
                  {{ formatDate(article.published_at) }}
                </p>
                <div class="like_container">
                  <svg-icon name="like_sign" @click.native="putFavoriteItem" />
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
        <div
          v-if="getDetailArticle.related_articles.length > 3"
          slot="button-next"
          class="swiper__arrow_next"
        >
          <svg-icon name="arrow_swipe_right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterestedLesson from '@/components/Education/ InterestedLesson';
import { getFromLS } from '@/library/helpers';
import Loader from '@/elements/Loader/Loader';
import { ClientJS } from 'clientjs';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: {
    InterestedLesson,
    Loader,
  },
  data() {
    return {
      getDateFromString,

      subcategoryTitle: '',
      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 80,
        navigation: {
          prevEl: '.swiper__arrow_prev',
          nextEl: '.swiper__arrow_next',
        },
        userToken: null,
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
      fingerprint: null,
    };
  },

  computed: {
    ...mapGetters([
      'getSelectedLanguage',
      'getDetailArticle',
      'getCategoriesList',
      'getLikesCount',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchArticlesData();
    },
  },
  async created() {
    await this.fetchArticlesData();
  },

  methods: {
    formatDate(date) {
      return getDateFromString(
        date.slice(0, 10).split('.').reverse().join('-')
      );
    },
    async fetchArticlesData() {
      let res1 = this.$store.dispatch('getCategoriesData');
      let res2 = this.$store.dispatch(
        'getArticleDetailsData',
        this.$route.params.article_slug
      );
      Promise.all([await res1, await res2]);

      this.subcategoryTitle = this.getCategoriesList.find(
        (el) => el.slug === this.$route.params.category_slug
      ).title;

      if (this.getDetailArticle) {
        this.$store.commit('SET_CURR_BREAD_LABEL', {
          current_education_name: this.getDetailArticle.subcategory.title,
          current_articles_name: this.getDetailArticle.category.title,
          article_name: this.getDetailArticle.title,
        });
      }
    },

    async putFavoriteItem() {
      this.userToken = getFromLS('token');
      this.fingerprint = new ClientJS().getFingerprint();
      await this.$store.dispatch('putFavoriteItem', {
        slug: this.$route.params.article_slug,
        token: this.userToken ? this.userToken : this.fingerprint,
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.like_container
  display: flex
  flex-wrap: wrap
  align-items: center
  font-size: 16px
  font-weight: 600
  svg
    margin-right: 6px
    height: 22px
    width: 20px
    cursor: pointer

.details_list__item
  display: flex
  margin-left: 0
  margin-bottom: 0
  @include xs
    display: block
  .title
    @include adaptive-font-size(20, 18, 16)
    @include adaptive-line-height(28, 22, 20)
    padding-right: 60px
    width: 40%
    @include m
      width: 30%
    @include s
      padding-right: 32px
    @include xs
      width: 100%
      line-height: 20px
      margin-bottom: 16px

.details_list .details_list__item::after
  display: none

.details_list
  margin-bottom: 100px
  @include xs
    margin-bottom: 20px

.card__detail_img
  margin: 40px auto 80px auto
  display: block
  @include xs
    margin: 16px auto 40px

.card__details_date
  display: flex
  align-items: center
  @include xs
    margin-bottom: 8px

.detail__navigation
  display: flex
  justify-content: space-between
  flex-wrap: nowrap
  margin-bottom: 20px
  margin-top: 56px
  @include xs
    flex-wrap: wrap
    margin-top: 11px

.details
  display: flex
  align-items: center
  @include xs
    width: 100%
  li
    margin-bottom: 32px

.subcategory
  padding: 6px 24px
  background-color: #F9C5C5
  margin-right: 32px
  @include xs
    padding: 6px 10px
    margin: 0 16px 8px 0

.card__details_date
  font-size: 18px
  line-height: 1.4
  font-weight: 400
  color: var(--color-font-light-dark)
  @include xs
    font-size: 16px

.description
  font-size: 24px
  font-weight: 600
  margin-bottom: 96px
  @include xs
    font-size: 18px
    line-height: 22px
    margin-bottom: 32px

.evaluation
  @include xs
    font-size: 16px
    font-weight: 600
    line-height: 20px

.item__content
  width: 55%
  font-size: 18px
  font-weight: 400
  line-height: 26px
  @include m
    width: 65%
  @include xs
    width: 100%
    font-size: 14px
    font-weight: 400
    line-height: 20px

.item__content::v-deep ul
  margin-top: 10px
  @include xs
    margin-top: 6px

.item__content::v-deep li
  list-style: initial
  @include xs
    margin-bottom: 6px

  &:after
    display: none

.item__content::v-deep li,
.item__content::v-deep p
  @include adaptive-font-size(18, 16, 14)
  @include adaptive-line-height(26, 22, 20)

.item__content::v-deep p + p
  margin-top: 10px
  @include xs
    margin-top: 6px

.title
  text-transform: uppercase
  font-size: 20px
  font-weight: 600

.sub-content
  display: flex
  justify-content: space-between

.card_education__subtitle
  margin-bottom: 60px
  @include xs
    font-size: 24px
    margin-bottom: 32px

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
  margin-bottom: 30px

.categories__list_item
  width: 30%
  max-width: 373px
  background-color: white
  margin-bottom: 60px
  flex-wrap: wrap
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

.video
  width: 100%
  max-width: 1280px
  height: 718px
  margin: 40px 0 80px 0
  @include xs
    height: 250px
    margin: 16px 0 40px 0
</style>
