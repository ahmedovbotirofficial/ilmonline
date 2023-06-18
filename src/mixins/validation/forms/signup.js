import emailValidation from '@/mixins/validation/fields/email';
import passwordValidation from '@/mixins/validation/fields/password';
import roleValidation from '@/mixins/validation/fields/role';
import fullNameValidation from '@/mixins/validation/fields/fullName';
import confirmPasswordValidation from '@/mixins/validation/fields/confirmPassword';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    roleValidation,
    fullNameValidation,
    emailValidation,
    passwordValidation,
    confirmPasswordValidation,
    validationsMethods,
  ],
  validations: {
    ...roleValidation.validations,
    ...fullNameValidation.validations,
    ...emailValidation.validations,
    ...passwordValidation.validations,
    ...confirmPasswordValidation.validations,
  },
};
