<template>
  <div class="current_test_main_wrapper">
    <div class="container">
      <div class="current_test_main">
        <div class="current_test_questions">
          <div class="current_test_questions__wrapper">
            <Heading level="5">{{ $t('titles.test_number') }}</Heading>
            <div class="current_test_questions__steps">
              <div
                v-for="(item, idx) in getData.questions"
                :key="item.id"
                class="current_test_questions__step"
                :class="{
                  current: getCurrentQuestion.id === item.id,
                  hasAnswer: lessonProgress.find(
                    (el) => el.question_id === item.id
                  ),
                }"
                @click="setCurrentStep(item.id)"
              >
                {{ idx + 1 }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="getCurrentQuestion" class="current_test_choose">
          <Heading level="4" class="current_test_choose__title">
            {{ getCurrentQuestion.title }}
          </Heading>

          <div
            v-for="item in getCurrentQuestion.answers"
            :key="item.id"
            class="test_block"
            :class="{
              selected:
                lessonProgress.find((el) => el.answer_id === item.id) &&
                !selectedAnswers.answer_id,
              new_selected: selectedAnswers.answer_id === item.id,
            }"
            @click="selectTestAnswer(item.id)"
          >
            <div
              class="test_block__checkbox"
              :class="{
                selected:
                  lessonProgress.find((el) => el.answer_id === item.id) &&
                  !selectedAnswers.answer_id,
                new_selected: selectedAnswers.answer_id === item.id,
              }"
            >
              <div
                v-if="
                  (lessonProgress.find((el) => el.answer_id === item.id) &&
                    !selectedAnswers.answer_id) ||
                  selectedAnswers.answer_id === item.id
                "
                class="test_block__checkbox--center"
              ></div>
            </div>
            <div class="test_block__link">{{ item.id }}</div>
          </div>
          <div
            class="current_test_choose__btns"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import CourseTestHeader from '@/components/Courses/CourseTestHeader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    ButtonBase,
    // CourseTestHeader,
    // LessonCard,
  },

  data() {
    return {
      currentNumberQuestion: null,

      urlInfo: {
        course_id: +this.$route.params.course_id,
        lesson_id: +this.$route.params.lesson_id,
        test_id: +this.$route.params.test_id,
      },

      lessonProgress: [],

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
    ...mapGetters(['getLessonTest', 'getWindowWidth']),

    getData() {
      return !!this.getLessonTest?.questions?.length ? this.getLessonTest : [];
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
    // getLastQuestionId() {},
  },

  async mounted() {
    await this.$store.dispatch('getLessonTest', {
      test_id: this.$route.params.test_id,
    });
  },

  destroyed() {
    // this.deleteTest();
  },

  beforeDestroy() {
    // this.deleteTest();
    window.onbeforeunload = null;
  },

  async created() {
    // this.deleteTest();
    // this.$store.dispatch('passingTest', )

    // <--   notification for user about leave TEST page /////////
    window.onbeforeunload = function (e) {
      return true;
    };
    window.addEventListener('beforeunload', this.reload);
    // -->
  },

  methods: {
    reload() {
      // this.deleteTest();
    },

    async setCurrentStep(id) {
      if (this.selectedAnswers.answer_id) {
        let selectedAnswerData = new FormData();
        selectedAnswerData.append(
          'question_id',
          this.selectedAnswers.question_id
        );
        selectedAnswerData.append('answer_id', this.selectedAnswers.answer_id);

        let res = await this.$store.dispatch('passingTest', {
          urlInfo: this.urlInfo,
          currentAnswer: selectedAnswerData,
        });

        // console.log(res.courseProgress);

        this.lessonProgress = res.courseProgress.lessonProgress.find(
          (el) => el.lesson_id === +this.$route.params.lesson_id
        ).testProgress;

        // console.log('after answer result', this.lessonProgress);
      }

      this.selectedAnswers = {
        question_id: null,
        answer_id: null,
      };

      this.isLastQuestion = !!(this.getLastQuestionId === id);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== id);

      this.currentNumberQuestion = id;
    },

    deleteTest() {
      this.$emit('clearTest', true);
    },

    finishTest() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `finish-test`,
      });
    },

    selectTestAnswer(id) {
      // console.log('>>> getCurrentQuestion.id', this.getCurrentQuestion.id);
      // console.log('>>> currentAnswer.id', id);

      this.selectedAnswers.question_id = this.getCurrentQuestion.id;
      this.selectedAnswers.answer_id = id;

      if (this.getCurrentQuestion.id === this.getLastQuestionId) {
        this.lastAnswer.question_id = this.getCurrentQuestion.id;
        this.lastAnswer.answer_id = id;
        this.setCurrentStep(this.lastAnswer.question_id);
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
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_test_questions__step.current
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_test_questions__step.hasAnswer
  color: var(--color-white)
  background-color: var(--color-main)
  border: none

.current_test_questions__step.hasAnswer.current
  color: var(--color-main)
  border: 1px solid var(--color-main)
  background-color: var(--color-white)

.current_test_questions__step.hasAnswer:hover
  background-color: var(--color-white)
  color: var(--primary-font-color)
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
.test_block.new_selected
  border: 1px solid var(--color-main)

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
.test_block__checkbox.new_selected
  display: flex
  align-items: center
  justify-content: center
  border: 1px solid var(--color-main)
// background-color: var(--color-white)

.test_block__checkbox--center
  height: 8px
  width: 8px
  border-radius: 50%
  background-color: var(--color-main)

.test_block__link
  line-height: 24px

.current_test_choose__btns
  display: flex
  justify-content: space-between
  margin-top: 36px

  @media only screen and (max-width: 640px)
    flex-direction: column
    gap: 16px

.next_btn
  justify-content: flex-end
</style>
