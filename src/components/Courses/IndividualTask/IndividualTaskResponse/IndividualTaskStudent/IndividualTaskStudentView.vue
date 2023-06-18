<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="individual_task__student_view">
    <div class="individual_task__student_my_response">
      <div class="individual_task__response_title">
        {{ $t('individual_task.your_answer') }}:
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
          @click.native="getUploadedFilesArchive"
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
    <div class="individual_task__student_result">
      <div class="individual_task__response_title">
        {{ $t('individual_task.your_grade') }}:
      </div>
      <div
        class="individual_task__status"
        :class="{
          review: !taskProgress.is_read_by_teacher,
        }"
      >
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
        :color="resultButtonColor"
        size="max"
        @click.native="resultBtnHandler"
      >
        <template v-if="!isLoader">
          <span v-html="resultButtonText"></span>
        </template>
        <span v-else>
          <Loader color="white" size="small" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';
import FilesUpload from '@/elements/Inputs/FilesUpload';
import Loader from '@/elements/Loader/Loader.vue';

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
    ...mapGetters(['getUserRole']),
    isNotPassedTask() {
      return (
        this.taskProgress.is_read_by_teacher && this.taskProgress.grade < 70
      );
    },
    taskStatusText() {
      return !this.taskProgress.is_read_by_teacher
        ? this.$t('individual_task.under_review')
        : this.isNotPassedTask
        ? this.$t('individual_task.not_passed')
        : this.$t('individual_task.passed');
    },
    taskGradeColor() {
      return this.isNotPassedTask
        ? MAIN_COLORS.school.button
        : MAIN_COLORS.pro.button;
    },
    resultButtonText() {
      return this.isNotPassedTask
        ? this.$t('buttons.repass_task')
        : this.$t('buttons.go_back_to_lesson');
    },
    resultButtonColor() {
      return this.isNotPassedTask ? 'dark-blue' : 'orange';
    },
  },
  methods: {
    async getUploadedFilesArchive() {
      this.isDownloadLoader = true;
      const response = await this.$store.dispatch(
        'getUploadedFilesArchive',
        this.taskProgress.id
      );
      this.isDownloadLoader = false;

      const blob = new Blob([response.data], {
        type: 'application/zip',
      });

      let link = document.createElement('a');
      link.download = `My task ${this.taskProgress.id}`;

      link.href = URL.createObjectURL(blob);
      link.click();
      link.remove();

      URL.revokeObjectURL(link.href);
    },
    backToLesson() {
      this.$router.push({
        name: `${this.getUserRole}-video`,
        params: {
          course_id: this.$route.params.course_id,
          lesson_id: +this.$route.params.lesson_id,
        },
      });
    },
    async retakeTask() {
      this.isLoader = true;
      await this.$store.dispatch(
        'retakeIndividualTaskProgress',
        this.taskProgress.id
      );
      this.isLoader = false;
    },
    resultBtnHandler() {
      return this.isNotPassedTask ? this.retakeTask() : this.backToLesson();
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__student_my_response,
.individual_task__student_result
  background-color: var(--color-white)
  padding: 32px
  @include xxs
    padding: 16px

.individual_task__student_result
  margin-top: 24px

.individual_task__response_title
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 26)
  font-weight: 600

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

.individual_task__download_btn
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

.individual_task__status.review
  color: #F2BE27

.individual_task__btn::v-deep .desk
    @include xxs
      display: none
</style>
