<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="news_wraper">
    <div class="container">
      <Loader v-if="!mainPost && !newsEvents" color="orange"></Loader>
      <div v-else class="news">
        <Heading
          class="news_title"
          level="2"
          v-html="
            $t(`titles.news_main_title.${getCoursesMode}`, {
              spanColor: MAIN_COLORS[getCoursesMode].button,
            })
          "
        />

        <div class="news_block" @click="fetchCurrentNewsBySlug">
          <div class="news__img_wrapper">
            <div
              class="news__event"
              :style="{ backgroundColor: mainPost.category.color_hex }"
            >
              {{ mainPost.category.title }}
            </div>
            <img
              v-if="!!mainPost.poster.original_url"
              class="news__img"
              :src="mainPost.poster.original_url"
              alt=""
            />
          </div>

          <h4 class="news_block_items_note">{{ $t('titles.last_news') }}</h4>
          <div class="news_block_items">
            <h5 class="news_block_items_data">
              {{ getDateFromString(mainPost.published_at) }}
            </h5>
            <Heading level="2" class="news_block_items_title">{{
              mainPost.title
            }}</Heading>
            <h4 class="news_block_items_subtitle">
              {{ mainPost.description.slice(0, 115) }}...
            </h4>
          </div>
        </div>

        <div class="news_filters_btns">
          <div
            v-for="{ slug } in btnsFilters"
            :key="slug"
            class="news_filter_btn"
            :class="selectedFilterNews[0].slug === slug ? 'active' : ''"
            @click="selectFilter(slug)"
          >
            {{ $t(`buttons.${slug}`) }}
          </div>
          <div class="head_filtration__right">
            <SortingOrder
              :order-list="orderList"
              :order-by="orderBy"
              @selectOrderBy="selectOrderBy"
            />
          </div>
        </div>
        <template v-if="newsEvents.data.length">
          <div class="news_cards_wrapper">
            <NewsEventsCard
              v-for="card in newsEvents.data"
              :key="card.id"
              :occurrent-data="card"
              class="news_cards"
            />
          </div>
          <div v-if="isShowPagination" class="lesson_pages_wrapper">
            <Paginate
              :page-count="pagesCount"
              :force-page="currentPage"
              :value="currentPage"
              :click-handler="pageChangeHandler"
              :prev-text="''"
              :next-text="''"
              :container-class="'pagination'"
              :page-class="'pagination_el'"
              :prev-class="'prev_arrow'"
              :next-class="'next_arrow'"
            />
          </div>
        </template>
        <div v-else class="news_empty">
          <Heading level="4" class="news_empty__title"
            >{{ $t('titles.empty_mess') }}
          </Heading>
          <div class="news_empty__text">
            {{ $t('titles.try_again') }}
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
import SortingOrder from '@/elements/SortingOrder/SortingOrder.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: { Heading, NewsEventsCard, Loader, SortingOrder },
  data() {
    return {
      MAIN_COLORS,
      getDateFromString,

      orderBy: {
        id: 'popular_desc',
        title: 'popular_desc',
      },
      filtersBtns: [
        {
          slug: 'all_category_btn',
          id: 'all',
        },
      ],
      categoriesFilters: [],
      orderList: [
        {
          id: 'popular_desc',
          title: 'popular_desc',
        },
        {
          id: 'created_desc',
          title: 'created_desc',
        },
        {
          id: 'created_asc',
          title: 'created_asc',
        },
      ],

      mainPost: null,
      selectedFilterNews: [
        {
          slug: 'all_category_btn',
        },
      ],

      newsEvents: null,
      newsEventsPerPage: 1,
      pagesCount: 1,
      currentPage: 1,
      isLoader: false,
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode', 'getSelectedLanguage']),

    btnsFilters() {
      let btn = [...this.filtersBtns, ...this.categoriesFilters];
      return btn;
    },
    getOrderList() {
      let btn = [...this.filtersBtns, ...this.categoriesFilters];
      return btn;
    },
    isShowPagination() {
      return this.pagesCount > 1;
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchNewsCategories() && this.fetchNewsList();
    },
  },
  async created() {
    await this.fetchNewsCategories();

    this.$route.query.page
      ? (this.currentPage = +this.$route.query.page)
      : (this.currentPage = 1);
    await this.fetchNewsList();
  },
  mounted() {},
  methods: {
    async fetchCurrentNewsBySlug() {
      this.$router.push({
        name: 'current-news',
        params: {
          slug: this.mainPost.slug,
        },
      });
    },

    pageChangeHandler(selectedPage) {
      this.currentPage = +selectedPage;
      this.fetchNewsList();
    },

    async fetchNewsCategories() {
      this.categoriesFilters = await this.$store.dispatch('getNewsCategories');
    },

    async fetchNewsList() {
      this.isLoader = true;

      let filters = {};
      let filtersData = {};

      filtersData.page = this.currentPage;
      filtersData.order_by = this.orderBy.id;

      if (this.selectedFilterNews[0].slug === 'all_category_btn') {
        filters.category = this.categoriesFilters;
      } else {
        filters.category = this.selectedFilterNews;
      }
      filters.category.forEach((el, idx) => {
        filtersData[`filters[category][${idx}]`] = el.slug;
      });

      let res = await this.$store.dispatch('getNewsList', filtersData);
      this.mainPost = res.main_post;
      this.newsEvents = res.posts;

      this.currentPage = this.newsEvents.current_page;
      this.newsEventsPerPage = this.newsEvents.per_page;
      this.pagesCount = this.newsEvents.last_page;
      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.currentPage },
        })
        .catch(() => {});
      // console.log(res);
      this.isLoader = !this.mainPost;
    },

    selectFilter(slug) {
      if (this.selectedFilterNews[0].slug !== slug) {
        this.selectedFilterNews = [{ slug: slug }];
        this.fetchNewsList();
      }
    },
    selectOrderBy(id) {
      this.orderBy = this.orderList.find((el) => el.id === id);
      this.fetchNewsList();
    },
  },
};
</script>

