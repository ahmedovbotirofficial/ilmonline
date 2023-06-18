<template>
  <div class="direction_card">
    <div class="direction_card__top">
      <img :src="testByDirectionsData.image" />
    </div>
    <div class="direction_card__bottom">
      <div class="direction_card__title">
        {{ testByDirectionsData.title }}
      </div>

      <div class="direction_card__test_info">
        <div class="test_info__item">
          <svg-icon name="quiz_questions" />
          {{
            $t('tests.quiz_questions_count', {
              count_questions: testByDirectionsData.count_questions,
            })
          }}
        </div>
        <div class="test_info__item">
          <svg-icon name="quiz_time" />
          {{
            $t('tests.quiz_avg_time', {
              quiz_avg_time: testByDirectionsData.avg_test_time,
            })
          }}
        </div>
        <div class="test_info__item">
          <svg-icon name="quiz_questions" />
          {{
            $t('tests.student_count', {
              student_count: testByDirectionsData.student_test_passed_counter,
            })
          }}
        </div>
      </div>

      <div class="direction_card__btns">
        <ButtonBase
          color="transparent"
          size="max"
          @click.native.stop="openDescribeModal"
        >
          {{ $t('buttons.test_more') }}</ButtonBase
        >
        <ButtonBase
          color="orange"
          size="max"
          right-icon="card_arrow"
          @click.native.stop="openTests(testByDirectionsData.id)"
        >
          <span v-if="testByDirectionsData.status === 'in_progress'">{{
            $t('buttons.continue')
          }}</span>
          <span v-else>{{ $t('buttons.start_test') }}</span>
        </ButtonBase>
      </div>
    </div>
  </div>
</template>

<script>
// import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
export default {
  components: {
    // Heading,
    ButtonBase,
  },
  props: {
    testByDirectionsData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      title: null,
      // testByDirectionsData: [],
    };
  },
  methods: {
    openTests(quiz_id) {
      if (this.testByDirectionsData.status === 'in_progress') {
        this.openQuizContinueModal();
      } else {
        this.$store.commit('SET_QUIZ_STUDENT_RESPONSES', {
          studentResponses: null,
        });

        this.$store.commit('SET_MODAL', {
          state: true,
          name: 'quiz-timer',
          // props: +this.$route.params.quiz_id,
          props: this.testByDirectionsData,
        });
      }
    },

    openQuizContinueModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'quiz-continue',
        props: this.testByDirectionsData,
      });
    },

    openDescribeModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'quiz-test-description',
        props: this.testByDirectionsData,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.direction_card
  background: var(--color-white)
  @include xxs
    justify-self: center

.direction_card__top
  background-color: #EBFBEC
  // padding: 20px 20px 0
  justify-content: center
  display: flex
  height: auto

.direction_card__top img
  // height: 160px
  height: auto
  object-fit: contain
  object-position: bottom

.direction_card__bottom
  padding: 16px 24px 24px
  border: 1px solid #D8D8D8
  border-top: none
  display: flex
  height: 270px
  flex-direction: column
  justify-content: space-between
  @include s
    height: auto
  @include xs
    height: 270px
  @include xxs
    height: auto

.direction_card__title
  font-size: 20px
  line-height: 28px
  font-weight: bold
  margin-bottom: 24px
  min-height: min-content

.direction_card__btns
  display: flex
  flex-direction: column
  gap: 24px

.direction_card__btns .button_wrapper
  width: 100%

.direction_card__test_info
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 24px

.test_info__item
  display: flex
  align-items: center
  gap: 6px
  font-size: 14px
  color: var(--color-font-light-dark)

.test_info__item svg
  max-width: 15px
  max-height: 15px
</style>
