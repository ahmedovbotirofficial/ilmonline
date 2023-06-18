<template>
  <div
    class="text_area text_area__container"
    :class="{
      focused: focusField,
      filled: unfocused,
      error: error,
    }"
  >
    <textarea
      :id="id"
      ref="text_area"
      v-model="valueModel"
      class="text_area__input"
      autocomplete="off"
      :disabled="disabled"
      :maxlength="getMaxLength"
      @focus="focusHandler"
      @blur="focusHandler"
      @input="inputHandler"
    ></textarea>
    <label :for="id" class="text_area__label">
      <span
        class="text_area__placeholder"
        :class="{
          signature: focusField || (!!valueModel && valueModel.length >= 1),
          filled: unfocused,
        }"
      >
        {{ placeholder }}
      </span>
      <span
        class="text__label"
        :class="{
          label: focusField,
        }"
      >
        {{ label }}
      </span>
    </label>
    <InputError v-if="error" :error-txt="errorTxt" />

    <div v-if="emptyError" class="is-error">
      {{ this.$t('form.empty_error') }}
    </div>
  </div>
</template>

<script>
import InputError from '@/elements/Inputs/InputError.vue';
export default {
  components: {
    InputError,
  },
  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    emptyError: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 500,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorTxt: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      focusField: false,
      unfocused: false,
      height: '',
    };
  },

  computed: {
    valueModel: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    getMaxLength() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? this.maxLength
        : this.maxLength + 1;
    },
  },

  methods: {
    focusHandler(event) {
      this.focusField = !this.focusField;
      if (!!this.valueModel.length && !this.focusField) this.unfocused = true;
      if (!!this.valueModel.length && this.focusField) this.unfocused = false;
    },
    inputHandler(event) {
      if (event.target.value !== '') {
        this.$refs.text_area.style.height = 'auto';
        this.$refs.text_area.style.height = `${event.target.scrollHeight}px`;
      } else {
        this.$refs.text_area.style.height = '48px';
      }
    },
  },
};
</script>

<style lang="sass">
.text_area__container
  border: 1px solid rgba(18, 50, 62, 0.24)
  width: 100%
  position: relative

.text_area__container.error
  border: 1px solid var(--color-orange) !important

.text_area__container:hover
  border: 1px solid rgba(18, 50, 62, 0.5)

.text_area__input
  width: 100%
  height: 48px
  display: block
  position: relative
  font-size: 14px
  line-height: 20px
  padding: 14px
  outline: none
  overflow: hidden
  resize: none

  @include xxs
    height: 44px
    padding: 10px 12px

.text_area__container.focused
  border: 1px solid var(--btn-color-blue-dark)

.text_area__container.filled
  border: 1px solid var(--primary-font-color)

.text_area__label
  display: block
  position: absolute
  left: 12px
  top: 13px
  right: 0
  cursor: text

.text_area__placeholder
  color: var(--primary-font-color)
  position: absolute
  font-size: 14px
  top: 2px
  transition-duration: 0.5s

.text_area__placeholder.signature
  color: var(--btn-color-blue-dark)
  font-size: 12px
  transform: translateY(-24px)
  background-color: var(--color-white)
  padding: 0 3px
  margin-left: -3px

.text_area__container.error
  .text_area__placeholder.signature
    color: var(--color-orange)

.text__label.label
  display: none

.text_area__placeholder.signature.filled
  color: var(--primary-font-color)

.text_area__icon
  position: relative
  top: 50%
  transform: translateY(-50%)

.is-error
  color: var(--color-orange)
  font-size: 12px

.confirm__text-field label .text_area__placeholder
  transform: translate(-50%, -50%)
  top: 12px

.confirm__text-field .text_area__placeholder.signature
  display: none

.amount_input .text_area__placeholder
  left: 0

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0
</style>
