<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="lessons_main">
    <FilterSideBar
      :opened-filters="openedFilters"
      class="lessons_filter__drop_menu"
      :class="{ active: openedFilters }"
      @select-filters="getFiltersData"
      @close-drop-filters="closeFilters"
      @clear-all-filters="clearAll"
      @close-btn="openFilters"
    />
    <div class="container">
      <Heading
        level="2"
        v-html="
          $t(`titles.all_courses_title.${getCoursesMode}`, {
            spanColor: MAIN_COLORS[getCoursesMode].text,
          })
        "
      />

      <Loader v-if="!!!getCoursesList.data" color="orange" />

      <template v-else>
        <div class="lessons_filter__head head_filtration">
          <div class="head_filtration__left">
            <ButtonBase
              :icon-name="getWindowWidth <= 1024 ? 'filter_white' : 'filter'"
              :color="getWindowWidth <= 1024 ? 'orange' : 'transparent'"
              :non-border="getWindowWidth <= 1024 ? false : true"
              :size="getWindowWidth <= 1024 ? 'm' : 'low'"
              class="head_filtration__row"
              @click.native.stop="openFilters"
            >
              {{ $t('buttons.filtration_btn') }}
            </ButtonBase>
            <div
              class="head_filtration__row"
              :style="getWindowWidth <= 1024 ? 'display: none' : ''"
              @click="clearAll"
            >
              <svg-icon name="icon_cross" />
              <span style="white-space: nowrap">
                {{ $t('buttons.clear_all_btn') }}
              </span>
            </div>
          </div>
          <div class="head_filtration__right">
            <SortingOrder
              :order-list="orderList"
              :order-by="orderBy"
              @selectOrderBy="selectOrderBy"
            />
          </div>
        </div>

        <div
          :class="{
            lessons_wrapper__small: getWindowWidth <= 1024,
            lessons_wrapper: getWindowWidth > 1024,
          }"
        >
          <FilterSideBar
            v-if="getWindowWidth > 1024"
            class="lessons_filter"
            @select-filters="getFiltersData"
          />

          <div
            v-if="!!getCoursesList.data && !getCoursesList.data.length"
            class="lessons_empty"
          >
            <Heading level="4" class="lessons_empty__title">
              {{ $t('titles.empty_mess') }}
            </Heading>
            <div class="lessons_empty__text">
              {{ $t('titles.try_again') }}
            </div>
          </div>

          <Loader v-if="isLoader" color="orange" class="isLoader" />

          <LessonCard
            v-for="card in getCoursesList.data"
            v-else
            :key="card.id"
            :cards-data="card"
          />
        </div>
        <div v-if="getCoursesPageCount > 1" class="lesson_pages_wrapper">
          <Paginate
            :page-count="getCoursesPageCount"
            :force-page="getCurrentCoursesPage"
            :value="getCurrentCoursesPage"
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
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import FilterSideBar from './FilterSideBar.vue';
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import SortingOrder from '@/elements/SortingOrder/SortingOrder.vue';

