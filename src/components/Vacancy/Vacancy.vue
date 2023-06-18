<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="main_vacancy">
    <div
      class="lessons_filter__drop_menu_cross"
      :class="{ active: isOpenedFiltersList }"
      @click.stop="toggleFiltersList"
    ></div>
    <div class="container">
      <img
        class="vacancy__first_block_img"
        src="/images/vacancy_main.png"
        alt=""
      />
    </div>
    <div class="vacancy__first_block">
      <div class="container">
        <div class="vacancy_main">
          <h2
            class="vacancy_main__title"
            v-html="
              $t(`titles.join_us`, {
                spanColor: MAIN_COLORS[getCoursesMode].button,
              })
            "
          ></h2>
          <div
            class="vacancy_main__text"
            v-html="
              $t('vacancy.send_us_vacancy_1', { vacancy: 'info@ilmonline.uz' })
            "
          ></div>
        </div>
        <div
          class="scroll_arrow_down vacancy__scroll"
          @click="scrollTo('vacancy_list')"
        >
          <svg-icon :name="`main_arrows_scroll_down_${getCoursesMode}`" />
        </div>
      </div>
    </div>
    <VacancyFilterSideBar
      class="lessons_filter__drop_menu"
      :class="{ active: isOpenedFiltersList }"
      :is-opened-filters-list="isOpenedFiltersList"
      @close-drop-filters="closeFilters"
      @select-filters="getFiltersData"
      @clear-all-filters="clearAll"
    />
    <div id="vacancy_list" class="vacancy__content container">
      <Loader v-if="!getVacancyList" color="orange"></Loader>
      <template v-else>
        <div class="head_filtration">
          <div class="head_filtration__left">
            <ButtonBase
              :icon-name="getWindowWidth <= 1024 ? 'filter_white' : 'filter'"
              :color="getWindowWidth <= 1024 ? 'orange' : 'transparent'"
              :non-border="getWindowWidth <= 1024 ? false : true"
              :size="getWindowWidth <= 1024 ? 'm' : 'low'"
              class="head_filtration__row"
              @click.native.stop="toggleFiltersList"
            >
              {{ $t('buttons.filtration_btn') }}
            </ButtonBase>
            <div
              class="head_filtration__row"
              :style="getWindowWidth <= 1024 ? 'display: none' : ''"
              @click="clearAll"
            >
              <svg-icon name="icon_cross" />
              <span>
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

        <div class="vacancy_wrapper">
          <VacancyFilterSideBar
            class="vacancy_filter desk"
            :is-opened-filters-list="isOpenedFiltersList"
            @close-drop-filters="closeFilters"
            @select-filters="getFiltersData"
            @clear-all-filters="clearAll"
          />

          <div
            class="vacancy_card_list_wrapper"
            :class="{ isLoader: isLoader }"
          >
            <div
              v-if="
                !!getVacancyList.data &&
                !getVacancyList.data.length &&
                !isLoader
              "
              class="empty_titles"
            >
              <Heading level="4">
                {{ $t('vacancy.empty_mess') }}
              </Heading>
              <div class="lessons_empty__text">
                {{ $t('titles.try_again') }}
              </div>
            </div>
            <Loader v-if="isLoader" color="orange" class="isLoader" />

            <VacancyCard
              v-for="card in getVacancyList.data"
              v-else
              :key="card.id"
              :vacancy-card="card"
              @click.native="goToSelectedVacancy(card.slug, card.title)"
            />
          </div>
        </div>
        <template v-if="getLastPage > 1">
          <Paginate
            :page-count="getLastPage"
            :force-page="getCurrentPage"
            :value="getCurrentPage"
            :click-handler="pageChangeHandler"
            :prev-text="''"
            :next-text="''"
            :container-class="'pagination'"
            :page-class="'pagination_el'"
            :prev-class="'prev_arrow'"
            :next-class="'next_arrow'"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import SortingOrder from '@/elements/SortingOrder/SortingOrder.vue';
