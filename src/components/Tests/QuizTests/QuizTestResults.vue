<template>
  <div>
    <div v-if="isLoader" class="trial_main_loader">
      <Loader color="orange" />
    </div>
    <div v-else class="current_quiz_main_wrapper">
      <QuizTestHeader
        :title="resultsTitle"
        :type="yourType"
        :description="yourDescription"
        is-quiz-results
        img="quiz_header_results"
      />
      <div class="current_quiz_other_results container">
        <div class="quiz_your_results">
          {{ getQuizTestResults.student_result_description.description }}
        </div>
        <div class="quiz_other_results">
          <Heading level="4" class="quiz_other_results__title"
            >Результаты других:</Heading
          >
          <div
            v-for="item in getQuizTestResults.all_students_results"
            :key="item.id"
            class="quiz_other_results__item"
          >
            <div class="item_progress_bar__wrapper">
              <div
                :style="`width: ${item.grade}%`"
                class="item_progress_bar"
              ></div>
            </div>
            <div class="item_info" :class="{ isYou: isYouId === item.id }">
              <span :style="{ 'font-weight': 'bold' }">{{ item.grade }}%</span>
              {{ item.type[getSelectedLanguage] }}
            </div>
          </div>
        </div>
      </div>
      <template v-if="!!relatedCourses.length">
        <RelatedCourses
          v-if="relatedCourses.length > 1"
          :related-courses="relatedCourses"
        />
        <RelatedCoursesOne v-else :related-courses="relatedCourses" />
      </template>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import QuizTestHeader from '@/components/Tests/QuizTests/QuizTestHeader.vue';
import RelatedCourses from '@/components/Tests/QuizTests/RelatedCourses.vue';
import RelatedCoursesOne from '@/components/Tests/QuizTests/RelatedCoursesOne.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { getFromLS, setToLS } from '../../../library/helpers';
import moment from 'moment';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    QuizTestHeader,
    RelatedCourses,
    RelatedCoursesOne,
    Loader,
    // LessonCard,
  },

  props: {},

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getSelectedLanguage',
      'getQuizTest',
      'getQuizTestPassingId',
      'getQuizTestResults',
    ]),
    resultsTitle() {
      return (
        this.getQuizTest.title +
        this.$t('tests.quiz_results', {
          spanColor: MAIN_COLORS[this.getCoursesMode].text,
        })
      );
    },

    otherResults() {
      return this.getQuizTestResults.all_students_results;
    },

    relatedCourses() {
      return this.getQuizTestResults.student_result_description.related_courses;
    },

    yourDescription() {
      return !!this.getQuizTestResults.student_result_description?.description
        ? this.getQuizTestResults.student_result_description.description
        : '';
    },
    yourType() {
      return !!this.getQuizTestResults.student_result_description
        ? this.getQuizTestResults.student_result_description.type
        : '';
    },
    isYouId() {
      return this.otherResults.find(
        (el) =>
          el.type[this.getSelectedLanguage] ===
          this.getQuizTestResults.student_result_description.type
      ).id;
    },
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.getQuizTestResultsAndTest();
    },
  },

  async created() {
    this.isLoader = true;
    await this.getQuizTestResultsAndTest();

    this.getCurrentBreadLabel();
    this.isLoader = false;
  },

  methods: {
    async getQuizTestResultsAndTest() {
      await this.$store.dispatch('getQuizTestResults', {
        quiz_passing_id:
          +this.$route.params.quiz_passing_id || this.getQuizTestResults.id,
      });

      await this.$store.dispatch('getQuizTest', {
        quiz_id: this.getQuizTestResults.quiz_test_id,
      });
    },

    getCurrentBreadLabel() {
      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: this.getQuizTest.category.title,
        test_title: this.getQuizTest.title,
        quiz_id: this.getQuizTestResults.quiz_test_id,
        results: 'breadCrumbs.results',
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.trial_main_loader
  display: flex
  align-items: center
  justify-content: center
  margin: 100px 0

.current_quiz_other_results
  display: flex
  justify-content: space-between
  margin-bottom: 80px
  @include s
    flex-wrap: wrap

.quiz_other_results
  background-color: var(--color-white)
  max-width: 374px
  width: 100%
  padding: 32px
  margin-left: 80px
  @include s
    max-width: 100%
    margin-left: 0
    margin-top: 40px

.item_progress_bar__wrapper
  width: 100%

.item_progress_bar
  background-color: #FDC82F
  height: 6px
  margin-bottom: 8px

.item_info
  display: flex
  gap: 16px
  margin-bottom: 32px

.quiz_other_results__item:last-child .item_info
  margin-bottom: 0

.item_info.isYou
  font-weight: bold

.quiz_your_results
  width: 100%
  background: var(--color-white)
  padding: 32px
</style>
