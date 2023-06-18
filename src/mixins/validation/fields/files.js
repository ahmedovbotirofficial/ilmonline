export default {
  computed: {
    isFilesError() {
      return !!this.getErrors.file;
    },
    filesErrorText() {
      if (!!this.getErrors.file) {
        return this.getErrors.file[0];
      }
    },
  },
};
