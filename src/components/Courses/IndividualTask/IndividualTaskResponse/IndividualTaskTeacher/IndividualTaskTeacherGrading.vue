<template>
  <div class="individual_task__teacher_grading">
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
      <div class="individual_task__response_grade_title">
        {{ $t('individual_task.your_grade') }}:
      </div>
      <TextField
        id="grade"
        v-model.trim="grade"
        :placeholder="$t('individual_task.enter_grade')"
        class="individual_task__response_grade"
        type="number"
        name="grade"
        value-mask="numbers"
        :error="isGradeError"
        :error-txt="gradeErrorText"
      />
      <ButtonBase
        class="individual_task__btn"
        color="orange"
        size="max"
        @click.native="gradeIndividualTask"
      >
        <span v-if="!isLoader"> {{ $t('buttons.send_btn') }} </span>
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
import gradeValidation from '@/mixins/validation/forms/individual_task_grading';

export default {
  components: {
    FilesUpload,
    Loader,
  },
  mixins: [gradeValidation],
  props: {
    taskProgress: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      grade: '',
      isDownloadLoader: false,
      isLoader: false,
    };
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
    async gradeIndividualTask() {
      if (this.isInvalidForm) {
        this.showValidationErrors();
        return;
      }

      this.isLoader = true;
      await this.$store.dispatch('gradeIndividualTask', {
        task_progress_id: this.taskProgress.id,
        data: {
          grade: this.grade,
        },
      });
      this.isLoader = false;
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

.individual_task__response_title,
.individual_task__response_grade_title
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

.individual_task__response_grade
  margin-top: 16px
</style>
