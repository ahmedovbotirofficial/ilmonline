<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="trial_results_main_wrapper">
    <div v-if="$route.name === 'trial-list-results'" class="trial_header__main">
      <div class="container">
        <div class="trial_header__main_wrapper ended">
          <Heading level="2" v-html="headerTitle" />
          <ul class="trial_header_info">
            <li>
              {{
                $t('tests.right_answers_info', {
                  correct_answers: trueAnswers,
                  total_answers: getCurrentTrialTest.questions_count,
                })
              }}
            </li>
          </ul>

          <div class="test_results_btns">
            <ButtonBase color="orange" size="popular" @click.native="goTo">
              {{ $t('buttons.go_back_to_tests') }}
            </ButtonBase>

            <ButtonBase
              color="transparent_blue"
              size="small"
              icon-name="trial_test_send"
              class="test_results_btns__small"
              @click.native="sendTestResults"
            />
          </div>

          <div class="trial_header__right ended">
            <svg-icon :name="'course_test_with_progress'" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!!getCurrentQuestion" class="container">
      <div class="current_test_main">
        <div class="current_test_questions">
          <div class="current_test_questions__wrapper">
            <Heading level="5">
              {{ $t('tests.right_answers') }}
              <span style="color: #59c676">
                {{ trueAnswers }}
              </span>
            </Heading>

            <div class="current_test_questions__steps">
              <div
                v-for="(item, idx) in getData.questions"
                :key="item.id"
                class="current_test_questions__step"
                :class="[
                  {
                    current: getCurrentQuestion.id === item.id,
                  },
                  getRightQuestion(item.id),
                ]"
                @click="setCurrentStep(item.id)"
              >
                {{ idx + 1 }}
              </div>
            </div>
          </div>
        </div>

        <div class="current_test_choose">
          <Heading level="4" class="current_test_choose__title">
            <div class="current_test_choose__title_text">
              {{ getCurrentQuestion.title }}
            </div>
            <img
              v-if="!!getCurrentQuestion.image"
              :src="getCurrentQuestion.image"
              class="current_test_choose__title_image"
            />
          </Heading>

          <div
            v-for="item in getCurrentQuestion.answers"
            :key="item.id"
            class="test_block"
            :class="[
              {
                selected: selectedAnswers.answer_id === item.id,
              },
              getStylesAnswer(item.question_id, item.id),
            ]"
          >
            <div
              class="test_block__checkbox"
              :class="[
                {
                  selected: selectedAnswers.answer_id === item.id,
                },
                getStylesAnswer(item.question_id, item.id),
              ]"
            >
              <div class="test_block__checkbox--center"></div>
            </div>
            <div class="test_block__link">
              <div class="test_block__link_text">{{ item.title }}</div>
              <img
                v-if="!!item.image"
                :src="item.image"
                class="test_block__link_image"
              />
            </div>
          </div>
          <div
            class="current_test_choose__btns"
            :class="{ next_btn: !isNotFirstQuestion }"
          >
            <ButtonBase
              v-if="isNotFirstQuestion"
              color="transparent"
              size="popular"
              @click.native="setCurrentStep(getCurrentQuestion.id - 1)"
            >
              {{ $t('buttons.go_back') }}
            </ButtonBase>
            <ButtonBase
              v-if="isLastQuestion"
              :disabled="getMyTrialTestData.length !== getQuestionsCount"
              color="transparent"
              size="popular"
              @click.native="goTo"
            >
              {{ $t('buttons.go_back_to_tests') }}
            </ButtonBase>
            <ButtonBase
              v-else
              color="orange"
              size="popular"
              @click.native="setCurrentStep(getCurrentQuestion.id + 1)"
            >
              {{ $t('buttons.next_step') }}
            </ButtonBase>
          </div>
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

  data() {
    return {
      currentNumberQuestion: null,

      isLastQuestion: false,
      isNotFirstQuestion: false,

      lastAnswer: {
        question_id: null,
        answer_id: null,
      },

      selectedAnswers: {
        question_id: null,
        answer_id: null,
      },
    };
  },

  computed: {
    ...mapGetters(['getCurrentTrialTest', 'getMyTrialTest']),

    headerTitle() {
      return (
        this.$t('tests.work_with_mistakes') +
        `<span style=\"color: #ec5239\"> ${this.getMyTrialTest.school_item_title} </span>`
      );
    },

    getData() {
      return !!this.getCurrentTrialTest?.questions?.length
        ? this.getCurrentTrialTest
        : [];
    },

    getMyTrialTestData() {
      return !!this.getMyTrialTest.studentResponses?.length
        ? this.getMyTrialTest.studentResponses
        : [];
    },

    getCurrentQuestion() {
      if (this.getFirstQuestionId) {
        return this.getData.questions?.find(
          (el) => el.id === this.getCurrNumberQuestion
        );
      } else return 0;
    },

    getCurrNumberQuestion() {
      return this.currentNumberQuestion || this.getFirstQuestionId;
    },

    getFirstQuestionId() {
      if (!!this.getData.questions?.length) {
        return this.getData?.questions[0].id;
      } else {
        return [];
      }
    },
    getLastQuestionId() {
      return this.getData.questions[this.getData.questions.length - 1].id;
    },

    getQuestionsCount() {
      return this.getData?.questions_count;
    },

    trueAnswers() {
      return this.getMyTrialTestData.filter((el) => el.right).length;
    },
  },

  async created() {
    this.$store.commit('SET_CURR_BREAD_LABEL', {
      misstakes_work: 'breadCrumbs.misstakes_work',
    });

    await this.$store.dispatch('getMyTrialTest', {
      try_id: +this.$route.params.try_id,
    });
    await this.$store.dispatch(
      'getTrialTest',
      this.getMyTrialTest.trial_test_id
    );
  },

  methods: {
    getRightQuestion(id) {
      let res = this.getMyTrialTestData.find((el) => el.question_id === id);
      return res && res.right
        ? 'rightAnswer'
        : res && res.right === false
        ? 'bad_answer'
        : '';
    },

    getStylesAnswer(question_id, answer_id) {
      let styles = [];
      let res = this.getMyTrialTestData.find(
        (el) => el.question_id === question_id
      );

      if (!!res && res.right_answer_id === answer_id) {
        styles.push('rightAnswer');
      }
      if (
        !!res &&
        res.answer_id === answer_id &&
        res.right_answer_id !== answer_id
      ) {
        styles.push('badAnswer');
      }
      return styles;
    },

    async setCurrentStep(id) {
      // console.log('question id passing test >>>', id);
      this.isLastQuestion = !!(this.getLastQuestionId === id);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== id);

      this.currentNumberQuestion = id;
    },

    goTo() {
      this.$router.push({ name: 'tests-main' });
    },

    sendTestResults() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `send-test-results`,
      });
    },

    selectTestAnswer(id) {
      // console.log('>>> selectedAnswers', this.selectedAnswers);
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
  margin-bottom: 100px
  background: var(--color-white)

.trial_header__main_wrapper.ended
  display: grid
  grid-template-columns: 1fr 0.4fr
  grid-template-rows: 140px 100px 100px
  padding-top: 100px
  padding-bottom: 50px
  @include xs
    grid-template-rows: 1fr 1fr 7fr 114px
    grid-template-columns: 1fr
    padding-top: 20px
  @include xxs
    grid-template-rows: 1fr 1fr 5fr 114px

.trial_header__main_wrapper.ended .title--2
  grid-column: 1/2
  @media only screen and (max-width: 880px)
    align-self: flex-end
  @include xs
    grid-column: 1/-1

.trial_header_info
  grid-column: 1/2
  @media only screen and (max-width: 880px)
    align-self: flex-end
  @include xs
    grid-column: 1/-1
    grid-row: 2/3

.test_results_btns
  // grid-column: 2/3
  grid-row: 3/4
  display: flex
  gap: 40px
  @media only screen and (max-width: 880px)
    align-self: flex-end
  @include xs
    grid-row: 4/5
    display: flex
    // flex-direction: column
    gap: 16px

.test_results_btns .primary-btn--popular
  @include xs
    min-width: 87%
  @include xxs
    min-width: 77%

.trial_header__right.ended
  grid-row: 1/4
  grid-column: 2/3
  @media only screen and (max-width: 880px)
    grid-row: 2/4
  @include xs
    grid-column: 1/-1
    grid-row: 3/4
    align-self: center

.trial_header__right svg
  max-width: 480px
  max-height: 320px
  width: 100%
  height: 100%
  align-self: flex-end
  @include s
    align-self: center
    width: 100%
  @include xs
    max-width: 100%

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

.trial_header__right
  justify-content: flex-end

////////////////////////////////////////////
.current_test_main
  display: grid
  grid-template-columns: 29.5% 1fr
  gap: 6%
  margin-bottom: 100px
  @include s
    grid-template-columns: 1fr

.current_test_questions
  padding: 24px

.current_test_questions__wrapper
  padding: 24px
  margin: -24px
  background-color: var(--color-white)

.current_test_questions .title--5
  padding-bottom: 20px
  border-bottom: 1px solid var(--color-border-bottom-stars)

.current_test_choose
  background-color: var(--color-white)
  padding: 40px
  @include xxs
    padding: 24px

.current_test__timer
  display: flex
  align-items: center
  justify-content: center

.current_test_questions__steps
  display: grid
  grid-template-columns: repeat(auto-fill, 41px)
  gap: 16px
  margin-top: 24px

.current_test_questions__step
  cursor: pointer
  width: 41px
  height: 41px
  border: 1px solid var(--primary-font-color)
  display: flex
  align-items: center
  justify-content: center

.current_test_questions__step:hover
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_test_questions__step.current
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_test_questions__step.rightAnswer
  color: var(--color-white)
  background-color: var(--color-success)
  border: none

.current_test_questions__step.rightAnswer.current
  color: var(--color-main)
  border: 1px solid var(--color-main)
  background-color: var(--color-white)

.current_test_questions__step.bad_answer
  color: var(--color-white)
  background-color: var(--color-main)
  border: 1px solid var(--color-main)

.test_block
  cursor: pointer
  display: flex
  gap: 12px
  align-items: center
  padding: 16px
  border: 1px solid #d8d8d8
  margin-bottom: 16px
  max-width: 680px
  @include s
    max-width: 100%
  @include xxs
    padding: 14px 16px
    font-size: 14px

.test_block.selected,
.test_block.badAnswer
  border: 1px solid var(--color-main)

.test_block.rightAnswer
  border: 1px solid var(--color-success)

.test_block:hover
  border: 1px solid var(--color-main)

.level__select
  display: flex
  gap: 12px
  align-items: center
  margin-bottom: 16px
  cursor: pointer

.test_block__checkbox
  position: relative
  top: 4.5px
  align-self: flex-start
  height: 16px
  min-width: 16px
  border-radius: 50%
  border: 1px solid var(--primary-font-color)

.test_block__checkbox.selected,
.test_block__checkbox.rightAnswer,
.test_block__checkbox.badAnswer
  display: flex
  align-items: center
  justify-content: center
  border: 1px solid var(--color-main)

.test_block__checkbox.rightAnswer
  border: 1px solid var(--color-success)

.test_block__checkbox--center
  opacity: 0
  height: 8px
  width: 8px
  border-radius: 50%
  background-color: var(--color-main)

.test_block__checkbox.selected .test_block__checkbox--center,
.test_block__checkbox.badAnswer .test_block__checkbox--center
  opacity: 1
  background-color: var(--color-main)

.test_block__checkbox.rightAnswer .test_block__checkbox--center
  opacity: 1
  background-color: var(--color-success)

.test_block__link
  display: flex
  flex-direction: column
  line-height: 24px

.test_block__link_image
  margin-top: 24px

.current_test_choose__btns
  display: flex
  justify-content: space-between
  margin-top: 36px
  @include xs
    flex-direction: column
    gap: 16px

.next_btn
  justify-content: flex-end

.current_test_choose__title
  display: flex
  flex-direction: column

.current_test_choose__title_image
  max-height: 350px
  object-fit: contain
  margin-top: 24px
</style>
