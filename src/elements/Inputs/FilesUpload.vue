<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="files-upload" :class="{ view: isDownloadOnly }">
    <template v-if="isDownloadOnly">
      <a
        v-for="file in filesUploaded"
        :key="file.id"
        target="_blank"
        class="files-upload__link"
        :href="file.file"
        download
        :title="file.filename"
      >
        <div class="files-upload__icon">
          <svg-icon name="upload_file_done" />
        </div>
        <div class="files-upload__info">
          <div class="files-upload__name">{{ file.filename }}</div>
          <div class="files-upload__size">
            {{ getFormattedFileSize(file.bytes) }}
          </div>
        </div>
      </a>
    </template>
    <template v-else>
      <div
        v-for="file in filesUploaded"
        :key="file.id"
        class="files-upload__item"
      >
        <div class="files-upload__icon">
          <svg-icon name="upload_file_done" />
        </div>
        <div class="files-upload__info">
          <div class="files-upload__name">
            {{ file.localname || file.filename }}
          </div>
          <div v-if="file.isUploading" class="files-upload__progress-bar">
            <div
              class="files-upload__progress-value"
              :style="{
                width: `${file.uploadProgress}%`,
              }"
            ></div>
          </div>
          <div v-else class="files-upload__size">
            {{ getFormattedFileSize(file.bytes) }}
          </div>
        </div>
        <button
          class="files-upload__remove-btn"
          @click="deleteUploadedFile(file.hash)"
        >
          <svg-icon name="cross_grey" />
        </button>
      </div>
    </template>
    <template v-if="!isDownloadOnly && isPermissibleFilesCount">
      <div
        class="files-upload__inner"
        @dragenter.prevent
        @dragover.prevent
        @drop.prevent
        @drop="handleFilesDrop"
        @dragenter="dragging = true"
        @dragend="dragging = false"
        @dragleave="dragging = false"
      >
        <label
          :for="id"
          class="files-upload__label"
          :class="{
            dragenter: dragging,
            error: isError || showError,
          }"
        >
          <div class="files-upload__icon">
            <svg-icon name="upload_file" />
          </div>
          <div class="files-upload__text">
            {{ $t('individual_task.select_drag_files') }}
          </div>
          <div
            v-if="showError"
            class="files-upload__error"
            v-html="errorMessage"
          ></div>
          <div v-if="isError" class="files-upload__error">
            {{ errorText }}
          </div>
        </label>
        <input
          :id="id"
          class="files-upload__input"
          :accept="'.' + validFormats.join(',.')"
          type="file"
          :name="id"
          :multiple="isMultiple"
          @change="handleFilesInput"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  model: {
    prop: 'filesUploaded',
    event: 'input',
  },
  props: {
    taskProgressId: {
      type: Number,
      required: true,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    filesUploaded: {
      type: Array,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isInactive: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    id: {
      type: [String, Number],
      default: 0,
    },
    validFormats: {
      type: Array,
      default: () => [],
    },
    maxSizeKb: {
      type: Number,
      default: 0,
    },
    maxCountFiles: {
      type: Number,
      default: 1,
    },
    isDownloadOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentFile: null,
      dragging: false,
      showError: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['getErrors']),
    isPermissibleFilesCount() {
      return this.filesUploaded.length < this.maxCountFiles;
    },
  },

  created() {
    if (!this.filesUploaded) {
      this.$emit('input', []);
    }
  },

  methods: {
    async handleFilesDrop(e) {
      this.dragging = false;
      let files = [...e.dataTransfer.files];

      const isInvalidCountFiles = this.checkExceedCountFiles(files);
      if (isInvalidCountFiles) {
        this.showError = true;
        this.errorMessage = this.$t('individual_task.exceed_files_count');
        return;
      }

      for (const file of files) {
        if (!this.isMultiple && this.filesUploaded.length > 0) return;
        await this.uploadFile(file);
      }
    },
    async handleFilesInput(e) {
      let files = [...e.target.files];

      const isInvalidCountFiles = this.checkExceedCountFiles(files);
      if (isInvalidCountFiles) {
        this.showError = true;
        this.errorMessage = this.$t('individual_task.exceed_files_count');
        return;
      }

      for (const file of files) {
        if (!this.isMultiple && this.filesUploaded.length > 0) return;
        await this.uploadFile(file);
      }
    },
    setUploadProgress(percent) {
      this.$set(this.currentFile, 'uploadProgress', percent);
    },
    async uploadFile(file) {
      if (!!this.currentFile) this.currentFile = null;

      const isValidFile = this.checkValidFile(file);
      if (!isValidFile) return;

      if (this.showError) this.showError = false;
      if (!!this.getErrors.file)
        this.$store.commit('RESET_FIELD_ERROR', 'file');

      let formData = new FormData();
      formData.append('file', file);

      let filesToUpload = [...this.filesUploaded];

      this.currentFile = {
        localname: file.name,
        size: file.size,
        isUploading: true,
        uploadProgress: 0,
        id: Date.now(),
      };

      // console.log('this.currentFile', this.currentFile);

      filesToUpload.push(this.currentFile);
      this.$emit('input', filesToUpload);

      const fileInfo = await this.$store.dispatch('uploadIndividualTaskFile', {
        task_progress_id: this.taskProgressId,
        data: formData,
        onProgress: this.setUploadProgress,
      });

      // console.log('fileInfo', fileInfo);

      const elementIndex = filesToUpload.findIndex(
        (file) =>
          file.localname === this.currentFile.localname &&
          file.size === this.currentFile.size
      );

      // console.log('elementIndex', elementIndex);

      for (let key in fileInfo) {
        this.$set(filesToUpload[elementIndex], key, fileInfo[key]);
      }

      this.$set(filesToUpload[elementIndex], 'isUploading', false);

      this.$emit('input', filesToUpload);
    },
    async deleteUploadedFile(hash) {
      const res = await this.$store.dispatch('deleteIndividualTaskFile', {
        task_progress_id: this.taskProgressId,
        hash,
      });
      if (!!res) {
        let filesAfterRemove = [...this.filesUploaded];

        const index = filesAfterRemove.findIndex((file) => file.hash === hash);
        if (index > -1) {
          filesAfterRemove.splice(index, 1);
        }

        this.$emit('input', filesAfterRemove);
        this.currentFile = null;
      }
    },
    getFormattedFileSize(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    checkExceedCountFiles(uploadingFiles) {
      const totalFilesLength =
        this.filesUploaded.length + uploadingFiles.length;
      const isExceedCountFiles = totalFilesLength > this.maxCountFiles;

      return isExceedCountFiles;
    },

    checkValidFile(file) {
      let fileFormat = file.name.split('.').pop();

      if (!this.validFormats.includes(fileFormat.toLowerCase())) {
        this.showError = true;
        this.errorMessage =
          this.$t('individual_task.valid_files_formats') +
          this.validFormats.join(', ');
        return false;
      } else if (file.size >= this.maxSizeKb * 1000) {
        this.showError = true;
        this.errorMessage = this.$t('individual_task.file_size_limit', {
          maxFileSize: (this.maxSizeKb / 1000).toString(),
        });
        return false;
      } else if (this.checkIfSameFileUploaded(file)) {
        this.showError = true;
        this.errorMessage = this.$t('individual_task.file_exist');
        return false;
      }

      return true;
    },
    checkIfSameFileUploaded(file) {
      let fileFound = false;
      this.filesUploaded.forEach((element) => {
        if (file.size === element.size && file.name === element.localname) {
          fileFound = true;
        }
      });
      return fileFound;
    },
  },
};
</script>

<style lang="sass" scoped>
.files-upload.view
  display: grid
  grid-template-columns: repeat(3, calc(100% / 3 - 64px / 3))
  grid-gap: 24px 32px
  @include xxs
    grid-template-columns: 1fr
    grid-gap: 18px 0

.files-upload__input
  display: none

.files-upload__label
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 22px

.files-upload__label
  border: 1px dashed var(--border-color)
  cursor: pointer

.files-upload__label.dragenter
  background-color: #0D326D05
  border: 1px dashed #0D326D

.files-upload__label.error
  height: auto

.files-upload__item,
.files-upload__link
  display: flex
  align-items: center

.files-upload__item
  position: relative
  margin-bottom: 24px
  @include xxs
    margin-bottom: 18px

.files-upload__icon
  display: flex

.files-upload__info
  width: calc(100% - 40px)
  margin-left: 12px

.files-upload__name
  overflow: hidden
  display: inline-block
  text-overflow: ellipsis
  white-space: nowrap
  width: 75%
  font-size: 15px
  line-height: 18px
  color: var(--primary-font-color)
  margin-bottom: 4px
  @include s
    width: 15vw
  @include s
    width: 30vw
  @include xxs
    width: 50vw

.files-upload.view
  .files-upload__name
    width: 6vw
    @include s
      width: 15vw
    @include xxs
      width: 50vw

.files-upload__size
  font-size: 12px
  line-height: 12px
  color: #88999F

.files-upload__remove-btn
  position: absolute
  right: 0
  top: 50%
  transform: translateY(-50%)
  display: flex

.files-upload__progress-bar
  height: 4px
  background-color: #EDEEEE

.files-upload__progress-value
  height: inherit
  background-color: #FDC82F
  transition: 0.3s

.files-upload__text,
.files-upload__error
  font-size: 15px
  line-height: 18px
  text-align: center
  margin-top: 12px
  max-width: 185px

.files-upload__text
  color: #88999F

.files-upload__error
  color: var(--color-orange)

.icon-upload_file,
.icon-upload_file_done
  max-width: 28px
  max-height: 28px

.icon-cross_grey
  max-width: 10px
  max-height: 10px
</style>
