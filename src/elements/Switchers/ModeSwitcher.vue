<template>
  <div class="mode_switcher">
    <span class="mode_switcher__title">{{
      $t(`courses.switcher_title.${getCoursesMode}`)
    }}</span>
    <div class="mode_switcher__box">
      <!-- <div class="mode_switcher__box"> -->
      <input
        id="mode-switcher"
        v-model="isProCoursesMode"
        type="checkbox"
        class="mode_switcher__input"
        @click="goToCourseByMode"
      />
      <label for="mode-switcher" class="mode_switcher__label"></label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  computed: {
    ...mapGetters(['getCoursesMode', 'getSelectedLanguage']),
    isProCoursesMode: {
      get() {
        return this.getCoursesMode === COURSES_MODES.PRO;
      },
      set(value) {
        const mode = value ? COURSES_MODES.PRO : COURSES_MODES.SCHOOL;
        // this.$store.commit('SET_COURSES_MODE', mode);
      },
    },
  },

  methods: {
    goToCourseByMode() {
      let link = `${process.env.VUE_APP_HOST}?lang=${this.getSelectedLanguage}&redirect=true`;
      let proCoursesLink = `${process.env.VUE_APP_HOST_PRO}?lang=${this.getSelectedLanguage}`;
      let targetLink = this.isProCoursesMode ? link : proCoursesLink;

      window.open(targetLink, '_self');
    },
  },
};
</script>

<style scoped lang="sass">
.mode_switcher
  display: flex
  align-items: center
  gap: 8px

.header
  .mode_switcher__title
    font-size: 16px
    line-height: 20px

.footer
  .mode_switcher__title
    font-size: 14px
    line-height: 18px

.mode_switcher__box
  position: relative
  display: inline-block
  width: 42px
  height: 24px

.mode_switcher__input
  height: 0
  width: 0
  visibility: hidden

.mode_switcher__label
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  background: var(--color-white)
  border: 1px solid #D8D8D8
  border-radius: 14px
  cursor: pointer

  &:after
    content: ''
    position: absolute
    top: 2px
    left: 2px
    width: 18px
    height: 18px
    background: var(--color-main)
    border-radius: 50%

.mode_switcher__input:checked + .mode_switcher__label:after
  left: calc(100% - 2px)
  transform: translateX(-100%)
  background: var(--btn-color-blue-dark)
</style>
