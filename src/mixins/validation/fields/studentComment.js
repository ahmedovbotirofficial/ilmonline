import { required, maxLength } from 'vuelidate/lib/validators';

export default {
  validations: {
    studentComment: {
      required,
      maxLength: maxLength(1000),
    },
  },
  computed: {
    isStudentCommentError() {
      return (
        (this.$v.studentComment.$dirty && this.$v.studentComment.$invalid) ||
        !this.$v.studentComment.maxLength ||
        !!this.getErrors.studentComment
      );
    },
    studentCommentErrorText() {
      if (!this.$v.studentComment.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.studentComment.maxLength) {
        return `${this.$t('form.field_max_length')} - 1000`;
      }
    },
  },
};
