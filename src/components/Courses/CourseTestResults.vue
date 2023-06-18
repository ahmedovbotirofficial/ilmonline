<template>
  <div class="current_test_main_wrapper">
    <div class="container">
      <div class="current_test_main">
        <div class="current_test_questions">
          <div class="current_test_questions__wrapper">
            <Heading level="5">{{ $t('titles.test_number') }}</Heading>
            <div class="current_lesson_test_questions__steps">
              <div
                v-for="item in getData.questions"
                :key="item.order_position"
                class="current_lesson_test_questions__step"
                :class="[
                  {
                    current:
                      getCurrentQuestion.order_position === item.order_position,
                  },
                  getRightAnswers(item.id),
                ]"
                @click="setCurrentStep(item.question_id, item.order_position)"
              >
                {{ item.order_position }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!!getRightLessonTestAnswers.length"
          class="current_test_choose"
        >
          <Heading level="4" class="current_test_choose__title">
            {{ getCurrentQuestion.title }}
          </Heading>
          <img
            v-if="!!getCurrentQuestion.image"
            :src="getCurrentQuestion.image"
            class="current_test_choose__title_image"
          />

          <div
            v-for="item in getCurrentQuestion.answers"
            :key="item.id"
            class="test_block"
            :class="{
              rigth_answer:
                getRightLessonTestAnswers.find(
                  (el) => el.question_id === item.question_id
                ).id === item.id,
              badAnswer: getBadAnswers(item.question_id, item.id),
            }"
          >
            <div
              class="test_block__checkbox"
              :class="{
                rigth_answer:
                  getRightLessonTestAnswers.find(
                    (el) => el.question_id === item.question_id
                  ).id === item.id,
                badAnswer: getBadAnswers(item.question_id, item.id),
              }"
            >
              <div
                v-if="
                  getRightLessonTestAnswers.find(
                    (el) => el.question_id === item.question_id
                  ).id === item.id || getBadAnswers(item.question_id, item.id)
                "
                class="test_block__checkbox--center"
                :class="{
                  rigth_answer:
                    getRightLessonTestAnswers.find(
                      (el) => el.question_id === item.question_id
                    ).id === item.id,
                  badAnswer: getBadAnswers(item.question_id, item.id),
                }"
              ></div>
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
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="
                setCurrentStep(
                  getCurrentQuestion.id,
                  getCurrentQuestion.order_position - 1
                )
              "
            >
              {{ $t('buttons.go_back') }}
            </ButtonBase>
            <ButtonBase
              v-if="isLastQuestion"
              color="orange"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="goToNextLesson"
            >
              <span v-if="getLessonTest.is_last">
                {{ $t('buttons.go_back_to_lesson') }}
              </span>
              <span v-else-if="correctAnswersPercent >= 70">
                <span v-if="getCoursesMode === 'pro'">{{
                  $t('buttons.go_to_individual_task')
                }}</span>
                <span v-else>{{ $t('buttons.go_to_next_lesson') }}</span>
              </span>
              <span v-else>
                {{ $t('buttons.go_back_to_lesson') }}
              </span>
            </ButtonBase>
            <template v-else>
              <ButtonBase
                color="orange"
                :size="getWindowWidth < 640 ? 'max' : 'popular'"
                @click.native="
                  setCurrentStep(
                    getCurrentQuestion.id,
                    getCurrentQuestion.order_position + 1
                  )
                "
              >
                {{ $t('buttons.next_step') }}
              </ButtonBase>
            </template>
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

  props: {
    testProgressStatus: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      currentNumberQuestion: null,

      lastQuestionId: 0,
      isLastQuestion: false,
      isNotFirstQuestion: false,
      questions_count: 0,
    };
  },

  computed: {
    ...mapGetters([
      'getLessonTest',
      'getCoursesMode',
      'getUserRole',
      'getEndedLessonTestStatus',
      'getRightLessonTestAnswers',
      'getMyProgressOfCourse',
      'getWindowWidth',
      'getLessonTestProgress',
    ]),

    correctAnswersPercent() {
      return (
        (this.correctAnswers / this.testProgressStatus.total_answers) * 100
      );
    },

    correctAnswers() {
      return this.getLessonTestProgress.filter((el) => el.right).length;
    },

    getData() {
      return !!this.getLessonTest?.questions?.length ? this.getLessonTest : [];
    },

    getCurrentQuestion() {
      if (this.getFirstQuestionId) {
        return this.getData.questions.find(
          (el) => el.order_position === this.getCurrNumberQuestion
        );
      } else return 0;
    },

    getCurrNumberQuestion() {
      return this.currentNumberQuestion || this.getFirstQuestionId;
    },

    getFirstQuestionId() {
      return this.getData?.questions[0].order_position;
    },
    getLastQuestionId() {
      return this.getData.questions[this.getData.questions.length - 1]
        .order_position;
    },

    getQuestionsCount() {
      return this.getData?.questions_count;
    },
  },

  created() {},

  methods: {
    getRightAnswers(getCurrentQuestionId) {
      let el = this.getLessonTestProgress.find(
        (el) => el.question_id === getCurrentQuestionId
      );
      return el.right ? 'rigth_answer' : '';
    },

    getBadAnswers(question_id, answer_id) {
      return (
        this.getMyProgressOfCourse.lessonProgress
          .find((el) => el.lesson_id === this.getLessonTest.lesson_id)
          .testProgress.find((el) => el.question_id === question_id)
          .answer_id === answer_id
      );
    },

    async setCurrentStep(id, order) {
      this.currentNumberQuestion = order;

      this.isLastQuestion = !!(this.getLastQuestionId === order);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== order);
    },

    goToNextLesson() {
      this.correctAnswersPercent < 70 || this.getLessonTest.is_last
        ? this.$router.push({
            name: `${this.getUserRole}-video`,
            params: {
              course_id: this.$route.params.course_id,
              lesson_id: this.$route.params.lesson_id,
            },
          })
        : this.getCoursesMode === 'pro'
        ? this.$router.push({
            name: 'student-individual-task',
            params: {
              course_id: this.$route.params.course_id,
              lesson_id: this.$route.params.lesson_id,
              individual_task_id: this.getLessonTest.task_id,
            },
          })
        : this.$router.push({
            name: `${this.getUserRole}-video`,
            params: {
              course_id: this.$route.params.course_id,
              lesson_id: this.getLessonTest.next_lesson_id,
            },
          });
    },
  },
};
</script>

