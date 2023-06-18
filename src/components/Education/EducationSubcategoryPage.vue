<template>
  <div>
    <Loader v-if="getSubcategories.length === 0" color="orange" />
    <div v-else class="main">
      <div class="container">
        <div class="header_content">
          <div class="main_education__title">
            <Heading level="3" class="card_education__title">
              {{ $t('main.education') }}
            </Heading>
            <Heading level="3" class="card_education__subtitle">
              {{ subcategoryTitle }}
            </Heading>
          </div>
          <img
            src="../../assets/images/bg-img-education.png"
            alt="bg"
            class="education__bg_img"
          />
        </div>
      </div>
      <div class="main_content">
        <div class="container">
          <InputSearchResults
            class="questions_search"
            :is-cross="true"
            :is-search-results="true"
            :placeholder-value="$t('main.search_placholder')"
            :search-results="getSuggestionsSearchResults"
            @input="getSearchValue"
            @detect="slugDetect"
          />
          <SubcategoriesList :subcategories="getSubcategories" />
          <PopularArticles />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubcategoriesList from './SubcategoriesList.vue';
import PopularArticles from './PopularArticles.vue';
import { mapGetters } from 'vuex';
import InputSearchResults from '@/elements/Inputs/InputSearchResults';
import Loader from '@/elements/Loader/Loader';
import { getFromLS } from '@/library/helpers';
export default {
  components: {
    InputSearchResults,
    PopularArticles,
    SubcategoriesList,
    Loader,
  },

  data() {
    return {
      subcategoryTitle: '',
    };
  },

  computed: {
    ...mapGetters([
      'getCategoriesList',
      'getSuggestionsSearchResults',
      'getSubcategories',
      'getSelectedLanguage',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchSubcategoryPageData();
    },
  },
  async mounted() {
    await this.fetchSubcategoryPageData();
  },

  methods: {
    async fetchSubcategoryPageData() {
      let res1 = this.$store.dispatch(
        'getSubcategoryArticle',
        this.$route.params.category_slug
      );
      let res2 = this.$store.dispatch('getCategoriesData');
      Promise.all([await res2, await res1]);

      this.subcategoryTitle = this.getCategoriesList.find(
        (el) => el.slug === this.$route.params.category_slug
      ).title;

      this.$store.commit('SET_CURR_BREAD_LABEL', {
        current_education_name: this.subcategoryTitle,
      });
    },
    async getSearchValue(value) {
      if (value) {
        await this.$store.dispatch('getSearchResultData', { value: value });
      } else {
        await this.$store.dispatch('getSearchResultData', { value: null });
      }
    },
    slugDetect(value) {
      this.$router.push({
        name: 'current-article',
        params: {
          category_slug: value.subcategory.slug,
          subcategory_slug: value.category.slug,
          article_slug: value.slug,
        },
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.card_education__subtitle
  color: var(--color-head-title)
  width: 100%

.questions_search
  height: auto
  max-width: 1279px
  position: relative

.main_education__title
  display: flex
  flex-wrap: wrap
  max-height: 120px
  @include xs
    margin-top: 11px

// .main_education__title h4
//   @include xs
//     font-size: 24px
//     font-weight: 600
//     line-height: 30px

.main
  width: 100%
  background-color: white

.header_content
  display: flex
  justify-content: space-between
  align-items: center
  @include xs
    flex-wrap: wrap

.education__bg_img
  margin: 79px 60px 0 0
  @include xs
    max-width: 100%

.similar_news__slider
  @include s
  max-width: 100%
  width: 100%
.main_content
  background-color: var(--color-background)
  padding: 69px 0 112px 0
  @include xs
    padding: 32px 0 0 0
</style>