<style lang="sass" scoped>
.news
  padding: 35px 0 95px

  @include s
    padding: 35px 0 70px

  @include xs
    padding: 20px 0 70px

.news_title
  @include adaptive-font-size(48, 40, 24)
  @include adaptive-line-height(60, 50, 30)
  max-width: 550px

  @include xs
    max-width: 100%

.news_wraper .loader
  display: flex
  align-items: center
  height: calc(100vh - 88px)

.news_block
  cursor: pointer
  padding: 58px 0
  display: grid
  grid-template-columns: 2fr 1fr
  grid-template-rows: auto 1fr
  grid-column-gap: 80px

  @include m
    grid-column-gap: 50px

  @include s
    padding: 50px 0
    grid-column-gap: 24px

  @include xs
    grid-template-columns: 1fr
    padding: 35px 0 40px 0

.news_block_items_note
  @include adaptive-font-size(24, 14, 14)
  @include adaptive-line-height(30, 18, 18)
  color: var(--color-head-title)
  padding-bottom: 50px
  font-weight: normal

  @include s
    padding-bottom: 30px

  @include xs
    padding-bottom: 12px
    grid-row: 1/2

.news_block_items_data
  @include adaptive-font-size(20, 11, 11)
  @include adaptive-line-height(25, 14, 14)
  color: #949AA1
  font-weight: normal

.news_block_items_title
  padding: 30px 0 20px 0
  @include adaptive-font-size(36, 26, 24)
  @include adaptive-line-height(46, 32, 32)

  @include s
    padding: 20px 0 12px 0

  @include xs
    padding: 6px 0 10px 0

.news_block_items_subtitle
  @include adaptive-font-size(18, 14, 16)
  @include adaptive-line-height(26, 18, 20)
  font-weight: normal
  max-width: 300px
  opacity: 0.8

  @include xs
    max-width: 100%