import VacancyCard from '@/components/Vacancy/VacancyCard.vue';
import VacancyFilterSideBar from './VacancyFilterSideBar.vue';
import { scrollToBeginForm } from '@/helpers/scroll';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    Loader,
    SortingOrder,
    VacancyFilterSideBar,
    VacancyCard,
  },

  data() {
    return {
      MAIN_COLORS,

      orderBy: {
        id: 'popular_desc',
        title: 'order_by',
      },
      isOpenedFiltersList: false,
      filtersList: {},
      orderList: [
        {
          id: 'popular_desc',
          title: 'popular_desc',
        },
        {
          id: 'created_asc',
          title: 'created_desc',
        },
        {
          id: 'created_desc',
          title: 'created_asc',
        },
      ],

      filterListUnpack: {},
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getVacancyList',
      'getLastPage',
      'getCurrentPage',
      'getSelectedLanguage',
      'getWindowWidth',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.languageRequest();
    },
    isOpenedFiltersList(value) {
      if (value) {
        document.documentElement.classList.add('overflow_hidden');
      } else {
        document.documentElement.classList.remove('overflow_hidden');
      }
    },
  },

  async created() {
    // console.log(this.$route.query);
    this.$route.query.page
      ? this.$store.commit('SET_CURRENT_PAGE', +this.$route.query.page)
      : this.$store.commit('SET_CURRENT_PAGE', 1);

    this.filtersList = {
      page: this.getCurrentPage,
      order_by: 'popular_desc',
    };

    await this.$store.dispatch('getVacancyListData', this.filtersList);
  },

  methods: {
    async pageChangeHandler(selectedPage) {
      this.isLoader = true;
      this.$store.commit('SET_CURRENT_PAGE', +selectedPage);

      let filters = {
        ...this.filtersList,
        page: +selectedPage,
        order_by: this.orderBy.id,
      };

      await this.$store.dispatch('getVacancyListData', filters);

      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.getCurrentPage },
        })
        .catch(() => {});
      // window.scrollTo(0, 0);
      this.isLoader = false;
    },

    async languageRequest() {
      this.isLoader = true;
      let filters = {
        ...this.filtersList,
        page: this.getCurrentPage,
        order_by: this.orderBy.id,
      };
      await this.$store.dispatch('getVacancyListData', filters);

      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.getCurrentPage },
        })
        .catch(() => {});
      this.isLoader = false;
      // window.scrollTo(0, 0);
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
      this.$store.commit('SET_CURRENT_PAGE', 1);

      this.filtersList.page = this.getCurrentPage;
      this.filtersList.order_by = this.orderBy.id;

      await this.$store.dispatch('getVacancyListData', this.filtersList);
      this.isLoader = false;

      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.getCurrentPage },
        })
        .catch(() => {});
    },

    async selectOrderBy(id) {
      this.isLoader = true;

      this.orderBy = id;
      this.$store.commit('SET_CURRENT_PAGE', this.getCurrentPage);

      let filters = { ...this.filtersList };
      filters.page = this.getCurrentPage;
      filters.order_by = this.orderBy;

      this.orderBy = this.orderList.find((el) => el.id === id);
      await this.$store.dispatch('getVacancyListData', filters);

      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.getCurrentPage },
        })
        .catch(() => {});

      this.isLoader = false;
    },

    async clearAll() {
      this.isLoader = true;
      this.filtersList = {};
      this.$store.commit('clearCheckboxes', true);
      await this.$store.dispatch('getVacancyListData', {
        page: this.getCurrentPage,
      });
      this.isLoader = false;
    },

    goToSelectedVacancy(slug, title) {
      this.$router.push({
        name: 'selected-vacancy',
        params: { slug: slug, title: title },
      });
    },
    toggleFiltersList() {
      if (this.getWindowWidth <= 1024) {
        this.isOpenedFiltersList = !this.isOpenedFiltersList;
      }
    },
    closeFilters() {
      this.isOpenedFiltersList = false;
    },
    scrollTo(id) {
      let topVacancy = document.getElementById(id).offsetTop - 170;
      scrollToBeginForm(topVacancy);
    },
  },
};
</script>

<style lang="sass">
.main_vacancy .container
  position: relative
  @include s
    position: static

.vacancy__first_block
  background-color: var(--color-white)

.vacancy_list__top
  position: relative
.vacancy_main
  position: relative

.scroll_arrow_down.vacancy__scroll
  @media only screen and (max-width: 1024px)
    position: absolute
    top: 837px
    left: 50%
    transform: translateX(-50%)
    display: flex
    justify-content: center
    width: 100%
  @media only screen and (max-width: 767px)
    top: 840px
  @media only screen and (max-width: 722px)
    top: 740px
  @media only screen and (max-width: 550px)
    top: 660px
  @media only screen and (max-width: 400px)
    top: 520px

