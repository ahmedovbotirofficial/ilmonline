<template>
  <div class="individual_task__response">
    <component :is="componentName" :task="task" :task-progress="taskProgress" />
  </div>
</template>

<script>
import IndividualTaskStudentResponse from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskStudent/IndividualTaskStudentResponse';
import IndividualTaskTeacherResponse from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskTeacher/IndividualTaskTeacherResponse';
import { mapGetters } from 'vuex';

export default {
  components: { IndividualTaskStudentResponse, IndividualTaskTeacherResponse },
  props: {
    task: {
      type: Object,
      required: true,
    },
    taskProgress: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getUserRole']),
    componentName() {
      return `individual-task-${this.getUserRole}-response`;
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__response
  align-self: start
</style>
