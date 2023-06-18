import { required, email } from 'vuelidate/lib/validators';

export default {
  validations: {
    isSelectedRole: {
      value: {
        required,
      },
    },
  },
  computed: {
    isValidRole() {
      return !!(
        this.$v.isSelectedRole.value.$invalid &&
        this.$v.isSelectedRole.value.$dirty
      );
    },
  },
};
