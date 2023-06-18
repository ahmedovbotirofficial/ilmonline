<template>
  <div class="current_test">
    <div v-if="isLoader" class="current_test_loader">
      <Loader color="orange" />
    </div>
    <template v-else>
      <TeacherTestWatchingHeader />
      <CourseTestResultTeacher />
    </template>
  </div>
</template>

<script>
import CourseTestResultTeacher from '@/components/StudentCourseProgress/CourseTestResultTeacher.vue';
import TeacherTestWatchingHeader from '@/components/StudentCourseProgress/TeacherTestWatchingHeader.vue';
import Loader from '@/elements/Loader/Loader.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    TeacherTestWatchingHeader,
    CourseTestResultTeacher,
    Loader,
  },

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getTeacherLessonProgress',
      'getLessonTest',
      'getSelectedLanguage',
      'getUserRole',
      'getCoursesMode',
      'getCoursesModeDispatch',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchTestData();
    },
  },

  mounted() {
    document.documentElement.classList.remove('overflow_hidden');
  },

  async created() {
    await this.fetchTestData();
  },

  methods: {
    async fetchTestData() {
      this.isLoader = true;

      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}TeacherLessonProgress`,
        {
          lesson_progress_id: +this.$route.params.lesson_progress_id,
        }
      );

      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}LessonTest`,
        {
          lesson_id: this.getTeacherLessonProgress.lesson_id,
        }
      );

      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}LessonTestRightResponses`,
        {
          lesson_id: this.getTeacherLessonProgress.lesson_id,
        }
      );

      this.isLoader = false;
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
