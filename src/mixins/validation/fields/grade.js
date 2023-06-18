import { required, between } from 'vuelidate/lib/validators';

export default {
  validations: {
    grade: {
      required,
      between: between(1, 100),
    },
  },
  computed: {
    isGradeError() {
      return (
        (this.$v.grade.$dirty && this.$v.grade.$invalid) ||
        !!this.getErrors.grade
      );
    },
    gradeErrorText() {
      if (!this.$v.grade.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.grade.between) {
        return this.$t('form.grade_between_numbers');
      }
    },
  },
};
