<template>
  <div v-if="taskProgress" class="individual_task__student_response">
    <IndividualTaskStudentView
      v-if="
        taskProgress.is_ready_for_teacher_viewing ||
        taskProgress.is_read_by_teacher
      "
      :task-progress="taskProgress"
    />
    <IndividualTaskStudentPassing v-else :task-progress="taskProgress" />
  </div>
</template>

<script>
import IndividualTaskStudentPassing from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskStudent/IndividualTaskStudentPassing';
import IndividualTaskStudentView from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskStudent/IndividualTaskStudentView';

export default {
  components: {
    IndividualTaskStudentPassing,
    IndividualTaskStudentView,
  },
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
};
</script>

<style lang="sass" scoped></style>
