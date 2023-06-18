import phoneValidation from '@/mixins/validation/fields/phone';
import messangerNameValidation from '@/mixins/validation/fields/messanger_name';
import fullNameValidation from '@/mixins/validation/fields/fullName';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    phoneValidation,
    messangerNameValidation,
    fullNameValidation,
    validationsMethods,
  ],
  validations: {
    ...phoneValidation.validations,
    ...messangerNameValidation.validations,
    ...fullNameValidation.validations,
  },
};
