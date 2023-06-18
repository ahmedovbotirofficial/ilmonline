<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="trial_header__main">
    <div class="container">
      <div
        v-if="getCurrentTrialTest"
        class="trial_header__main_wrapper"
        :class="{ ended: isResults }"
      >
        <div class="trial_header__left">
          <div v-if="svgName" class="trial_header__icon">
            <svg-icon :name="svgName" />
          </div>
          <Heading level="2" v-html="headerTitle" />

          <ul v-if="isResults" class="trial_header_info">
            <li>
              {{
                $t('tests.right_answers_info', {
                  correct_answers: trueAnswers,
                  total_answers: getCurrentTrialTest.questions_count,
                })
              }}
            </li>
          </ul>

          <div v-if="isResults" class="test_results_btns">
            <ButtonBase color="orange" size="popular" @click.native="goTo">
              {{ $t('buttons.go_back_to_tests') }}
            </ButtonBase>

            <ButtonBase
              color="transparent_blue"
              size="small"
              icon-name="trial_test_send"
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
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    ButtonBase,
  },

  props: {
    isResults: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    trueAnswers: {
      type: [String, Number],
      default: '0',
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

  computed: {
    ...mapGetters(['getCurrentTrialTest']),

    headerTitle() {
      return this.title || this.$t('tests.trial_test_header');
    },
  },

  methods: {
    goTo() {
      this.$router.push({ name: 'trial-tests' });
    },
    sendTestResults() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `send-test-results`,
      });
    },
  },
};
</script>
<style lang="sass" scoped>
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

.trial_header__main_wrapper
  display: flex
  padding-top: 100px
  padding-bottom: 50px
  @include s
    flex-direction: column
    gap: 40px
  @include xxs
    gap: 0px
    padding-bottom: 0px

.trial_header__main_wrapper.ended
  @include s
    flex-direction: row

.trial_header__left,
.trial_header__right
  position: relative
  display: flex
  flex-direction: column
  width: 100%

.trial_header__right.ended
  @include s
    width: 50%

.trial_header__right svg
  max-width: 480px
  max-height: 320px
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
  left: 230px
  top: -40px
  @include xxs
    left: 130px

.trial_header__icon svg
  max-width: 80px
  max-height: 80px
  @include xxs
    max-width: 50px

.trial_header_info
  margin: 27px 0

.trial_header__right
  justify-content: flex-end

.test_results_btns
  display: flex
  gap: 40px
</style>