.news__img_wrapper
  position: relative
  grid-row: 1/3

  @include xs
    grid-row: 2/3

.news__event
  position: absolute
  right: 16px
  top: 16px
  padding: 8px 24px

  @include xs
    padding: 8px 10px

  @include xxs
    padding: 6px 10px

.news__img
  width: 100%
  max-height: 400px
  object-fit: cover

  @include xs
    margin-bottom: 18px

.news_filters_btns
  display: flex
  flex-wrap: wrap
  gap: 32px
  margin-bottom: 60px
  @include s
    gap: 20px 8px
    margin-bottom: 24px
  @include xs
    margin-bottom: 40px

.news_filter_btn
  display: flex
  align-items: center
  justify-content: center
  padding: 6px 24px
  @include adaptive-font-size(18, 18, 12)
  @include adaptive-line-height(32, 32, 18)
  border: 1px solid transparent
  cursor: pointer
  @media only screen and (max-width: 768px)
    padding: 6px 18px
  @include xs
    flex: 0 0 calc((100% / 3) - 16px / 3)

  @include xxs
    padding: 6px 10px

  @include xxxs
    padding: 6px 4px

.news_filter_btn:hover
  color: var(--color-head-title)

.news_filter_btn.active
  border: 1px solid var(--color-head-title)

.pro-courses
  .news_filter_btn.active
    @include s
      border: 1px solid var(--color-main)

.news_filter_btn.active:hover
  color: var(--primary-font-color)

.news_cards_wrapper
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(273px, 1fr))
  column-gap: 6%
  row-gap: 60px
  margin-bottom: 60px

  @include s
    column-gap: 20px
    row-gap: 20px
    margin-bottom: 40px

  @include xs
    row-gap: 16px

.news_cards
  // background-color: var(--color-white)
  cursor: pointer

.head_filtration__right
  position: relative
  display: flex
  align-items: center
  gap: 8px
  margin-left: auto

  @include xs
    flex: 0 0 100%

.head_filtration__right span
  white-space: nowrap

.head_filtration__right svg
  position: relative
  top: 2px
  width: 8px

.head_filtration__sorting_title
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  justify-self: end
  background-color: var(--color-white)
  padding: 10px 24px
  font-weight: bold
  font-size: 14px
  cursor: pointer
  width: 250px
  border: 1px solid transparent
  transition: 0.2s

  @include xs
    width: 100%

.head_filtration__sorting_title:hover
  border: 1px solid var(--color-main)

.head_filtration__sorting_title:hover svg
  transform: rotate(180deg)

.head_filtration__sorting_title:hover .head_filtration__sorting_wrapper
  visibility: visible
  opacity: 1

.order__title
  font-size: 18px

  @include xs
    font-size: 16px

.order--small
  font-size: 12px

.head_filtration__sorting_wrapper
  visibility: hidden
  opacity: 0
  position: absolute
  cursor: pointer
  z-index: 10
  top: 46px
  right: 0
  font-size: 16px
  width: 100%
  right: 0
  background: none
  transition: 0.2s

.head_filtration__sorting
  display: flex
  flex-direction: column
  margin-top: 8px
  border: 1px solid var(--color-main)
  background-color: var(--color-white)
  padding: 14px 24px

.sorting__list
  display: flex
  flex-direction: column

.sorting__link
  padding: 10px 0

.sorting__link:hover
  background: var(--color-main-light-bg)
  padding: 10px 23px
  margin: 0 -23px

.sorting__link.activeFilter
  color: var(--color-main)

.news_btn
  margin: 0 auto
  margin-bottom: 35px

.lesson_pages_wrapper
  display: flex
  justify-content: center

.news_empty
  grid-column: 2/4
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding-top: 20px

.news_empty .title
  text-align: center
  margin-bottom: 16px
</style>
