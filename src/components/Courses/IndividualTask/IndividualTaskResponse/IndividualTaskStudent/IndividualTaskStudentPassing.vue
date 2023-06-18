<template>
  <form class="individual_task__student_passing" novalidate @submit.prevent>
    <div class="individual_task__response_title">
      {{ $t('individual_task.your_answer') }}:
    </div>

    <TextArea
      id="student-comment"
      v-model.trim="studentComment"
      :placeholder="$t('individual_task.answer_placeholder')"
      class="individual_task__response_input"
      name="student-comment"
      :max-length="1000"
      :error="isStudentCommentError"
      :error-txt="studentCommentErrorText"
    />
    <FilesUpload
      id="files-upload"
      v-model="files"
      :task-progress-id="taskProgress.id"
      is-multiple
      :files-uploaded="files"
      :valid-formats="validFilesFormats"
      :max-size-kb="5000"
      :max-count-files="5"
      :is-error="isFilesError"
      :error-text="filesErrorText"
    />

    <ButtonBase
      class="individual_task__btn"
      color="orange"
      size="max"
      @click.native="sendIndividualTask"
    >
      <span v-if="!isLoader"> {{ $t('buttons.send_btn') }} </span>
      <span v-else>
        <Loader color="white" size="small" />
      </span>
    </ButtonBase>
  </form>
</template>

<script>
import FilesUpload from '@/elements/Inputs/FilesUpload';
import TextArea from '@/elements/Inputs/TextArea';
import Loader from '@/elements/Loader/Loader.vue';
import studentCommentValidation from '@/mixins/validation/forms/individual_task';

export default {
  components: {
    FilesUpload,
    TextArea,
    Loader,
  },
  mixins: [studentCommentValidation],
  props: {
    taskProgress: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      studentComment: '',
      files: [],
      isLoader: false,
    };
  },
  computed: {
    validFilesFormats() {
      return [
        'png',
        'jpg',
        'jpeg',
        'pdf',
        'doc',
        'xlsx',
        'xls',
        'txt',
        'rtf',
        'html',
        'gif',
      ];
    },
  },
  created() {
    if (!!this.taskProgress.files.length)
      this.files = [...this.taskProgress.files];
  },
  methods: {
    async sendIndividualTask() {
      if (this.isInvalidForm) {
        this.showValidationErrors();
        return;
      }

      let formData = new FormData();
      formData.append('student_comment', this.studentComment);

      this.isLoader = true;
      await this.$store.dispatch('sendIndividualTask', {
        ...this.$route.params,
        data: formData,
      });
      this.isLoader = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__student_passing
  background-color: var(--color-white)
  padding: 32px
  @include xxs
    padding: 16px

.individual_task__response_title
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 26)
  font-weight: 600

.individual_task__response_input
  margin: 24px 0
  @include xxs
    margin: 16px 0

.individual_task__btn
  margin-top: 40px
  @include xxs
    margin-top: 32px
</style>
