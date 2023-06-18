<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="trial_header__main">
    <div class="container">
      <div
        class="quiz_header__main_wrapper"
        :class="{
          quiz_passing: !!description,
          ended: isResults,
        }"
      >
        <div class="trial_header__left">
          <div v-if="svgName" class="trial_header__icon">
            <svg-icon :name="svgName" />
          </div>
          <Heading level="2" v-html="headerTitle" />

          <div v-if="type" class="qiuz_type">
            {{ type }}
          </div>

          <div v-if="description" class="qiuz_description">
            {{ description }}
          </div>

          <div
            v-if="isResults || isQuizResults"
            class="quiz_results_btns"
            :class="{ quiz: isQuizResults }"
          >
            <ButtonBase
              :color="isQuizResults ? 'transparent' : 'orange'"
              :size="
                isQuizResults && getWindowWidth > 640
                  ? 'popular'
                  : isQuizResults && getWindowWidth <= 640
                  ? 'max'
                  : 'small'
              "
              @click.native="goTo"
            >
              {{ $t('buttons.go_back_to_tests') }}
            </ButtonBase>

            <ButtonBase
              v-if="getQuizTest.has_certificate"
              :color="isQuizResults ? 'orange' : 'transparent_blue'"
              :size="
                isQuizResults && getWindowWidth > 640
                  ? 'popular'
                  : isQuizResults && getWindowWidth <= 640
                  ? 'max'
                  : 'small'
              "
              :disabled="isLoader"
              @click.native="downloadCertificate"
            >
              <Loader v-if="isLoader" color="white" size="small" />
              <span v-else>
                {{ $t('buttons.download_certificate') }}
              </span>
            </ButtonBase>

            <ButtonBase
              color="transparent_blue"
              :size="getWindowWidth < 640 ? 'max' : 'small'"
              icon-name="trial_test_send"
              class="test_header_btns__small"
              @click.native="sendTestResults"
            />
          </div>
        </div>

        <div class="trial_header__right" :class="{ ended: isResults }">
          <svg-icon :name="img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
  },

  props: {
    isResults: {
      type: Boolean,
      default: false,
    },
    isQuizResults: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    svgName: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: 'trial_header_img',
    },
  },

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCurrentTrialTest',
      'getQuizTest',
      'isAuthUser',
      'getWindowWidth',
      'getUniqueUserID',
    ]),

    headerTitle() {
      return (
        this.title ||
        this.$t('tests.quiz_test_header', {
          spanColor: MAIN_COLORS[this.getCoursesMode].text,
        })
      );
    },
  },

  methods: {
    goTo() {
      this.$router.push({ name: 'tests-main' });
    },
    async downloadCertificate() {
      this.isAuthUser
        ? await this.fetchCertificate()
        : this.$store.commit('SET_MODAL', {
            state: true,
            name: `authorization`,
            props: '',
          });
    },
    async fetchCertificate() {
      this.isLoader = true;
      let result = await this.$store.dispatch('getQuizCertificate', {
        quiz_passing_id: this.$route.params.quiz_passing_id,
        unique_token: this.getUniqueUserID,
      });
      this.isLoader = false;
      const blob = new Blob([result.data], { type: 'application/pdf' });

      let url = URL.createObjectURL(blob);
      window.open(`${url}`, '_blank');
    },
    sendTestResults() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `send-quiz-results`,
        props: this.type,
      });
    },
  },
};
</script>
<style lang="sass">
li
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px

li::after
  position: absolute
  content: ''
  background-color: var(--color-main)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.trial_header
  background-color: var(--color-white)

.trial_header__main
  margin-bottom: 40px
  background: var(--color-white)

.quiz_header__main_wrapper.quiz_passing
  padding: 100px 0

.quiz_header__main_wrapper.quiz_passing,
.quiz_header__main_wrapper
  display: flex
  padding-top: 100px
  @include s
    gap: 40px
    padding-top: 50px
    flex-direction: column
  @include xxs
    gap: 0px
    padding-bottom: 0px
    padding-top: 10px

.quiz_header__main_wrapper.ended
  @include s
    flex-direction: row

.trial_header__left,
.trial_header__right
  position: relative
  display: flex
  flex-direction: column
  width: 100%

.qiuz_description,
.qiuz_type
  margin-top: 30px
  font-size: 16px
  line-height: 26px
  @include xxs
    font-size: 14px
    line-height: 22px

.qiuz_type
  font-weight: bold

.trial_header__right.ended
  @include s
    width: 50%

.trial_header__right svg
  max-width: 480px
  min-height: 320px
  width: 100%
  height: 320px
  align-self: flex-end
  @include s
    align-self: center
    width: 100%
  @include xs
    max-width: 380px

.trial_header__icon
  position: absolute
  left: 330px
  top: -40px
  @include s
    left: 280px
  @include xs
    left: 250px
  @include xxs
    left: 170px

.trial_header__icon svg
  max-width: 80px
  max-height: 80px
  @include xxs
    max-width: 50px

.trial_header_info
  margin: 27px 0

.trial_header__right
  justify-content: flex-end

.quiz_results_btns
  display: flex
  gap: 40px
  width: 100%

  .button_wrapper.primary-btn--transparent
    border: 1px solid var(--color-head-title)
    .primary-btn--transparent:hover
      background: var(--color-head-title)

  .primary-btn--popular:not(.primary-btn--transparent)
    background: var(--color-head-title)

.quiz_results_btns.quiz
  margin-top: 40px
  @media screen and (max-width: 640px)
    flex-direction: column
    gap: 24px
    margin-bottom: 40px
    align-self: flex-start

.quiz_results_btns.quiz .button_wrapper .primary-btn
  @media screen and (max-width: 640px)
    width: 100%
</style>
