<template>
  <div v-click-outside="close" class="modal__content select_courses_mode">
    <h2 class="modal__content_title">
      {{ $t('mainPage.welcome_ilm') }}
    </h2>
    <div class="modal__content_text">
      {{ $t('mainPage.welcome_ilm_choose') }}
    </div>
    <div class="modal__courses-modes">
      <div
        v-for="mode in COURSES_MODES"
        :key="mode"
        class="modal__courses-mode"
        :class="{
          active: selectedMode && mode === selectedMode,
          active_pro: selectedMode === 'pro' && mode === 'pro',
        }"
        @click="selectCoursesMode(mode)"
      >
        <svg-icon :name="`${mode}_courses`" />
        <div class="modal__courses-mode-title">
          {{ $t(`courses.mode_title.${mode}`) }}
        </div>
      </div>
    </div>
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      @click.native="saveCoursesMode"
    >
      {{ $t('buttons.goToCourse') }}
    </ButtonBase>
  </div>
</template>

<script>
import { COURSES_MODES } from '@/types/constants';
import ButtonBase from '../Buttons/ButtonBase.vue';
import { getFromLS, setToLS } from '@/library/helpers';

export default {
  components: {
    ButtonBase,
  },
  data() {
    return {
      COURSES_MODES,
      selectedMode: null,
    };
  },
  computed: {},
  mounted() {
    // console.log(window.location);
    if (window.location.pathname.includes('reset-password')) {
      this.close();
    }
  },
  methods: {
    selectCoursesMode(mode) {
      this.selectedMode = mode;
    },
    saveCoursesMode() {
      let link = process.env.VUE_APP_HOST;
      let proCoursesLink = process.env.VUE_APP_HOST_PRO;

      if (
        this.selectedMode === COURSES_MODES.PRO &&
        !window.origin.includes('pro.')
      ) {
        proCoursesLink += '?redirect=true';
        window.open(proCoursesLink, '_self');
      }
      if (
        this.selectedMode === COURSES_MODES.SCHOOL &&
        window.origin.includes('pro.')
      ) {
        link += '?redirect=true';
        window.open(link, '_self');
      }
      // this.$store.commit('SET_COURSES_MODE', this.selectedMode);
      setToLS('first_opened', false);
      this.close();
    },
    close() {
      let link = process.env.VUE_APP_HOST;
      let proCoursesLink = process.env.VUE_APP_HOST_PRO;
      if (!!!this.selectedMode) {
        if (window.origin.includes('pro.')) {
          this.$store.commit('SET_COURSES_MODE', COURSES_MODES.PRO);

          this.$store.commit('SET_MODAL', {
            state: false,
          });

          setToLS('first_opened', false);
          return;
        } else {
          this.$store.commit('SET_COURSES_MODE', COURSES_MODES.SCHOOL);

          this.$store.commit('SET_MODAL', {
            state: false,
          });

          setToLS('first_opened', false);
          return;
        }
      } else {
        if (
          window.origin.includes('pro.') &&
          this.selectedMode === COURSES_MODES.PRO
        ) {
          this.$store.commit('SET_COURSES_MODE', COURSES_MODES.PRO);

          this.$store.commit('SET_MODAL', {
            state: false,
          });

          setToLS('first_opened', false);
          return;
        } else if (
          !window.origin.includes('pro.') &&
          this.selectedMode === COURSES_MODES.SCHOOL
        ) {
          this.$store.commit('SET_COURSES_MODE', COURSES_MODES.SCHOOL);

          this.$store.commit('SET_MODAL', {
            state: false,
          });

          setToLS('first_opened', false);
          return;
        } else if (
          !window.origin.includes('pro.') &&
          this.selectedMode === COURSES_MODES.PRO
        ) {
          // this.$store.commit('SET_COURSES_MODE', COURSES_MODES.PRO);

          this.$store.commit('SET_MODAL', {
            state: false,
          });

          proCoursesLink += '?redirect=true';
          window.open(proCoursesLink, '_self');

          setToLS('first_opened', false);
          return;
        } else if (
          window.origin.includes('pro.') &&
          this.selectedMode === COURSES_MODES.SCHOOL
        ) {
          this.$store.commit('SET_MODAL', {
            state: false,
          });

          link += '?redirect=true';
          window.open(link, '_self');
          setToLS('first_opened', false);
        }
      }

      setToLS('first_opened', false);
    },
  },
};
</script>

<style lang="sass" scoped>
.select_courses_mode
  width: 100%
  align-items: center

.modal__content_title
  padding-top: 0

.modal__content_text
  padding-bottom: 40px

.modal__courses-modes
  display: flex
  align-items: center
  justify-content: center
  gap: 64px
  padding-bottom: 44px
  width: inherit
  @include s
    flex-wrap: wrap
  @include xs
    gap: 32px

.modal__courses-mode
  display: flex
  flex-direction: column
  align-items: center
  flex: 0 0 216px
  padding: 26px 20px
  border: 1px solid var(--border-color)
  cursor: pointer
  min-height: 190px
  @include xxs
    flex: 0 0 100%
    padding: 20px 0px

  &:hover,
  &.active
    border-color: var(--color-main)
  &.active_pro
    border-color: var(--btn-color-dark-blue)

.modal__courses-mode-title
  font-size: 14px
  line-height: 16px
  margin-top: 20px

.icon-school_courses
  max-width: 60px

.icon-pro_courses
  max-width: 85px

.icon-school_courses,
.icon-pro_courses
  max-height: 80px
  @include xs
    max-width: 60px
</style>
