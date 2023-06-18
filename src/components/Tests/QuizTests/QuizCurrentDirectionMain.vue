<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="trial_current_direction">
    <div
      v-if="!!getQuizCategories.length"
      class="trial_current_direction__header"
    >
      <div class="container">
        <Heading
          level="2"
          v-html="
            $t('tests.quiz_direction_test_header', {
              direction: getQuizCategories.find(
                (el) => el.slug === $route.params.direction
              ).title,
              spanColor: MAIN_COLORS[getCoursesMode].text,
            })
          "
        />
      </div>
      <div class="fiter_tests_block container">
        <FiltrationQuiz
          :filters-list="getQuizFilters"
          :filter-by="chosenFilters"
          @selectFiltersBy="selectFilters"
        />
      </div>
    </div>

    <div
      v-if="!!getQuizTestsList.length"
      class="trial_current_direction__main container"
    >
      <div
        v-for="item in getQuizTestsList"
        :key="item.id"
        class="direction_block"
      >
        <div class="direction_block__cards">
          <QuizTestCard :key="item.id" :test-by-directions-data="item" />
        </div>
      </div>
    </div>
    <div v-else class="trial_current_direction__main empty container">
      <Heading level="4">{{ $t('tests.quiz_empty_title') }}</Heading>
      <span>{{ $t('tests.quiz_empty_subtitle') }}</span>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import QuizTestCard from './QuizTestCard.vue';
import FiltrationQuiz from '@/elements/SortingOrder/FiltrationQuiz.vue';
import { ClientJS } from 'clientjs';

import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    FiltrationQuiz,
    // ButtonBase,
    QuizTestCard,
  },
  data() {
    return {
      MAIN_COLORS,
      title: null,
      direction: [],

      fingerprint: null,

      chosenFilters: [],

      isLoader: false,

      CURRENT_BREAD_LABEL: '',
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getTrialCategories',
      'getSelectedLanguage',
      'getQuizCategories',
      'getQuizTestsList',
      'isAuthUser',
      'getUniqueUserID',
      'getQuizFilters',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchQuizTestCategories() && this.fetchQuizTests();
    },
  },

  async created() {
    this.isLoader = true;
    this.createUniqueUserID();
    this.fetchQuizTests();

    !this.getQuizCategories.length && (await this.fetchQuizTestCategories());
    this.getLabel();
  },

  methods: {
    createUniqueUserID() {
      const client = new ClientJS();
      if (!this.isAuthUser) {
        this.$store.commit('SET_FINGERPRINT', client.getFingerprint());
      }
    },

    getLabel() {
      this.CURRENT_BREAD_LABEL = this.getQuizCategories.find(
        (el) => el.slug === this.$route.params.direction
      ).title;

      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: this.CURRENT_BREAD_LABEL,
      });
    },

    async fetchQuizTestCategories() {
      await this.$store.dispatch('getQuizTestCategories');
    },

    async fetchQuizTests() {
      await this.$store.dispatch('getQuizFilters');

      await this.$store.dispatch('getQuizTestsList', {
        filters: this.chosenFilters,
        category_id: this.$route.params.category_id,
        token: this.isAuthUser ? null : this.getUniqueUserID,
      });
      this.isLoader = false;
    },

    selectFilters(item) {
      if (this.chosenFilters.includes(item)) {
        this.chosenFilters = this.chosenFilters.filter((el) => el !== item);
      } else {
        this.chosenFilters.push(item);
      }
      this.fetchQuizTests();
    },
  },
};
</script>

<style lang="sass" scoped>
.trial_current_direction__header
  margin: 60px 0
  display: flex
  @include xs
    flex-direction: column
    gap: 24px

.trial_current_direction__main
  @include xxs
    margin-bottom: 100px

.trial_current_direction__main.empty
  text-align: center
  height: 50vh
.trial_current_direction__main.empty span
  font-size: 18px
  @include xs
    font-size: 14px

.direction_block__subtitle
  display: flex
  align-items: center
  gap: 15px
  font-size: 18px
  font-weight: bold
  margin-bottom: 30px

.direction_block__subtitle div
  width: 100%
  border-bottom: 1px solid #D8D8D8

.direction_block__cards
  display: grid
  grid-template-columns: repeat(3, 29.15%)
  gap: 6%
  margin-bottom: 60px
  @include s
    grid-template-columns: repeat(2, 47%)
  @include xxs
    grid-template-columns: 1fr
    gap: 0

.fiter_tests_block
  display: flex
  justify-content: flex-end
  align-items: flex-end
</style>
