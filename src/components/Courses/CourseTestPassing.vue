<template>
  <div class="current_test_main_wrapper">
    <div class="container">
      <div class="current_test_main">
        <div class="current_test_questions">
          <div class="current_test_questions__wrapper">
            <Heading level="5">{{ $t('titles.test_number') }}</Heading>
            <div class="current_test_questions__steps">
              <div
                v-for="item in getData.questions"
                :key="item.id"
                class="current_test_questions__step"
                :class="{
                  current: getCurrentQuestion.id === item.id,
                  hasAnswer: getLessonTestProgress.find(
                    (el) => el.question_id === item.id
                  ),
                }"
                @click="setCurrentStep(item.id, item.order_position)"
              >
                {{ item.order_position }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="getCurrentQuestion" class="current_test_choose">
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
            :class="{
              selected:
                getLessonTestProgress.find((el) => el.answer_id === item.id) &&
                !selectedAnswers.answer_id,
              new_selected: selectedAnswers.answer_id === item.id,
            }"
            @click="selectTestAnswer(item.id, item.order_position)"
          >
            <div
              class="test_block__checkbox"
              :class="{
                selected:
                  getLessonTestProgress.find(
                    (el) => el.answer_id === item.id
                  ) && !selectedAnswers.answer_id,
                new_selected: selectedAnswers.answer_id === item.id,
              }"
            >
              <div
                v-if="
                  (getLessonTestProgress.find(
                    (el) => el.answer_id === item.id
                  ) &&
                    !selectedAnswers.answer_id) ||
                  selectedAnswers.answer_id === item.id
                "
                class="test_block__checkbox--center"
              ></div>
            </div>
            <div class="test_block__link">
              <div v-if="!!item.title" class="test_block__link_text">
                {{ item.title }}
              </div>
              <img
                v-if="!!item.image"
                :src="item.image"
                class="test_block__link_image"
                :class="{ without_title: !!!item.title }"
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
              :disabled="isLoader"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="
                setCurrentStep(
                  getCurrentQuestion.id,
                  getCurrentQuestion.order_position - 1
                )
              "
            >
              <span v-if="!isLoader">
                {{ $t('buttons.go_back') }}
              </span>
              <span v-else>
                <Loader color="orange" size="small" />
              </span>
            </ButtonBase>
            <ButtonBase
              v-if="isLastQuestion"
              :disabled="
                !lastAnswer.answer_id ||
                getLessonTestProgress.length !== getQuestionsCount ||
                isLoader
              "
              color="orange"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="finishTest"
            >
              <template v-if="!isLoader">
                {{ $t('buttons.finish_btn') }}
              </template>
              <template v-else>
                <Loader color="white" size="small" />
              </template>
            </ButtonBase>
            <template v-else>
              <ButtonBase
                v-if="getLessonTest.questions_count > 1"
                color="orange"
                :size="getWindowWidth < 640 ? 'max' : 'popular'"
                :disabled="isLoader"
                @click.native="
                  setCurrentStep(
                    getCurrentQuestion.id,
                    getCurrentQuestion.order_position + 1
                  )
                "
              >
                <template v-if="!isLoader">
                  {{ $t('buttons.next_step') }}
                </template>
                <template v-else>
                  <Loader color="white" size="small" />
                </template>
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
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
  },

  data() {
    return {
      currentNumberQuestion: null,

      urlInfo: null,

      // lessonProgress: [],

      isLastQuestion: false,
      isNotFirstQuestion: false,

      lastAnswer: {
        question_id: null,
        answer_id: null,
        order_position: null,
      },

      isLoader: false,

      selectedAnswers: {
        question_id: null,
        answer_id: null,
        order_position: null,
      },
    };
  },

  computed: {
    ...mapGetters([
      'getLessonTest',
      'getWindowWidth',
      'getEndedLessonTestStatus',
      'getLeavePageStatus',
      'getCoursesModeDispatch',
      'getMyProgressOfCourse',
      'getLessonTestProgress',
    ]),

    getData() {
      return !!this.getLessonTest?.questions?.length ? this.getLessonTest : [];
    },

    getCurrentQuestion() {
      if (this.getFirstQuestionId) {
        return this.getData.questions?.find(
          (el) => el.order_position === this.getCurrNumberQuestion
        );
      } else return 0;
    },

    getCurrNumberQuestion() {
      return this.currentNumberQuestion || this.getFirstQuestionId;
    },

    getFirstQuestionId() {
      if (!!this.getData.questions?.length) {
        return this.getData?.questions[0].order_position;
      } else {
        return [];
      }
    },
    getLastQuestionId() {
      return this.getData.questions[this.getData.questions.length - 1]
        .order_position;
    },

    getQuestionsCount() {
      return this.getData?.questions_count;
    },
    // getLastQuestionId() {},
  },

  async mounted() {
    // await this.$store.dispatch(`get${this.getCoursesModeDispatch}LessonTest`, {
    //   lesson_id: +this.$route.params.lesson_id,
    // });
  },

  beforeDestroy() {
    // this.deleteTest();
    window.onbeforeunload = null;
  },

  async created() {
    // this.$store.dispatch('passingTest', )

    // <--   notification for user about leave TEST page /////////
    window.onbeforeunload = function (e) {
      return true;
    };
    // window.addEventListener('beforeunload', this.reload);
    // -->
  },

  methods: {
    reload() {
      this.deleteTest();
    },

    async setCurrentStep(id, order) {
      this.isLoader = true;
      if (this.selectedAnswers.answer_id) {
        let selectedAnswerData = new FormData();
        selectedAnswerData.append(
          'question_id',
          this.selectedAnswers.question_id
        );
        selectedAnswerData.append('answer_id', this.selectedAnswers.answer_id);
        this.urlInfo = {
          course_id: +this.$route.params.course_id,
          lesson_id: +this.$route.params.lesson_id,
          test_id: this.getLessonTest.id,
        };

        await this.$store.dispatch(
          `passing${this.getCoursesModeDispatch}Test`,
          {
            urlInfo: this.urlInfo,
            currentAnswer: selectedAnswerData,
          }
        );

        // console.log(res.courseProgress);

        this.$store.commit(
          'SET_LESSON_TEST_PROGRESS',
          this.getMyProgressOfCourse.lessonProgress.find(
            (el) => el.lesson_id === this.getLessonTest.lesson_id
          ).testProgress
        );

        // console.log('after answer result', this.lessonProgress);
      }

      this.isLoader = false;

      this.selectedAnswers = {
        question_id: null,
        answer_id: null,
        order_position: null,
      };

      this.currentNumberQuestion = order;
      this.isLastQuestion = !!(this.getLastQuestionId === order);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== order);
    },

    deleteTest() {
      this.$store.dispatch(`delete${this.getCoursesModeDispatch}LessonTest`, {
        test_id: this.getLessonTest.id,
      });
      // this.$emit('clearTest', true);
    },

    finishTest() {
      let finishData = {};
      finishData.urlInfo = {
        course_id: +this.$route.params.course_id,
        lesson_id: +this.$route.params.lesson_id,
        test_id: this.getLessonTest.id,
      };
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `finish-test`,
        props: finishData,
      });
    },

    selectTestAnswer(id, order) {
      // console.log('>>> getCurrentQuestion.id', this.getCurrentQuestion.id);
      // console.log('>>> currentAnswer.id', id);

      this.selectedAnswers.question_id = this.getCurrentQuestion.id;
      this.selectedAnswers.answer_id = id;
      this.selectedAnswers.order_position =
        this.getCurrentQuestion.order_position;

      if (this.getCurrentQuestion.order_position === this.getLastQuestionId) {
        this.lastAnswer.question_id = this.getCurrentQuestion.id;
        this.lastAnswer.answer_id = id;
        this.lastAnswer.order_position = this.getCurrentQuestion.order_position;
        this.setCurrentStep(null, this.lastAnswer.order_position);
      }
      // console.log('>>> selectedAnswers', this.selectedAnswers);
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
  color: var(--color-head-title)
  border: 1px solid var(--color-head-title)

.current_test_questions__step.current
  color: var(--color-head-title)
  border: 1px solid var(--color-head-title)

.current_test_questions__step.hasAnswer
  color: var(--color-white)
  background-color: var(--color-head-title)
  border: none

.current_test_questions__step.hasAnswer.current
  color: var(--color-head-title)
  border: 1px solid var(--color-head-title)
  background-color: var(--color-white)

.current_test_questions__step.hasAnswer:hover
  background-color: var(--color-white)
  color: var(--primary-font-color)
  border: 1px solid var(--color-head-title)

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
.test_block.new_selected
  border: 1px solid var(--color-head-title)

.test_block:hover
  border: 1px solid var(--color-head-title)

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
.test_block__checkbox.new_selected
  display: flex
  align-items: center
  justify-content: center
  border: 1px solid var(--color-head-title)
// background-color: var(--color-white)

.test_block__checkbox--center
  height: 8px
  width: 8px
  border-radius: 50%
  background-color: var(--color-head-title)

.test_block__link
  display: flex
  flex-direction: column
  line-height: 24px

.test_block__link_image
  margin-top: 24px

.test_block__link_image.without_title
  margin-top: 0

.current_test_choose__btns
  display: flex
  justify-content: space-between
  margin-top: 36px

  @media only screen and (max-width: 640px)
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
