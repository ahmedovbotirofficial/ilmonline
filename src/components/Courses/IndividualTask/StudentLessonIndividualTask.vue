<template>
  <div class="individual_task">
    <template v-if="individualTask && getMyProgressOfCourse && taskProgress">
      <IndividualTaskHeader
        :task="individualTask"
        :task-progress="taskProgress"
      />
      <IndividualTaskMain
        :task="individualTask"
        :task-progress="taskProgress"
      />
    </template>
    <Loader v-else color="orange" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IndividualTaskHeader from '@/components/Courses/IndividualTask/IndividualTaskLayout/IndividualTaskHeader/IndividualTaskHeader';
import IndividualTaskMain from '@/components/Courses/IndividualTask/IndividualTaskLayout/IndividualTaskMain/IndividualTaskMain';
import Loader from '@/elements/Loader/Loader';

export default {
  components: {
    IndividualTaskMain,
    IndividualTaskHeader,
    Loader,
  },

  data() {
    return {
      individualTask: null,
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getUserRole',
      'getMyProgressOfCourse',
      'getCoursesModeDispatch',
      'getSelectedLanguage',
    ]),
    taskProgress() {
      return this.getMyProgressOfCourse
        ? this.getMyProgressOfCourse.lessonProgress.find(
            (el) => el.lesson_id === this.individualTask.lesson_id
          ).taskProgress
        : null;
    },
  },

  watch: {
    async getSelectedLanguage(value) {
      value && this.fetchIndividualTaskData();
    },
  },

  async created() {
    this.isLoader = true;

    await this.fetchIndividualTaskData();

    if (!this.individualTask.is_started) await this.startIndividualTask();

    this.isLoader = false;
  },

  methods: {
    async fetchIndividualTaskData() {
      let res1 = this.fetchIndividualTask();
      let res2 = this.fetchCourseProgress();
      Promise.all([await res1, await res2]);
    },
    async fetchCourseProgress() {
      await this.$store.dispatch(
        `getMy${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_id
      );

      this.$store.commit('SET_CURR_BREAD_LABEL', {
        current_course_name: this.getMyProgressOfCourse.course_title,
        current_course_individual_task: 'breadCrumbs.individual_task',
      });
    },

    async fetchIndividualTask() {
      this.individualTask = await this.$store.dispatch(
        'getIndividualTask',
        this.$route.params.lesson_id
      );
    },

    async startIndividualTask() {
      await this.$store.dispatch('startIndividualTask', this.$route.params);
    },
  },
};
</script>

<style lang="sass" scoped>
.loader
  display: flex
  height: 500px
  background-color: var(--color-white)
</style>
