<template>
  <div>
    <Loader v-if="isLoaded" class="loader_page" color="orange" />
    <p
      v-else-if="getArticlesList.length === 0 && !searchQuery"
      class="empty-text--mess"
    >
      {{ $t('main.empty-education_text') }}
    </p>
    <div v-else class="container subcategory__list">
      <div class="articles_title">
        <Heading level="3" class="card_education__title">
          {{ $t('main.education') }}
        </Heading>
        <Heading level="3" class="card_education__subtitle">
          {{ title }}
        </Heading>
      </div>
      <div class="navigation_menu">
        <InputSearch
          v-model="searchQuery"
          class="education_input"
          :placeholder-value="$t('main.search_placholder')"
          :is-white="true"
          @input="searchValue"
        />
        <SortingOrder
          :order-list="orderList"
          :order-by="orderBy"
          @selectOrderBy="selectOrderBy"
        />
      </div>
      <p v-if="getArticlesList.length === 0" class="error__empty_mes">
        {{ $t('main.no_results') }}
      </p>
      <EducationCard v-else :items="getArticlesList" />
      <Paginate
        v-if="getLastEducationPage > 1"
        :page-count="getLastEducationPage"
        :force-page="getCurrentEducationPage"
        :click-handler="pageChangeHandler"
        :prev-text="''"
        :next-text="''"
        :container-class="'pagination'"
        :page-class="'pagination_el'"
        :prev-class="'prev_arrow'"
        :next-class="'next_arrow'"
        class="center_pagination"
      />
    </div>
  </div>
</template>
<script>
import EducationCard from '@/components/Education/EducationCard';
import { mapGetters } from 'vuex';
import { getFromLS } from '@/library/helpers';
import InputSearch from '@/elements/Inputs/InputSearch';
import SortingOrder from '@/elements/SortingOrder/SortingOrder';
import Loader from '@/elements/Loader/Loader';
export default {
  components: {
    EducationCard,
    SortingOrder,
    InputSearch,
    Loader,
  },
  data() {
    return {
      title: '',
      searchQuery: '',
      isLoaded: false,
      orderList: [
        {
          id: 'popular_desc',
          title: 'popular_desc',
        },
        {
          id: 'created_desc',
          title: 'created_desc',
        },
      ],
      orderBy: {
        id: 'popular_desc',
        title: 'order_by',
      },
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters([
      'getArticlesList',
      'getSelectedLanguage',
      'getLastEducationPage',
      'getCurrentEducationPage',
      'getSuggestionsSearchResults',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.getFullArticlesListData();
    },
  },
  async created() {
    await this.getFullArticlesListData();
  },

  methods: {
    async getFullArticlesListData() {
      this.isLoaded = true;
      await this.$store.dispatch('getFullArticlesList', {
        slug: this.$route.params.subcategory_slug,
        page: this.currentPage,
        order_by: 'popular_desc',
      });
      // console.log(this.getCategoriesList);

      let category = this.getArticlesList.find(
        (el) => el.subcategory.slug === this.$route.params.category_slug
      ).subcategory.title;

      this.title = this.getArticlesList[0].category.title;

      this.$store.commit('SET_CURR_BREAD_LABEL', {
        current_education_name: category,
        current_articles_name: this.title,
      });

      this.isLoaded = false;
    },
    async searchValue(value) {
      !!value &&
        (await this.$store.dispatch('getSearchResultData', {
          value: value,
          slug: this.$route.params.subcategory_slug,
        }));
      if (!value) {
        await this.$store.dispatch('getFullArticlesList', {
          slug: this.$route.params.subcategory_slug,
          page: this.currentPage,
          order_by: 'popular_desc',
        });
      }
    },
    async selectOrderBy(id) {
      await this.$store.dispatch('getFullArticlesList', {
        slug: this.$route.params.subcategory_slug,
        page: this.currentPage,
        order_by: id,
      });
      this.orderBy = this.orderList.find((el) => el.id === id);
    },
    async pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
      await this.$store.dispatch('changeCurrentEducationPage', selectedPage);
      await this.$store.dispatch('getFullArticlesList', {
        slug: this.$route.params.subcategory_slug,
        page: selectedPage,
        order_by: 'created_desc',
      });
    },
  },
};
</script>

<style lang="sass">
.navigation_menu
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  gap: 24px
  @include s
    grid-template-columns: 1fr 1fr
  @include xs
    display: flex
    flex-direction: column
    gap: 0

.navigation_menu .education_input
  grid-column: 1/3
  @include s
    grid-column: 1/2

.navigation_menu .sorting_select
  grid-column: 3/4
  justify-self: end
  @include s
    grid-column: 2/3

.navigation_menu .sorting_select
  min-width: 284px !important

.navigation_menu .sorting_select .sorting_select__title
  width: 100% !important

.articles_title
  margin: 20px 0 60px
.card_education__subtitle
  color: var(--color-head-title)
.center_pagination
  justify-content: center
  margin-bottom: 90px
.error__empty_mes
  margin: 40px 0
  font-size: 24px
.empty-text--mess
  text-align: center
  padding: 40px 0

.loader_page
  display: flex
  align-items: center
  justify-content: center
  height: 70vh
</style>
