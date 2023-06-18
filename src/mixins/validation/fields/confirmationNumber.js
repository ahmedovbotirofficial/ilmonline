import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  validations: {
    confirmationNumber: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(6),
    },
  },
  computed: {
    isConfirmationNumberError() {
      return (
        (this.$v.confirmationNumber.$dirty &&
          this.$v.confirmationNumber.$invalid) ||
        !!this.getErrors.otp_number
      );
    },
    confirmationNumberErrorText() {
      if (
        !this.$v.confirmationNumber.required ||
        !this.$v.confirmationNumber.minLength ||
        !this.$v.confirmationNumber.maxLength
      ) {
        return this.$t('form.confirm_number_length');
      }
      if (!!this.getErrors.otp_number) {
        return this.getErrors.otp_number[0];
      }
    },
  },
};
