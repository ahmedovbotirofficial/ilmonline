<template>
  <div class="individual_task__teacher_view">
    <div class="individual_task__your_student_response">
      <div class="individual_task__response_title">
        {{ $t('individual_task.answer') }}:
      </div>

      <div class="individual_task__student_name">
        {{ taskProgress.student_full_name }}
      </div>
      <div class="individual_task__response_text">
        {{ taskProgress.student_comment }}
      </div>
      <template v-if="taskProgress.files.length">
        <FilesUpload
          id="files-download"
          class="individual_task__response_files"
          :task-progress-id="taskProgress.id"
          :files-uploaded="taskProgress.files"
          is-download-only
        />
        <ButtonBase
          class="individual_task__download_btn"
          color="transparent"
          size="max"
          @click.native="getFilesArchiveFromStudent"
        >
          <template v-if="!isDownloadLoader">
            <span> {{ $t('individual_task.download') }} </span>
            <svg-icon name="icon_download" />
          </template>
          <span v-else>
            <Loader color="white" size="small" />
          </span>
        </ButtonBase>
      </template>
    </div>
    <div class="individual_task__teacher_result">
      <div class="individual_task__response_title">
        {{ $t('individual_task.your_grade') }}:
      </div>
      <div class="individual_task__status">
        <span
          v-if="taskProgress.is_read_by_teacher"
          :style="{
            color: taskGradeColor,
          }"
          >{{ taskProgress.grade }} {{ $t('individual_task.points') }}.</span
        >
        {{ taskStatusText }}
      </div>
      <ButtonBase
        class="individual_task__btn"
        color="orange"
        size="max"
        @click.native="backToMyStudents"
      >
        <template v-if="!isLoader">
          <span> {{ $t('buttons.go_back_to_students') }} </span>
        </template>
        <span v-else>
          <Loader color="white" size="small" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import Loader from '@/elements/Loader/Loader.vue';
import FilesUpload from '@/elements/Inputs/FilesUpload';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    FilesUpload,
    Loader,
  },
  props: {
    taskProgress: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDownloadLoader: false,
      isLoader: false,
    };
  },
  computed: {
    isNotPassedTask() {
      return (
        this.taskProgress.is_read_by_teacher && this.taskProgress.grade < 70
      );
    },
    taskStatusText() {
      return this.isNotPassedTask
        ? this.$t('individual_task.not_passed')
        : this.$t('individual_task.passed');
    },
    taskGradeColor() {
      return this.isNotPassedTask
        ? MAIN_COLORS.school.button
        : MAIN_COLORS.pro.button;
    },
  },
  methods: {
    async getFilesArchiveFromStudent() {
      this.isDownloadLoader = true;
      const response = await this.$store.dispatch(
        'getFilesArchiveFromStudent',
        this.taskProgress.id
      );
      this.isDownloadLoader = false;

      const blob = new Blob([response.data], {
        type: 'application/zip',
      });

      let link = document.createElement('a');
      link.download = `${this.taskProgress.student_full_name} task ${this.taskProgress.id}`;

      link.href = URL.createObjectURL(blob);
      link.click();
      link.remove();

      URL.revokeObjectURL(link.href);
    },
    backToMyStudents() {
      this.$router.push({
        name: 'students',
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__your_student_response,
.individual_task__teacher_result
  background-color: var(--color-white)
  padding: 32px
  @include xxs
    padding: 16px

.individual_task__teacher_result
  margin-top: 24px

.individual_task__response_title
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 26)
  font-weight: 600

.individual_task__student_name
  @include adaptive-font-size(18, 18, 16)
  @include adaptive-line-height(24, 24, 22)
  font-weight: 600
  color: #F2BE27
  margin-top: 8px

.individual_task__response_text
  @include adaptive-font-size(16, 16, 14)
  @include adaptive-line-height(24, 24, 22)
  margin-top: 16px

  a
    color: #055dff
    text-decoration: underline

.individual_task__response_files
  margin-top: 24px
  @include xxs
    margin-top: 20px

.individual_task__download_btn,
.individual_task__btn
  margin-top: 40px
  @include xxs
    margin-top: 32px

.individual_task__download_btn svg
  fill: var(--color-main)
  transition: var(--transition-speed)

.individual_task__download_btn:hover svg
  fill: var(--color-white)

.individual_task__status
  @include adaptive-font-size(20, 20, 18)
  @include adaptive-line-height(32, 32, 26)
  font-weight: 600
  margin: 16px 0 32px 0
</style>