import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    Loader,
    FilterSideBar,
    LessonCard,
    SortingOrder,
    ButtonBase,
  },
  data() {
    return {
      MAIN_COLORS,

      openedFilters: false,

      orderBy: {
        id: 'rating_desc',
        title: 'order_by',
      },
      orderList: [
        {
          id: 'rating_desc',
          title: 'rating_desc',
        },
        {
          id: 'popular_desc',
          title: 'popular_desc',
        },
        {
          id: 'created_asc',
          title: 'created_asc',
        },
        {
          id: 'created_desc',
          title: 'created_desc',
        },
      ],
      lessonsPerPage: 1,
      filtersList: {},
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesPageCount',
      'getCurrentCoursesPage',
      'getCoursesModeDispatch',
      'getHeaderCoursesFilter',
      'getSelectedLanguage',
      'getWindowWidth',
      'getCoursesList',
    ]),
  },
  watch: {
    openedFilters(value) {
      if (value) {
        document.documentElement.classList.add('overflow_hidden');
      } else {
        document.documentElement.classList.remove('overflow_hidden');
      }
    },

    getHeaderCoursesFilter(value) {
      if (value) {
        (this.filtersList = {}), this.getFiltersData(value);
      }
    },

    getSelectedLanguage(value) {
      value && this.languageRequest();
    },
  },
  async created() {
    this.$route.query.page
      ? this.$store.commit('SET_CURRENT_COURSES_PAGE', +this.$route.query.page)
      : this.$store.commit('SET_CURRENT_COURSES_PAGE', 1);

    this.filtersList = {
      page: this.getCurrentCoursesPage,
      order_by: 'rating_desc',
    };

    if (!!this.getHeaderCoursesFilter) {
      this.getFiltersData(this.getHeaderCoursesFilter);
    } else {
      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        this.filtersList
      );
    }
  },
  beforeDestroy() {
    this.$store.commit('setHeaderCoursesFilter', null);
  },
  methods: {
    async clearAll() {
      this.isLoader = true;
      this.$store.commit('clearCheckboxes', true);
      this.$store.commit('SET_CURRENT_COURSES_PAGE', 1);

      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        {
          page: this.getCurrentCoursesPage,
        }
      );

      this.isLoader = false;
    },

    closeFilters() {
      this.openedFilters = false;
    },

    async selectOrderBy(id) {
      this.isLoader = true;

      this.orderBy = id;
      this.$store.commit('SET_CURRENT_COURSES_PAGE', 1);
      let filters = { ...this.filtersList };
      filters.page = this.getCurrentCoursesPage;
      filters.order_by = this.orderBy;

      this.orderBy = this.orderList.find((el) => el.id === id);
      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        filters
      );

      this.isLoader = false;
    },

    async pageChangeHandler(selectedPage) {
      this.isLoader = true;
      this.$store.commit('SET_CURRENT_COURSES_PAGE', +selectedPage);

      let filters = { ...this.filtersList, page: +selectedPage };

      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        filters
      );

      this.isLoader = false;
    },

    async languageRequest() {
      let filters = { ...this.filtersList, page: this.getCurrentCoursesPage };
      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        filters
      );
    },

    async getFiltersData({ type, values }) {
      // console.log('getFiltersData<<<<<', type, values);
      this.isLoader = true;

      values.forEach((el, idx) => {
        this.filtersList[`filters[${type}][${idx}]`] = el;
      });

      if (values.length < Object.values(this.filtersList).length) {
        let differenceValue = [
          ...values.filter((x) => !Object.values(this.filtersList).includes(x)),
          ...Object.values(this.filtersList).filter((x) => !values.includes(x)),
        ];
        differenceValue.forEach((el) => {
          for (let key in this.filtersList) {
            if (`${this.filtersList[key]}` === el.toString()) {
              if (key.includes(type)) {
                delete this.filtersList[key];
              }
            }
          }
        });
      }

      // console.log('this.filtersList <<<<<', this.filtersList);
      this.$store.commit('SET_CURRENT_COURSES_PAGE', 1);

      this.filtersList.page = this.getCurrentCoursesPage;
      this.filtersList.order_by = this.orderBy.id;

      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesList`,
        this.filtersList
      );
      this.isLoader = false;
    },

    closeAll() {
      this.openedFilters = false;
    },
    openFilters() {
      if (this.getWindowWidth <= 1024) {
        this.openedFilters = !this.openedFilters;
      }
    },
  },
};
</script>

<style lang="sass">
.lessons_main
  margin-bottom: 115px
  position: static

  .loader
    display: flex
    align-items: center
    height: 60vh

.lessons_main .container .title--2
  margin: 20px 0 60px 0

.modal__container
  height: 100%

.lessons_wrapper
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  column-gap: 6%
  row-gap: 60px
  margin-bottom: 100px
  @include l
    column-gap: 5%
  @media screen and (max-width: 1150px)
    column-gap: 4%

.lessons_wrapper__small
  display: grid
  grid-template-columns: 1fr 1fr
  column-gap: 6%
  row-gap: 60px
  margin-bottom: 100px
  @media screen and (max-width: 650px)
    grid-template-columns: 1fr
    row-gap: 40px
  @include xxs
    row-gap: 16px

.lessons_filter
  grid-row: 1 / 3

.lessons_filter__drop_menu
  position: fixed
  left: -380px
  top: 0
  z-index: 20
  height: 100vh
  overflow-y: scroll
  background: var(--color-white)
  transition: 0.5s

.lessons_filter__drop_menu.active
  transform: translateX(380px)
  width: 100%

.profile_sidebar
  padding: 16px 40px 16px

.lesson_pages_wrapper
  display: flex
  justify-content: center

.lessons_empty
  grid-column: 2/4
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding-top: 20px
  @include s
    grid-column: 1/-1
    text-align: center

.lessons_empty .title
  margin-bottom: 16px

.isLoader
  grid-column: 2/4
</style>