<style lang="sass" scoped>
.current_test_main_wrapper .container
  @include s
    padding-left: 0 !important
    padding-right: 0 !important

.current_test_main
  display: grid
  grid-template-columns: 29.5% 1fr
  gap: 6%
  margin-bottom: 100px
  @include s
    grid-template-columns: 1fr

.current_test_questions
  padding: 24px
  @include s
    grid-row: 2/3

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

.current_lesson_test_questions__steps
  display: grid
  grid-template-columns: repeat(auto-fill, 41px)
  gap: 16px
  margin-top: 24px

.current_lesson_test_questions__step
  cursor: pointer
  width: 41px
  height: 41px
  border: 1px solid var(--color-orange)
  display: flex
  align-items: center
  justify-content: center
  background-color: var(--color-orange)
  color: var(--color-white)

.current_lesson_test_questions__step:hover
  color: var(--color-orange)
  border: 1px solid var(--color-orange)
  background-color: var(--color-white)

.current_lesson_test_questions__step.rigth_answer
  color: var(--color-white)
  background-color: var(--color-success)
  border: none

.current_lesson_test_questions__step.current
  color: var(--color-orange)
  border: 1px solid var(--color-orange)
  background-color: var(--color-white)

.current_lesson_test_questions__step.current:hover
  color: var(--color-orange)

.current_lesson_test_questions__step.rigth_answer.current
  color: var(--color-success)
  border: 1px solid var(--color-success)
  background-color: var(--color-white)

.current_lesson_test_questions__step.rigth_answer:hover
  background-color: var(--color-white)
  color: var(--color-success)
  border: 1px solid var(--color-success)

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

.test_block.rigth_answer
  border: 1px solid var(--color-success)

.test_block.badAnswer
  border: 1px solid var(--color-orange)

.test_block.rigth_answer.badAnswer
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

.test_block__checkbox.rigth_answer,
.test_block__checkbox.badAnswer
  display: flex
  align-items: center
  justify-content: center

.test_block__checkbox.rigth_answer
  border: 1px solid var(--color-main)

.test_block__checkbox.badAnswer
  border: 1px solid var(--color-orange)

.test_block__checkbox.rigth_answer
  border: 1px solid var(--color-success)
// background-color: var(--color-white)

.test_block__checkbox--center,
.test_block__checkbox--center.badAnswer
  height: 8px
  width: 8px
  border-radius: 50%
  background-color: var(--color-success)

.test_block__checkbox--center.badAnswer
  background-color: var(--color-orange)

.test_block__checkbox--center.badAnswer.rigth_answer
  background-color: var(--color-success)

.test_block__link
  display: flex
  flex-direction: column
  line-height: 24px

.test_block__link_image
  margin-top: 24px

.current_test_choose__title
  display: flex
  flex-direction: column

.current_test_question_image
  display: flex
  align-items: center
  justify-content: center
  max-height: 430px

.current_test_choose__title_image
  margin-bottom: 30px
  max-height: 400px

.current_test_choose__btns
  display: flex
  justify-content: space-between
  gap: 30px
  margin-top: 36px

  @media only screen and (max-width: 640px)
    flex-direction: column
    gap: 16px

  .button_wrapper.popular
    max-width: 274px

  .primary-btn--max
    width: 100%

.current_test_choose__btns::v-deep
  .primary-btn--popular
    width: 274px

.next_btn
  justify-content: flex-end
</style>
