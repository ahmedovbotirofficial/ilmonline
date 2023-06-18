<template>
  <div class="current_quiz_main_wrapper">
    <QuizTestHeader
      :description="getQuizTest.description"
      :title="getQuizTest.title"
      img="quiz_header_passing"
    />

    <div v-if="!!getCurrentQuestion" class="current_quiz_main container">
      <div
        v-if="getQuizTimerStatus && !!getQuizTestResponse.created_at"
        class="current_test__timer"
      >
        <TimerCounter :created-at="getQuizTestResponse.created_at" />
      </div>
      <div
        class="current_quiz_test_questions"
        :class="{ timer: getQuizTimerStatus }"
      >
        <div
          class="current_trial_test_questions__wrapper"
          :class="{ timer: getQuizTimerStatus }"
        >
          <Heading level="5">{{ $t('titles.test_number') }}</Heading>

          <div class="current_quiz_test_questions__steps">
            <div
              v-for="(item, idx) in getQuizTest.questions"
              :key="item.id"
              class="current_quiz_test_questions__step"
              :class="[
                {
                  current: getCurrentQuestion.id === item.id,
                  hasAnswer: hasAnswer(item.id),
                },
              ]"
              @click="setCurrentStep(item.id)"
            >
              {{ idx + 1 }}
            </div>
          </div>
        </div>
      </div>
      <div class="current_test_choose" :class="{ timer: getQuizTimerStatus }">
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
          class="quiz_block"
          :class="[
            {
              selected: selectedAnswers.answers.some((el) => el.id === item.id),
              hasAnswer: getAnswers(item.question_id, item.id),
            },
          ]"
          @click="selectTestAnswer(item.id)"
        >
          <div
            class="quiz_block__checkbox"
            :class="[
              {
                selected: selectedAnswers.answers.some(
                  (el) => el.id === item.id
                ),
                hasAnswer: getAnswers(item.question_id, item.id),
              },
            ]"
          >
            <div class="quiz_block__checkbox--center"></div>
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
          class="current_quiz_test_choose__btns"
          :class="{ next_btn: !isNotFirstQuestion }"
        >
          <ButtonBase
            v-if="isNotFirstQuestion"
            color="transparent"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="setCurrentStep(getCurrentQuestion.id - 1)"
          >
            {{ $t('buttons.go_back') }}
          </ButtonBase>
          <!-- !lastAnswer.answers.length || -->
          <ButtonBase
            v-if="isLastQuestion"
            :disabled="
              isDisabledFinishBtn ||
              (!lastAnswer.answers.length && !isDisabledFinishBtn)
            "
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="finishTest"
          >
            {{ $t('buttons.finish_btn') }}
          </ButtonBase>
          <ButtonBase
            v-else
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="setCurrentStep(getCurrentQuestion.id + 1)"
          >
            {{ $t('buttons.next_step') }}
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import QuizTestHeader from '@/components/Tests/QuizTests/QuizTestHeader.vue';
import TimerCounter from './TimerCounter.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    ButtonBase,
    TimerCounter,
    QuizTestHeader,
    // LessonCard,
  },

  props: {},

  data() {
    return {
      currentNumberQuestionId: null,

      isLastQuestion: false,
      isNotFirstQuestion: false,

      lastAnswer: {
        question_id: null,
        answers: [],
      },

      selectedAnswers: {
        question_id: null,
        answers: [],
      },
    };
  },

  computed: {
    ...mapGetters([
      'getQuizTest',
      'getWindowWidth',
      'getQuizTestResponse',
      'getQuizTestResults',
      'getQuizTestPassingId',
      'isAuthUser',
      'getUniqueUserID',
      'getQuizTimerStatus',
    ]),

    isDisabledFinishBtn() {
      let quizTestQuestionsIds = [];
      if (!!this.getQuizTest.questions) {
        quizTestQuestionsIds = this.getQuizTest.questions
          .map((el) => el.id)
          .filter((element) => element !== this.getLastQuestionId);
      }
      let quizResponseQuestionsIds = [];

      if (!!this.getQuizTestResponse.studentResponses) {
        quizResponseQuestionsIds =
          this.getQuizTestResponse.studentResponses.map((el) => el.question_id);
      }

      let conditions = quizTestQuestionsIds
        .map((element) => quizResponseQuestionsIds.includes(element))
        .every((elem) => elem);

      return !conditions;
    },

    getCurrentQuestion() {
      if (this.getFirstQuestionId) {
        return this.getQuizTest.questions?.find(
          (el) => el.id === this.getCurrNumberQuestionId
        );
      } else return 0;
    },

    getCurrNumberQuestionId() {
      return this.currentNumberQuestionId || this.getFirstQuestionId;
    },

    getFirstQuestionId() {
      if (!!this.getQuizTest.questions?.length) {
        return this.getQuizTest?.questions[0].id;
      } else {
        return [];
      }
    },
    getLastQuestionId() {
      return this.getQuizTest.questions[this.getQuizTest.questions.length - 1]
        .id;
    },

    getQuestionsCount() {
      return this.getQuizTest?.questions.length;
    },
  },

  destroyed() {
    this.$store.commit('SET_QUIZ_TEST', []);
    this.$store.commit('SET_QUIZ_STUDENT_RESPONSES', {
      studentResponses: null,
    });
  },

  async created() {
    // window.onbeforeunload = function (e) {
    //   return true;
    // };
    // window.addEventListener('beforeunload', this.leavePage);

    if (this.$route.name === 'quiz-passing-continue') {
      await this.$store.dispatch('getQuizTestResults', {
        quiz_passing_id:
          +this.$route.params.quiz_passing_id || this.getQuizTestResults.id,
      });

      this.$store.commit(
        'SET_QUIZ_TIMER_STATUS',
        this.getQuizTestResults.timer_status
      );

      await this.$store.dispatch('getQuizTest', {
        quiz_id: this.getQuizTestResults.quiz_test_id,
      });
    } else {
      await this.$store.dispatch('getQuizTest', {
        quiz_id: this.$route.params.quiz_id,
      });
      await this.$store.dispatch('startQuizTest', {
        quiz_id: this.$route.params.quiz_id,
        token: this.isAuthUser ? null : this.getUniqueUserID,
        timer_status: this.getQuizTimerStatus,
      });
      this.$router.push({
        name: 'quiz-passing-continue',
        params: { quiz_passing_id: this.getQuizTestResponse.id },
      });
      await this.$store.dispatch('getQuizTestResults', {
        quiz_passing_id:
          +this.$route.params.quiz_passing_id || +this.getQuizTestResponse.id,
      });
    }
    this.getLabel();
  },

  methods: {
    getLabel() {
      // console.log(this.$route.name);
      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: this.getQuizTest.category.title,
        test_title: this.getQuizTest.title,
        quiz_id: this.getQuizTest.id,
      });
    },
    leavePage() {
      // this.$store.commit('SET_MODAL', { state: true, name: 'parent-control' });
    },

    hasAnswer(id) {
      return (
        this.getQuizTestResponse.studentResponses &&
        this.getQuizTestResponse.studentResponses.find(
          (el) => el.question_id === id
        )
      );
    },

    getAnswers(question_id, answer_id) {
      let res = null;
      if (!!this.getQuizTestResponse.studentResponses) {
        res = this.getQuizTestResponse.studentResponses.find(
          (el) => el.answer_id === answer_id
        );
      }
      return !!res;
    },

    async checkAnswer() {
      if (!!this.selectedAnswers.answers.length) {
        let answersData = {
          question_id: this.selectedAnswers.question_id,
          answers: this.selectedAnswers.answers,
          pass_quiz_test_id:
            this.$route.params.quiz_passing_id || this.getQuizTestResponse.id,
        };

        // console.log(this.$route.params.quiz_id);

        await this.$store.dispatch('passingQuizTest', {
          answersData,
          quiz_id:
            this.$route.params.quiz_id || this.getQuizTestResults.quiz_test_id,
          token: this.isAuthUser ? null : this.getUniqueUserID,
        });
      }
      this.selectedAnswers = {
        question_id: null,
        answers: [],
      };
    },

    async setCurrentStep(id) {
      await this.checkAnswer();
      this.selectedAnswers = {
        question_id: null,
        answers: [],
      };

      this.isLastQuestion = !!(this.getLastQuestionId === id);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== id);

      this.currentNumberQuestionId = id;
    },

    async finishTest() {
      await this.checkAnswer();

      this.$store.commit('SET_QUIZ_STUDENT_RESPONSES', {
        studentResponses: null,
      });

      this.$router.push({
        name: 'quiz-results',
        params: {
          direction: this.$route.params.direction,
          category_id: this.$route.params.category_id,
          // quiz_id: this.$route.params.quiz_id,
          quiz_passing_id: this.$route.params.quiz_passing_id,
        },
      });
    },

    selectTestAnswer(id) {
      // console.log('>>> getCurrentQuestion.id', this.getCurrentQuestion);
      // console.log('>>> currentAnswer.id', id);
      if (this.selectedAnswers.answers.some((el) => el.id === id)) {
        this.selectedAnswers.answers = this.selectedAnswers.answers.filter(
          (el) => el.id !== id
        );
      } else {
        this.selectedAnswers.question_id = this.getCurrentQuestion.id;
        if (this.getCurrentQuestion.has_one_response) {
          this.selectedAnswers.answers = [{ id: id }];
        } else {
          this.selectedAnswers.answers.push({ id: id });
        }
      }
      if (this.isLastQuestion) {
        this.lastAnswer = this.selectedAnswers;
      }
    },
  },
};
</script>

