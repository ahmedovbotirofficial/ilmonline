<template>
  <div v-if="taskProgress" class="individual_task__teacher_response">
    <IndividualTaskTeacherView
      v-if="taskProgress.is_read_by_teacher"
      :task-progress="taskProgress"
    />
    <IndividualTaskTeacherGrading v-else :task-progress="taskProgress" />
  </div>
</template>

<script>
import IndividualTaskTeacherGrading from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskTeacher/IndividualTaskTeacherGrading';
import IndividualTaskTeacherView from '@/components/Courses/IndividualTask/IndividualTaskResponse/IndividualTaskTeacher/IndividualTaskTeacherView';

export default {
  components: {
    IndividualTaskTeacherGrading,
    IndividualTaskTeacherView,
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
