<template>
  <div className="individual_task">
    <template v-if="individualTask && taskProgress">
      <IndividualTaskHeader :task="individualTask" />
      <IndividualTaskMain
        :task="individualTask"
        :task-progress="taskProgress"
      />
    </template>
    <Loader v-else color="orange" />
  </div>
</template>

<script>
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
      taskProgress: null,
      isLoader: false,
    };
  },

  async created() {
    this.isLoader = true;

    await this.fetchIndividualTask();
    await this.fetchIndividualTaskProgress();
    this.isLoader = false;
  },

  methods: {
    async fetchIndividualTaskProgress() {
      this.taskProgress = await this.$store.dispatch(
        'getIndividualTaskProgress',
        this.$route.params.task_progress_id
      );
    },

    async fetchIndividualTask() {
      this.individualTask = await this.$store.dispatch(
        'getIndividualTask',
        this.$route.params.lesson_id
      );
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
