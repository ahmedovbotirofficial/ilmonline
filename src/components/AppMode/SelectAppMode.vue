<template>
  <div class="select-mode">
    <div class="select-lang">
      <div
        v-for="item in languageList"
        :key="item.id"
        class="select-lang__item"
        :class="{ active: item.id === getSelectedLanguage }"
        @click="selectLang(item.id)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="select-mode__inner">
      <h2 class="select-mode__title">
        {{ $t('mainPage.welcome_ilm') }}
      </h2>
      <div class="select-mode__text">
        {{ $t('mainPage.welcome_ilm_choose') }}
      </div>
      <div class="select-mode__items">
        <div
          v-for="mode in COURSES_MODES"
          :key="mode"
          class="select-mode__item"
          :class="[
            `${mode}`,
            { active: selectedMode && mode === selectedMode },
          ]"
          @click="selectCoursesMode(mode)"
        >
          <svg-icon :name="`${mode}_courses`" />
          <div
            class="select-mode__item-title"
            v-html="$t(`courses.mode_title.${mode}`)"
          >
            <!-- {{ $t(`courses.mode_title.${mode}`) }} -->
          </div>
        </div>
      </div>
      <ButtonBase
        :disabled="!selectedMode"
        class="select-mode__btn"
        color="violet"
        size="popular"
        @click.native="saveCoursesMode"
      >
        {{ $t('buttons.goToCourse') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import { COURSES_MODES } from '@/types/constants';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { getFromLS, setToLS } from '@/library/helpers';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
  },
  data() {
    return {
      COURSES_MODES,
      selectedMode: null,
      languageList: {
        ru: {
          id: 'ru',
          title: 'РУС',
        },
        'uz-latn': {
          id: 'uz-latn',
          title: 'UZB',
        },
        uz: {
          id: 'uz',
          title: 'УЗБ',
        },
      },
    };
  },
  created() {
    this.selectLang(getFromLS('multi_lang') || 'uz-latn');
  },
  computed: {
    ...mapGetters(['getSelectedLanguage']),
  },
  methods: {
    selectCoursesMode(mode) {
      this.selectedMode = mode;
    },
    saveCoursesMode() {
      // let link = process.env.VUE_APP_HOST;
      let proCoursesLink = `${process.env.VUE_APP_HOST_PRO}?lang=${this.getSelectedLanguage}`;

      if (this.selectedMode === COURSES_MODES.SCHOOL) {
        this.$store.commit('SET_IS_SHOW_SELECT_MODE_PAGE', false);
      } else {
        window.open(proCoursesLink, '_self');
      }
    },
    selectLang(chosenLang) {
      this.selectedLangTitle = this.languageList[chosenLang].title;
      this.$i18n.locale = chosenLang;
      this.$store.commit('selectLanguage', chosenLang);
    },
  },
};
</script>

<style lang="sass" scoped>
.select-lang
  display: flex
  align-items: center
  justify-content: center
  gap: 32px
  padding-bottom: 40px
  @include xxs
    padding-bottom: 32px

.select-lang__item
  font-size: 18px
  line-height: 23px
  font-weight: 600
  text-transform: uppercase
  position: relative
  cursor: pointer
  transition: var(--transition-speed)

.select-lang__item:not(:last-child):after
  position: absolute
  content: ''
  top: 50%
  right: -16px
  width: 1px
  height: 20px
  transform: translateY(-50%)
  background-color: #000000

.select-lang__item:hover,
.select-lang__item.active
  opacity: 0.4

.select-mode
  min-height: 100vh
  height: 100%
  width: 100%
  background-color: #ECE9FB
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  @include xxs
    justify-content: flex-start
    padding: 24px 16px 16px 16px

.select-mode__inner
  display: flex
  flex-direction: column
  align-items: center
  padding: 64px 150px
  background-color: var(--color-white)
  box-shadow: 0px 15px 40px rgba(73, 79, 81, 0.1)
  @include s
    padding: 60px 90px
  @include xxs
    width: 100%
    padding: 42px 16px

.select-mode__title
  font-size: 24px
  line-height: 30px
  font-weight: 600
  text-align: center

.select-mode__text
  font-size: 18px
  line-height: 26px
  padding-top: 16px
  padding-bottom: 40px
  text-align: center
  @include xxs
    font-size: 14px
    line-height: 22px

.select-mode__items
  display: flex
  align-items: center
  justify-content: center
  gap: 64px
  padding-bottom: 44px
  width: 100%
  @include s
    gap: 32px
  @include xs
    flex-direction: column

.select-mode__item
  display: flex
  flex-direction: column
  align-items: center
  width: 216px
  padding: 24px 20px
  border: 1px solid var(--border-color)
  cursor: pointer
  min-height: 210px
  transition: var(--transition-speed)
  @include xxs
    width: 100%
    min-height: 100%
    padding: 20px

.select-mode__item.school
  &:hover,
  &.active
    border-color: var(--color-school-mode)

.select-mode__item.pro
  &:hover,
  &.active
    border-color: var(--color-pro-mode)

.select-mode__item-title
  font-size: 14px
  line-height: 18px
  margin-top: 18px
  text-align: center

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