<style lang="sass">
.current_quiz_main.container
  @include xxs
    padding: 0 !important

.current_quiz_main
  display: grid
  grid-template-columns: 29.5% 1fr
  gap: 6%
  margin-bottom: 100px
  @include s
    grid-template-columns: 1fr
  @include xs
    padding: 0 40px
  @include xxs
    padding: 0

.current_quiz_test_questions
  padding: 24px
  @include s
    grid-row: 2/3

.current_quiz_test_questions.timer
  @include s
    grid-row: 3

.current_test__timer
  display: flex
  align-items: center
  justify-content: center
  @include s
    justify-content: flex-start
  @include xxs
    justify-content: center

.current_trial_test_questions__wrapper
  padding: 24px
  margin: -24px
  background-color: var(--color-white)
  @include xxs
    margin: 0 -24px

.current_trial_test_questions__wrapper.timer
  @include s
    margin: 0 -24px 90px

.current_quiz_test_questions .title--5
  padding-bottom: 20px
  border-bottom: 1px solid var(--color-border-bottom-stars)

.current_test_choose
  background-color: var(--color-white)
  padding: 40px
  @include xs
    grid-row: 1/-1
  @include s
    grid-column: 1
    padding: 24px
.current_test_choose.timer
  grid-column: 2/3
  @include s
    grid-column: 1
    grid-row: 2

