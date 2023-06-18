<template>
  <div class="individual_task__main">
    <div class="container">
      <div class="individual_task__inner">
        <IndividualTaskDescription :task="task" />
        <IndividualTaskResponse
          v-if="!isTeacherOnlyViewTask"
          :task="task"
          :task-progress="taskProgress"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IndividualTaskDescription from '@/components/Courses/IndividualTask/IndividualTaskLayout/IndividualTaskMain/IndividualTaskDescription';
import IndividualTaskResponse from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskResponse';

export default {
  components: { IndividualTaskDescription, IndividualTaskResponse },
  props: {
    task: {
      type: Object,
      required: true,
    },
    taskProgress: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(['getUserRole']),
    isTeacherOnlyViewTask() {
      return (
        this.getUserRole === 'teacher' && !this.$route.params.task_progress_id
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__main
  padding: 40px 0 130px 0
  @include s
    padding: 40px 0 68px 0
  @include xxs
    padding: 32px 0 50px 0

.individual_task__inner
  display: grid
  grid-template-columns: repeat(2, calc(50% - 40px))
  gap: 80px
  @include s
    grid-template-columns: 1fr
    gap: 40px
  @include xxs
    gap: 32px
</style>
