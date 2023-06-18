<template>
  <div class="input-search input-search__form" :class="{ white: isWhite }">
    <label class="input-search__wrapper" :class="{ active: isActive }">
      <div class="input-search__list">
        <input
          id="input-search"
          v-model="valueModel"
          :placeholder="placeholderValue"
          :class="{ active: isActive }"
          autocomplete="off"
          @focus="isActive = true"
          @blur="isActive = false"
        />
        <!-- @input="onInput" -->
        <svg-icon name="icon_search" />
        <svg-icon
          v-if="valueModel.length > 0"
          name="cross"
          @click.native="clearValue"
        />
      </div>
    </label>
  </div>
</template>

<script>
import router from '@/router';

export default {
  props: {
    value: {
      // value of input
      type: [String, Number],
      default: '',
    },
    placeholderValue: {
      type: String,
      default: '',
    },
    isWhite: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: false,
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
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    clearValue() {
      this.isActive = false;
      this.$emit('input', '');
    },
  },
};
</script>

<style lang="sass" scoped>
.subcategory__list .input-search__wrapper .icon-icon_search
  position: absolute
  top: 50%
  transform: translateY(-50%)
.subcategory__list .active
  border-bottom: 0
.white
  background-color: white
  max-width: 826px
  width: 100%

.education_input .input-search__list
  border-bottom: none
.subcategory__list .input-search__list
  padding-left: 42px

.input-search__wrapper .icon-icon_search
  left: 14px
  max-width: 16px
  max-height: 16px

.input-search__wrapper svg
  position: absolute
  bottom: 15px

.input-search__wrapper:hover .icon-icon_search
  fill: var(--color-main)

.input-search
  font-size: 16px
  font-weight: 400

.input-search__list
  width: 100%
  position: relative
  border-bottom: 1px solid var(--primary-font-color)
  line-height: 3
  padding-left: 35px
  background-color: var(--color-white)
  height: 48px
  @media screen and (max-width: 768px)
    padding-left: 40px
  @include s
    width: 100%
  @include xxs
    padding-left: 40px

.input-search__list input
  margin-left: 14px

.input-search__wrapper .icon-cross
  display: block
  right: 20px
  max-width: 12px
  max-height: 12px
  cursor: pointer

.input-search__wrapper.active .icon-icon_search
  fill: var(--primary-font-color)

.input-search__form
  position: relative
  height: 42px
  @include xs
    margin-bottom: 20px

.icon-magnifier
  width: 20px
  height: 18px
  position: absolute
  top: 15px
  left: 0
  // fill: $gray

  @include xxs
    width: 16px
    height: 16px
    top: 9px

.active + .icon-magnifier
  fill: black

.input-search__block
  background-color: var(--color-white)
  border-radius: 12px
  padding-left: 24px
  padding-top: 15px
  position: relative
  z-index: 2
  margin-top: 6px
  box-shadow: 0px 0px 40px rgb(38 55 76 / 12%)
  border: 2px solid rgba(0, 0, 0, 0.05)
  &::after
    content: ''
    position: absolute
    height: 80px
    width: 100%
    left: 22px
    bottom: 0
// background: linear-gradient(0deg, var(--color-white) 16.96%, rgba(255, 255, 255, 0.82) 44.26%, rgba(248, 248, 248, 0) 106.82%)

.input-search__content
  overflow: auto
  max-height: 250px
  margin-bottom: 20px
  margin-right: 18px

.input-search__content-item
  cursor: pointer
  font-size: 14px
  line-height: 24px
  padding-top: 24px

.input-search__content::-webkit-scrollbar
  width: 4px
  background-color: #DCDCDC

.input-search__content::-webkit-scrollbar-thumb
  background-color: black
</style>
