import gradeValidation from '@/mixins/validation/fields/grade';
import filesValidation from '@/mixins/validation/fields/files';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [gradeValidation, filesValidation, validationsMethods],
  validations: {
    ...gradeValidation.validations,
    ...filesValidation.validations,
  },
};
