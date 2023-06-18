<template>
  <div class="main">
    <div class="container">
      <div class="header_content">
        <div class="main_education__title">
          <Heading level="2" class="card_education__title">
            {{ $t('main.education') }}
          </Heading>
          <Heading level="2" class="card_education__subtitle">
            {{ $t(`main.often_questions.${getCoursesMode}`) }}
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
          :search-results="getSuggestionsSearchResults"
          :placeholder-value="$t('main.search_placholder')"
          @input="getSearchValue"
          @detect="slugDetect"
        />
        <EducationCard :items="getCategoriesList" :is-category="true" />
        <PopularArticles />
      </div>
    </div>
  </div>
</template>

<script>
import PopularArticles from './PopularArticles.vue';
import EducationCard from './EducationCard.vue';
import { mapGetters } from 'vuex';
import InputSearchResults from '@/elements/Inputs/InputSearchResults';
export default {
  components: {
    InputSearchResults,
    PopularArticles,
    EducationCard,
  },
  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCategoriesList',
      'getSuggestionsSearchResults',
      'getSelectedLanguage',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value &&
        this.getCategories() &&
        this.$store.dispatch('getSearchResultData', { value: null });
    },
  },

  async mounted() {
    await this.getCategories();
    await this.$store.dispatch('getSearchResultData', { value: null });
  },

  methods: {
    async getCategories() {
      await this.$store.dispatch('getCategoriesData');
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

.main_education__title
  display: flex
  flex-wrap: wrap
  @include xs
    margin-top: 8px
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
  margin: 80px 60px 0 0
  @include s
    margin: 80px 0 0 0
  @include xs
    width: 240px
    margin: 0 16px 0 auto
  @include xxs
    width: 162px

.card_education__title,
.card_education__subtitle
  @include adaptive-font-size(48, 48, 24)
  @include adaptive-line-height(60, 60, 30)

.main_content
  background-color: var(--color-background)
  padding: 69px 0 112px 0
  @include xs
    padding: 32px 0 0 0
</style>
