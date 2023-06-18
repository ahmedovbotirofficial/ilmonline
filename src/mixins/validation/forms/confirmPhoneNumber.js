import confirmationNumberValidation from '@/mixins/validation/fields/confirmationNumber';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [confirmationNumberValidation, validationsMethods],
  validations: {
    ...confirmationNumberValidation.validations,
  },
};
