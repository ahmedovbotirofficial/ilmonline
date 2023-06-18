<template>
  <div class="content_container">
    <div class="input-search input-search__form">
      <label class="input-search__wrapper">
        <svg-icon name="icon_search" />
        <input
          id="input-search"
          v-model="inputValue"
          :placeholder="placeholderValue"
          class="input-search__list"
          :class="{ active: isActive }"
          autocomplete="off"
          @focus="isActive = true"
          @input="onInput"
        />
        <svg-icon
          v-if="isCross && inputValue.length >= 1"
          name="cross_input"
          @click.native="clearValue"
        />
      </label>
    </div>
    <div
      v-if="searchResults.length >= 1 && isActive && inputValue !== ''"
      class="search_result__container"
    >
      <ul class="search__results_list">
        <li
          v-for="item in searchResults"
          :key="item.slug"
          @click.stop="getStateSlug(item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div
      v-if="searchResults.length === 0 && inputValue !== ''"
      class="search_result__container"
    >
      <p class="search__result_item">{{ $t('main.not_found') }}</p>
    </div>
  </div>
</template>

<script>
import router from '@/router';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholderValue: {
      type: String,
      default: 'Поиск по теме',
    },
    isCross: {
      type: Boolean,
      default: false,
    },
    searchResults: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isActive: false,
      inputValue: '',
      isSearchResultsVisible: false,
    };
  },
  computed: {},
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    getStateSlug(value) {
      // console.log(value);
      this.$emit('detect', value);
    },
    clearValue() {
      this.isActive = false;
      this.inputValue = '';
    },
  },
};
</script>

<style lang="sass" scoped>
.search_result__container
  min-height: 30px
  margin-top: 8px
  background-color: white
  position: absolute
  left: 0
  width: 100%
  max-width: 1277px
  z-index: 9999
  // @include xs
  //   max-width: 90%
.input-search__wrapper svg
  position: relative
  left: 15px
  max-width: 16px
  max-height: 16px

.questions_search
  position: relative

.questions_search .input-search__wrapper .icon-cross_input
  width: 12px
  height: 12px
  right: 15px
  left: auto

.input-search
  font-size: 16px
  font-weight: 400

.questions_search .input-search__list
  padding-left: 40px
  @include xs
    // height: 32px

.input-search__list
  width: 100%
  border-bottom: 1px solid rgba(150, 150, 150, 0.24)
  line-height: 3
  padding-left: 34px
  min-width: 260px
  height: 42px
  @include s
    width: 100%
  @include xxs
    padding-left: 25px

.questions_search .input-search__wrapper svg
  position: absolute
  top: 50%
  transform: translateY(-50%)
.input-search__form
  position: relative
  height: 42px
  padding-right: 31px
  @include xs
    // margin-bottom: 20px
    // height: 32px

.questions_search .input-search__list
  border-bottom: none
.icon-magnifier
  width: 20px
  height: 18px
  position: absolute
  top: 15px
  left: 0
  // fill: $gray
.questions_search .input-search__form
  background-color: white
  //@include xxs
  //  width: 16px
  //  height: 16px
  //  top: 9px

.active
  border-bottom: 2px solid black

.active + .icon-magnifier
  fill: black

.questions_search .active
  border-bottom: 0
.navigation_menu .questions_search
  width: 60%
  max-width: 826px
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

.search__results_list li::after
  display: none

.search__results_list
  padding: 16px 16px 4px 16px
  .search__result_item
    margin-bottom: 12px
    font-size: 16px
    font-weight: 400
    line-height: 20px
    cursor: pointer

p.search__result_item
  padding: 16px

.search__results_list .search__result_item:hover
  color: var(--color-main)
</style>
