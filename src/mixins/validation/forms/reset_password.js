import passwordValidation from '@/mixins/validation/fields/password';
import confirmPasswordValidation from '@/mixins/validation/fields/confirmPassword';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [passwordValidation, confirmPasswordValidation, validationsMethods],
  validations: {
    ...passwordValidation.validations,
    ...confirmPasswordValidation.validations,
  },
};
