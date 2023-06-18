<template>
  <div class="trial_main">
    <div v-if="isLoader" class="trial_main_loader">
      <Loader color="orange" />
    </div>

    <div v-else>
      <TrialTestHeader
        v-if="selectedTestType === 'trial'"
        svg-name="trial_header_icon"
      />
      <QuizTestHeader
        v-else
        img="quiz_header_icon"
        svg-name="trial_header_icon"
      />

      <!-- <FingerprintJS /> -->

      <div class="container">
        <div class="main_test__row">
          <div class="tests_filter_btns">
            <button
              v-for="{ id } in availableFiltersBtns"
              :key="id"
              class="tests_filter_btn"
              :class="selectedTestType === id ? 'active' : ''"
              :disabled="selectedTestType === id"
              @click="selectTestType(id)"
            >
              {{ $t(`buttons.${id}`) }}
            </button>
          </div>

          <SortingOrderQuiz
            v-if="selectedTestType !== 'trial'"
            :order-list="getQuizSubCategories"
            :order-by="orderBy"
            @selectOrderBy="selectOrderBy"
          />
        </div>
      </div>

      <Loader v-if="isSubCategoriesLoader" color="orange" />

      <TestsDirections
        v-else
        :selected-test-type="selectedTestType"
        :type-of-tests-data="typeOfTestsData"
      />
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import TestsDirections from '@/components/Tests/TestsDirections.vue';
import TrialTestHeader from '@/components/Tests/TrialTests/TrialTestHeader.vue';
import QuizTestHeader from '@/components/Tests/QuizTests/QuizTestHeader.vue';
import SortingOrderQuiz from '@/elements/SortingOrder/SortingOrderQuiz.vue';
import Loader from '@/elements/Loader/Loader.vue';

// import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';

import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    TrialTestHeader,
    QuizTestHeader,
    TestsDirections,
    Loader,
    SortingOrderQuiz,
    // Heading,
    // ButtonBase,
  },
  data() {
    return {
      isLoader: false,
      isSubCategoriesLoader: false,

      orderBy: {
        id: null,
        title: 'quiz_sub_categories',
      },

      filtersBtns: [
        {
          id: 'trial',
        },
        {
          id: 'quiz',
        },
      ],
      selectedTestType: null,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getTrialCategories',
      'getQuizCategories',
      'getQuizSubCategories',
      'getSelectedLanguage',
    ]),

    availableFiltersBtns() {
      return this.getCoursesMode === COURSES_MODES.SCHOOL
        ? this.filtersBtns
        : [];
    },

    typeOfTestsData() {
      return this.selectedTestType === 'trial'
        ? this.getTrialCategories
        : this.getQuizCategories;
    },
  },

  watch: {
    getSelectedLanguage(value) {
      if (value) {
        this.isLoader = true;
        if (this.selectedTestType === 'trial') {
          this.fetchTrialTestCategories();
        } else {
          this.fetchQuizTestCategories();
        }
      }
    },
  },

  created() {
    this.isLoader = true;
    if (this.getCoursesMode === COURSES_MODES.SCHOOL) {
      this.selectedTestType = 'trial';
      this.fetchTrialTestCategories();
    } else {
      this.selectedTestType = 'quiz';
      this.fetchQuizTestCategories();
      this.fetchQuizTestSubCategories();
    }
  },

  methods: {
    async fetchTrialTestCategories() {
      await this.$store.dispatch('getTrialTestCategories');
      this.isLoader = false;
    },

    async fetchQuizTestCategories() {
      await this.$store.dispatch('getQuizTestCategories');
      await this.$store.dispatch('getQuizSubCategories');

      this.isLoader = false;
    },

    async fetchQuizTestSubCategories() {
      await this.$store.dispatch('getQuizSubCategories');
    },

    async selectTestType(slug) {
      this.isLoader = true;
      this.selectedTestType = slug;
      if (this.selectedTestType === 'trial') {
        await this.$store.dispatch('getTrialTestCategories');
      } else {
        await this.$store.dispatch('getQuizTestCategories');
        await this.fetchQuizTestSubCategories();
      }
      this.isLoader = false;
    },

    async selectOrderBy(id) {
      this.isSubCategoriesLoader = true;
      this.orderBy = this.getQuizSubCategories.find((el) => el.id === id);
      await this.$store.dispatch(
        'getQuizCategoriesBySubCategories',
        this.orderBy
      );
      this.isSubCategoriesLoader = false;

      // console.log(this.orderBy);
      // this.fetchCoursesList();
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

.tests_filter_btns
  display: flex
  flex-wrap: wrap
  gap: 32px

  @include s
    gap: 20px 8px

.tests_filter_btn
  display: flex
  align-items: center
  justify-content: center
  padding: 6px 24px
  @include adaptive-font-size(18, 18, 12)
  @include adaptive-line-height(32, 32, 18)
  border: 1px solid transparent
  cursor: pointer

  @include xs
    // flex: 0 0 calc((100% / 3) - 16px / 3)
    margin-bottom: 24px

  @include xxs
    padding: 6px 10px

  @include xxxs
    padding: 6px 4px

.tests_filter_btn:hover
  color: var(--color-main)

.tests_filter_btn.active
  border: 1px solid var(--color-main)

.tests_filter_btn[disabled]
  cursor: default

.main_test__row
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 40px

  @include s
    margin-bottom: 24px
  @include xs
    flex-direction: column
    align-items: flex-start
    margin-bottom: 40px
</style>
