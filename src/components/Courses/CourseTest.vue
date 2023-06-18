<template>
  <div class="current_test">
    <CourseTestHeader
      :test-info-for-header="testInfoForHeader"
      :window-width="getWindowWidth"
      @clearTest="deleteTest"
    />
    <div v-if="isLoader" class="current_test_loader">
      <Loader color="orange" />
    </div>
    <div v-else>
      <CourseTestPassing
        v-if="!getEndedLessonTestStatus"
        :window-width="getWindowWidth"
      />
      <CourseTestResults
        v-else
        :window-width="getWindowWidth"
        :test-progress-status="testInfoForHeader"
      />
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import CourseTestHeader from '@/components/Courses/CourseTestHeader.vue';
import CourseTestPassing from '@/components/Courses/CourseTestPassing.vue';
import CourseTestResults from '@/components/Courses/CourseTestResults.vue';
import Loader from '@/elements/Loader/Loader.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    CourseTestHeader,
    CourseTestPassing,
    CourseTestResults,
    Loader,
  },

  data() {
    return {
      testInfoForHeader: {
        testNumber: this.$route.params.test_id,
        correct_answers: 0,
        total_answers: 0,
      },

      currentCourseProgress: null,

      isLoader: false,

      questions_count: 0,
    };
  },

  computed: {
    ...mapGetters([
      'getMyProgressOfCourse',
      'getEndedLessonTestStatus',
      'getLessonTest',
      'getSelectedLanguage',
      'getWindowWidth',
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getUserRole',
      'getLeavePageStatus',
      'getLessonTestProgress',
    ]),
  },

  watch: {
    // getEndedLessonTestStatus(value) {
    //   if (value) {
    //     this.fetchCourseProgress();
    //   }
    // },
    getSelectedLanguage(value) {
      value && this.fetchCourseProgress();
    },
  },

  mounted() {
    document.documentElement.classList.remove('overflow_hidden');
  },
  async created() {
    await this.fetchCourseProgress();
    this.$store.commit('SET_CURR_BREAD_LABEL', {
      current_course_name: this.getMyProgressOfCourse.course_title,
      current_course_test: 'breadCrumbs.test_name',
      //  + `${this.getLessonTest.id}`,
    });
    // this.deleteTest();
  },

  beforeRouteLeave(to, from, next) {
    if (!this.getEndedLessonTestStatus) {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'leave-page',
        props: to,
      });
      if (this.getLeavePageStatus) {
        next();
      } else {
        return false;
      }
    } else {
      next();
    }
  },

  methods: {
    async fetchCourseProgress() {
      this.isLoader = true;
      await this.$store.dispatch(
        `getMy${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_id
      );

      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}LessonTest`,
        {
          lesson_id: +this.$route.params.lesson_id,
        }
      );

      this.questions_count = this.getLessonTest.questions_count;
      this.testInfoForHeader.total_answers = this.questions_count;

      // console.log('this.getLessonTest', this.getLessonTest.lesson_id);
      // console.log(
      //   'this.lessonProgress',
      //   this.getMyProgressOfCourse.lessonProgress
      // );

      let endedTest =
        this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === this.getLessonTest.lesson_id
        ).testProgress.length === this.questions_count;
      this.$store.commit('SET_ENDED_LESSON_TEST', endedTest);

      this.$store.commit(
        'SET_LESSON_TEST_PROGRESS',
        this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === this.getLessonTest.lesson_id
        ).testProgress
      );

      if (this.getEndedLessonTestStatus) {
        await this.$store.dispatch(
          `get${this.getCoursesModeDispatch}LessonTestRightResponses`,
          {
            lesson_id: this.$route.params.lesson_id,
          }
        );
      }
      this.isLoader = false;
    },

    deleteTest() {
      // console.log(this.$route.params.test_id);
      this.$store.dispatch(`delete${this.getCoursesModeDispatch}LessonTest`, {
        test_id: this.getLessonTest.id,
      });
      this.fetchCourseProgress();
    },
  },
};
</script>

<style lang="sass" scoped>
.current_test_loader
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
</style>
