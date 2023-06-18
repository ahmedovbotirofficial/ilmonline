import oldPasswordValidation from '@/mixins/validation/fields/old_password';
import passwordValidation from '@/mixins/validation/fields/password';
import confirmPasswordValidation from '@/mixins/validation/fields/confirmPassword';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    oldPasswordValidation,
    passwordValidation,
    confirmPasswordValidation,
    validationsMethods,
  ],
  validations: {
    ...oldPasswordValidation.validations,
    ...passwordValidation.validations,
    ...confirmPasswordValidation.validations,
  },
};
