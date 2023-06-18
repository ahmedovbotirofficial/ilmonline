<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="current_test_header_wrapper">
    <div class="container">
      <div v-if="isLoader" class="current_test_loader">
        <Loader color="orange" />
      </div>
      <div v-else class="current_test_header">
        <div
          v-if="
            !!getTrialCategories.length && !!getMyTrialTest.studentResponses
          "
          class="current_test_header__column"
        >
          <Heading level="2" v-html="headerTitle" />
          <ul
            v-if="
              getCurrentTrialTest.questions_count !==
                getMyTrialTest.studentResponses.length &&
              !getTrialTestTimerStatus
            "
            class="test_main__text"
          >
            <li>
              {{
                $t('tests.trial_test_solving_info', {
                  questions_count: getCurrentTrialTest.questions_count,
                })
              }}
            </li>
            <li>
              {{ $t('tests.trial_test_solving_info_2') }}
            </li>
          </ul>

          <div
            v-if="
              getCurrentTrialTest.questions_count ===
                getMyTrialTest.studentResponses.length ||
              getTrialTestTimerStatus
            "
            class="test_header_ellipse"
          >
            <vue-ellipse-progress
              :progress="getMyTrialTest.grade"
              color="#F7CD46"
              empty-color="#c4c4c4"
              :empty-thickness="3.5"
              :size="125"
              :thickness="9.5"
              :legend="true"
              :legend-formatter="() => `${getMyTrialTest.grade}/100`"
              font-size="32px"
            />
            <!-- :legendValue="100" -->
          </div>

          <div
            v-if="
              getCurrentTrialTest.questions_count ===
                getMyTrialTest.studentResponses.length ||
              getTrialTestTimerStatus
            "
            class="test_header_btns__trial"
          >
            <ButtonBase
              color="transparent"
              :size="getWindowWidth <= 540 ? 'max' : 'popular'"
              @click.native="goTo"
            >
              {{ $t('buttons.go_back_to_tests') }}
            </ButtonBase>

            <ButtonBase
              color="orange"
              :size="getWindowWidth <= 540 ? 'max' : 'popular'"
              @click.native="checkTestResults"
            >
              {{ $t('buttons.watch_misstakes') }}
            </ButtonBase>

            <ButtonBase
              color="transparent_blue"
              :size="
                getWindowWidth <= 540
                  ? 'max'
                  : getWindowWidth <= 1024
                  ? 'popular'
                  : 'small'
              "
              icon-name="trial_test_send"
              class="test_header_btns__trial__small"
              @click.native="sendTestResults"
            >
              <span v-if="getWindowWidth <= 1024">{{
                $t('buttons.share_btn')
              }}</span>
            </ButtonBase>
          </div>
        </div>
        <div
          class="current_test_header__column"
          :class="{ ended: getTrialTestTimerStatus }"
        >
          <img v-if="!getTrialTestTimerStatus" src="/images/course_test.png" />

          <img v-else src="/images/trial_test_result_img.svg" />
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

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
    // LessonCard,
  },
  props: {
    testInfoForHeader: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCurrentTrialTest',
      'getMyTrialTest',
      'getTrialTestTimerStatus',
      'getWindowWidth',
      'getTrialCategories',
    ]),

    headerTitle() {
      return !this.getTrialTestTimerStatus
        ? this.$t('tests.trial_direction_test_header_test', {
            direction: this.getTrialCategories.find(
              (el) => el.slug === this.$route.params.direction
            ).title,
            var: this.getCurrentTrialTest.title,
          })
        : this.$t('tests.trial_test_header_results', {
            direction: this.getTrialCategories.find(
              (el) => el.slug === this.$route.params.direction
            ).title,
            var: this.getCurrentTrialTest.title,
          });
    },
  },

  beforeMount() {
    setTimeout(() => {}, 1500);
  },

  async created() {
    this.isLoader = true;
    await this.$store.dispatch('getTrialTestCategories');
    this.isLoader = false;
  },

  methods: {
    goTo() {
      this.$router.push({ name: 'tests-main' });
    },

    sendTestResults() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `send-test-results`,
      });
    },
    checkTestResults() {
      this.$router.push({
        name: 'trial-list-results',
        params: {
          try_id: this.$route.params.try_id,
        },
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

.current_test_header_wrapper
  background-color: var(--color-white)

.current_test_header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 45px 0 0
  margin-bottom: 100px
  @media screen and (max-width: 770px)
    flex-direction: column

.current_test_header__column
  width: 100%
  display: flex
  flex-direction: column
  gap: 40px
  @include xs

.current_test_header__column:last-child
  display: flex
  align-items: flex-end
  @include s
    align-items: center

.current_test_header__column:last-child img
  max-width: 400px
  @include s
    max-width: 100%

.current_test_header__column:last-child.with_progress img
  max-width: 230px

.current_test_header__column.ended
  @include xs
    display: none

.test_main__text li
  @include xs
    font-size: 14px

.test_main__text_item.bold
  font-size: 24px
  font-weight: bold

.orange
  color: var(--color-orange)
.green
  color: var(--color-success)

.test_header_ellipse
  @include xs
    padding: 90px 0
    justify-self: center
    align-self: center

.test_header_btns__trial
  display: flex
  gap: 32px
  @include s
    padding-bottom: 24px
    flex-direction: column
  @include xs
    align-items: center
    gap: 16px

.test_header_btns__trial__small
  @include xs
    // align-self: flex-end

.current_test_loader
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
</style>
