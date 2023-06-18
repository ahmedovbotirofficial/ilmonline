<template>
  <!-- password_tooltip: focusField && tooltipPass, -->
  <div
    class="text_field text_field__container"
    :class="{
      focused: focusField,
      filled: unfocused,
      error: error,
      search_input: nameSearchIcon,
      disabled: disabled,
    }"
  >
    <input
      :id="id"
      v-model="valueModel"
      v-mask="mask"
      class="text_field__input"
      :class="{ optional: isOptionalLabel }"
      :type="typeInput"
      :darkBackgrond="darkBackgrond"
      autocomplete="off"
      :disabled="disabled"
      :maxlength="maxLength"
      @focus="focusHandler"
      @blur="focusHandler"
      @keypress="maskHandler"
    />
    <label :for="id" class="text_field__label">
      <svg-icon
        v-if="nameSearchIcon && !valueModel"
        :name="nameSearchIcon"
        class="text_field__search_icon"
      />
      <span
        class="text_field__placeholder"
        :class="{
          signature: focusField || (!!valueModel && valueModel.length >= 1),
          searchInput: nameSearchIcon,
          dark_signature:
            (focusField && darkBackgrond) ||
            (darkBackgrond && valueModel.length >= 1),
          filled: unfocused,
          disabled: disabled,
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
    <span v-if="isOptionalLabel && !error" class="text_field__label_optional">{{
      $t('form.optional')
    }}</span>
    <div
      v-if="isPassword"
      class="text_field__password"
      @click="typeInutHandler"
    >
      <svg-icon
        :name="isTypePassword ? 'icon_eye' : 'icon_eye_closed'"
        class="text_field__icon"
      />
    </div>
    <InputError v-if="error" :error-txt="errorTxt" />
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
    type: {
      type: String,
      default: 'text',
    },
    errorTxt: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: String,
      default: '',
    },
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
      // value of input
      type: [String, Number],
      default: '',
    },

    nameSearchIcon: {
      type: String,
      default: '',
    },

    isPassword: {
      type: Boolean,
      default: false,
    },

    tooltipPass: {
      type: Boolean,
      default: false,
    },

    darkBackgrond: {
      type: Boolean,
      default: false,
    },

    valueMask: {
      type: String,
      default: '',
    },

    isOptionalLabel: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      focusField: false,
      unfocused: false,
      // tooltipPass: false,
      typeInput: '',
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

    isTypePassword() {
      return this.typeInput === 'password';
    },

    isTypeNumber() {
      return this.typeInput === 'number';
    },
  },

  mounted() {
    this.typeInput = this.type;
  },

  methods: {
    focusHandler(event) {
      this.focusField = !this.focusField;
      if (!!this.valueModel && !!this.valueModel.length && !this.focusField)
        this.unfocused = true;
      if (!!this.valueModel && !!this.valueModel.length && this.focusField)
        this.unfocused = false;
      this.$emit('focus');
    },
    typeInutHandler() {
      this.typeInput = this.isTypePassword ? 'text' : 'password';
    },
    maskHandler(event) {
      let char = String.fromCharCode(event.keyCode); // Get the character
      switch (this.valueMask) {
        case 'numbers':
          if (!/^[0-9]+$/.test(char)) event.preventDefault();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="sass">
.text_field__container
  border: 1px solid rgba(18, 50, 62, 0.24)
  width: 100%
  height: 48px
  position: relative
  @include xxs
    height: 44px
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active
  background-color: white!important
  -webkit-box-shadow: 0 0 0 30px white inset !important
.text_field__container.error
  border: 1px solid var(--color-orange) !important

.text_field__container.confirm_password
  border: 1px solid var(--color-main)

.text_field__container.search_input
  border: none

.text_field__container.search_input.focused
  background-color: var(--color-white)

.text_field__container:hover
  border: 1px solid rgba(18, 50, 62, 0.5)

.text_field__container.disabled:hover
  border: 1px solid rgba(18, 50, 62, 0.24)

.text_field__input
  width: 100%
  display: block
  position: relative
  height: 100%
  font-size: 16px
  font-weight: bold
  padding: 0 12px

.text_field__input.optional
  padding: 0 120px 0 12px
  @include xxs
    padding: 0 12px

.text_field__container.focused
  border: 1px solid var(--btn-color-blue-dark)

.text_field__container.filled
  border: 1px solid var(--primary-font-color)

.text_field__container.password_tooltip
  position: relative

.text_field__container.password_tooltip::after
  position: absolute
  content: ''
  top: -55px
  left: 0
  height: 50px
  width: 100px
  border: 1px solid #000
  background-color: yellow

.text_field__label
  display: block
  position: absolute
  left: 12px
  top: 13px
  right: 0
  cursor: text

.text_field__placeholder
  color: var(--primary-font-color)
  position: absolute
  font-size: 14px
  top: 0
  transition-duration: 0.5s

.text_field__optional
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 12px
  font-size: 14px
  opacity: 0.5

.text_field__placeholder.dark_signature,
.text_field__placeholder.signature
  color: var(--btn-color-blue-dark)
  font-size: 12px
  transform: translateY(-24px)
  background-color: var(--color-white)
  top: 2px
  padding: 0 3px
  margin-left: -3px
  opacity: 1

.text_field__label_optional
  @include adaptive-font-size(14, 14, 12)
  @include adaptive-line-height(16, 16, 15)
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 12px
  font-size: 14px
  opacity: 0.5
  @include xxs
    position: relative
    top: -5px
    right: auto
    left: 0

.text_field__container.error
  .text_field__placeholder.signature
    color: var(--color-orange)

.text__label.label
  display: none

.text_field__placeholder.dark_signature
  background-color: var(--color-background)

.text_field__placeholder.signature.searchInput
  display: none

.text_field__placeholder.signature.filled
  color: var(--primary-font-color)

.text_field__placeholder.disabled
  color: var(--primary-font-color)
  opacity: 0.7

.text_field__password
  position: absolute
  cursor: pointer
  right: 12px
  top: 0
  height: 100%

.text_field__icon
  position: relative
  top: 50%
  transform: translateY(-50%)

.text_field__search_icon
  max-width: 16px !important
  margin-right: 16px

.is-error
  color: var(--color-orange)
  font-size: 12px

.confirm__text-field label .text_field__placeholder
  transform: translate(-50%, -50%)
  top: 12px

.confirm__text-field .text_field__placeholder.dark_signature,
.confirm__text-field .text_field__placeholder.signature
  display: none

.amount_input .text_field__placeholder
  left: 0

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

input[type=number]
  -moz-appearance: textfield

input[disabled]
  opacity: 0.5
</style>
