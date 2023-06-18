import emailValidation from '@/mixins/validation/fields/email';
import fullNameValidation from '@/mixins/validation/fields/fullName';
import messangerNameValidation from '@/mixins/validation/fields/messanger_name';
import userMessageValidation from '@/mixins/validation/fields/user_message';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    emailValidation,
    userMessageValidation,
    fullNameValidation,
    messangerNameValidation,
    validationsMethods,
  ],
  validations: {
    ...emailValidation.validations,
    ...messangerNameValidation.validations,
    ...userMessageValidation.validations,
    ...fullNameValidation.validations,
  },
};