.scroll_arrow_down.vacancy__scroll svg
  @media only screen and (max-width: 722px)
    max-width: 25px
    max-height: 25px

.vacancy__first_block
  @include s
    min-height: 802px
  @media only screen and (max-width: 722px)
    min-height: 700px
  @media only screen and (max-width: 550px)
    min-height: 600px
  @include xxxs
    min-height: 450px
.vacancy__first_block
  background-color: var(--color-white)
.vacancy_main__text
  font-size: 28px
  font-weight: 400
  line-height: 36px
  a
    text-decoration: underline
    font-weight: 600
    color: var(--color-head-title)

.vacancy__first_block_img
  position: absolute
  right: 0
  top: 86px
  max-height: 350px
  @media only screen and (max-width: 1100px)
    //top: 22%
    max-height: 320px
  @media only screen and (max-width: 1067px)
    //top: 22%
    max-height: 320px
  @media only screen and (max-width: 1024px)
    top: 420px
    max-height: 320px
    //max-height: 438px
  @media only screen and (max-width: 767px)
    top: 378px
    max-height: 320px
  @media only screen and (max-width: 722px)
    max-height: 405px
    top: 297px
  @media only screen and (max-width: 662px)
    max-height: 350px
    top: 375px
  @media only screen and (max-width: 550px)
    max-height: 320px
    top: 340px
  @media only screen and (max-width: 460px)
    max-height: 250px
    top: 386px
  @media only screen and (max-width: 400px)
    max-height: 234px
    top: 280px
  @media only screen and (max-width: 350px)
    max-height: 180px
    top: 320px

.mobile
  display: none
  @include s
    display: block

.desk
  display: block
  @include s
    display: none

.lessons_filter__drop_menu_cross
  cursor: pointer
  position: fixed
  left: -50px
  top: 24px
  height: 48px
  width: 48px
  content: ''
  background-image: url(/images/filter_cross.svg)
  background-position: center
  background-color: var(--color-white)
  z-index: 50
  transition: 0.5s
  @include xxs
    left: auto
    right: 540px

.active.lessons_filter__drop_menu_cross
  transform: translateX(417px)
  @include xxs
    right: 340px
    transform: translateX(317px)
    top: 12px

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

.side_bar__mobile
  font-size: 20px
  font-style: normal
  font-weight: 600
  line-height: 32px
  letter-spacing: 0em
  text-align: left
  display: flex
  align-items: center
  padding-bottom: 16px
  border-bottom: 1px solid var(--border-color)
  svg
    margin-right: 8px

.filers_list__close
  position: absolute
  right: -82px
  top: -10px
  height: 48px
  width: 48px
  background-color: var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  @include xxs
    right: -10px

.main_vacancy
  min-height: 500px

.vacancy_main
  display: flex
  flex-direction: column
  justify-content: center
  min-height: 500px
  gap: 24px
  padding-right: 50%
  @include s
    padding-right: 0
    min-height: auto
    justify-content: flex-start

.vacancy_main__title
  max-width: 550px
  font-size: 44px
  font-weight: 600
  line-height: 54px
  margin-top: 11px
  @include xs
    max-width: 100%
    font-size: 32px
    line-height: 40px
    font-weight: 600
    max-width: 100%
  @include s
    max-width: 100%
  @include xxxs
    font-size: 24px
    font-weight: 600
    line-height: 30px

.vacancy_main__text
  font-size: 24px
  max-width: 640px
  line-height: 36px
  @include s
    max-width: 100%
    line-height: 28px
    margin-top: 10px
  @include xxxs
    font-size: 14px
    font-weight: 600
    line-height: 20px

.vacancy__content
  margin-top: 84px
  padding-top: 16px
  margin-bottom: 60px
  min-height: 300px
  @include xs
    margin-top: 40px

.vacancy_wrapper
  display: grid
  grid-template-columns: 29.5% 1fr
  column-gap: 6%
  @include s
    grid-template-columns: 100%
    -moz-column-gap: 6%

.vacancy_card_list_wrapper
  cursor: pointer
  background-color: transparent
  min-height: 584px

.vacancy_card_list_wrapper.isLoader
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

.vacancy_filter
  grid-row: 1 / 3

.empty_titles
  padding-top: 32px
  text-align: center
  color: var(--color-font-light-dark)
.pagination
  display: flex
  justify-content: flex-end
  margin-top: 30px
</style>