.current_quiz_test_questions__steps
  display: grid
  grid-template-columns: repeat(auto-fill, 41px)
  gap: 16px
  margin-top: 24px

.current_quiz_test_questions__step
  cursor: pointer
  width: 41px
  height: 41px
  border: 1px solid var(--primary-font-color)
  display: flex
  align-items: center
  justify-content: center

.current_quiz_test_questions__step:hover
  color: var(--color-head-title)
  border: 1px solid var(--color-head-title)

.current_quiz_test_questions__step.current
  color: var(--color-head-title)
  border: 1px solid var(--color-head-title)

.current_quiz_test_questions__step.hasAnswer
  color: var(--color-white)
  background-color: var(--color-head-title)
  border: none

.quiz_block
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

.quiz_block.selected,
.quiz_block.hasAnswer
  border: 1px solid var(--color-head-title)

.quiz_block:hover
  border: 1px solid var(--color-head-title)

.level__select
  display: flex
  gap: 12px
  align-items: center
  margin-bottom: 16px
  cursor: pointer

.quiz_block__checkbox
  position: relative
  top: 4.5px
  align-self: flex-start
  height: 16px
  min-width: 16px
  border: 1px solid var(--primary-font-color)

.quiz_block__checkbox.selected,
.quiz_block__checkbox.hasAnswer
  display: flex
  align-items: center
  justify-content: center
  border: 1px solid var(--color-head-title)

.quiz_block__checkbox--center
  opacity: 0
  height: 8px
  width: 8px
  background-color: var(--color-head-title)

.quiz_block__checkbox.selected .quiz_block__checkbox--center,
.quiz_block__checkbox.hasAnswer .quiz_block__checkbox--center
  opacity: 1
  background-color: var(--color-head-title)

.test_block__link
  display: flex
  flex-direction: column
  line-height: 24px

.test_block__link_image
  margin-top: 24px

.current_quiz_test_choose__btns
  display: flex
  justify-content: space-between
  margin-top: 36px
  @media screen and (max-width: 640px)
    flex-direction: column
    gap: 16px

  .button_wrapper.primary-btn--transparent
    border: 1px solid var(--color-head-title)
    .primary-btn--transparent:hover
      background: var(--color-head-title)

  .primary-btn--popular:not(.primary-btn--transparent)
    background: var(--color-head-title)

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
