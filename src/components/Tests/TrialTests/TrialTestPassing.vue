<template>
  <div class="current_test_main_wrapper">
    <div class="container">
      <div class="current_test_main">
        <div class="current_test__timer">
          <TimerCounter
            :created-at="getMyTrialTest.created_at"
            :duration="getCurrentTrialTest.duration_minutes"
            :ended="!!getMyTrialTest.ended || getTrialTestTimerStatus"
          />
        </div>
        <div class="current_trial_test_questions">
          <div class="current_trial_test_questions__wrapper">
            <Heading level="5">
              {{ $t('tests.right_answers') }}
              <span style="color: #59c676">
                {{
                  !!getMyTrialTest.studentResponses &&
                  getMyTrialTest.studentResponses.filter((el) => el.right)
                    .length
                }}
              </span>
            </Heading>

            <div class="current_trial_test_questions__steps">
              <div
                v-for="item in getData.questions"
                :key="item.id"
                class="current_trial_test_questions__step"
                :class="[
                  {
                    current: getCurrentQuestion.id === item.id,
                  },
                  getRightQuestion(item.id),
                ]"
                @click="setCurrentStep(item.id, item.order_position)"
              >
                {{ item.order_position }}
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
            @click="selectTestAnswer(item.id, item.order_position)"
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
            class="current_trial_test_choose__btns"
            :class="{ next_btn: !isNotFirstQuestion }"
          >
            <ButtonBase
              v-if="isNotFirstQuestion"
              color="transparent"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              :disabled="isLoader"
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
              v-if="
                !!getMyTrialTest.studentResponses &&
                !!getMyTrialTest.studentResponses.find(
                  (el) => el.question_id === getCurrentQuestion.id
                ) &&
                !isLastQuestion
              "
              :disabled="isLoader"
              color="orange"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="
                setCurrentStep(
                  getCurrentQuestion.id,
                  getCurrentQuestion.order_position + 1
                )
              "
            >
              <span v-if="!isLoader">
                {{ $t('buttons.next_step') }}
              </span>
              <span v-else>
                <Loader color="white" size="small" />
              </span>
            </ButtonBase>

            <ButtonBase
              v-else
              color="orange"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              :disabled="isLoader || !selectedAnswers.answer_id"
              @click.native="checkAnswer"
            >
              <span v-if="!isLoader">
                {{ $t('buttons.check_answer') }}
              </span>
              <span v-else>
                <Loader color="white" size="small" />
              </span>
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
import TimerCounter from '@/components/Tests/TrialTests/TimerCounter.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { getFromLS, setToLS } from '../../../library/helpers';
import { ClientJS } from 'clientjs';

export default {
  components: {
    Heading,
    ButtonBase,
    TimerCounter,
    Loader,
    // LessonCard,
  },

  data() {
    return {
      currentNumberQuestion: null,

      isLastQuestion: false,
      isNotFirstQuestion: false,

      lastAnswer: {
        question_id: null,
        answer_id: null,
        order_position: null,
      },

      selectedAnswers: {
        question_id: null,
        answer_id: null,
      },
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getTrialCategories',
      'isAuthUser',
      'getTrialTestTimerStatus',
      'getCurrentTrialTest',
      'getMyTrialTest',
      'getUniqueUserID',
      'getWindowWidth',
    ]),

    getData() {
      return !!this.getCurrentTrialTest?.questions?.length
        ? this.getCurrentTrialTest
        : [];
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
  },

  async created() {
    // console.log('inside passing trial >>>>>>>>', this.$route.params);
    await this.createUniqueUserID();
    await this.$store.dispatch('getTrialTestCategories');
    this.getLabel();
  },

  methods: {
    async checkAnswer() {
      if (this.selectedAnswers.answer_id) {
        let selectedAnswerData = new FormData();
        selectedAnswerData.append(
          'question_id',
          this.selectedAnswers.question_id
        );
        selectedAnswerData.append('answer_id', this.selectedAnswers.answer_id);
        selectedAnswerData.append(
          'pass_trial_test_id',
          this.$route.params.try_id
        );

        if (!this.isLoader) {
          this.isLoader = true;
          await this.$store.dispatch('passingTrialTestVariant', {
            selectedAnswerData,
            variant_id: this.$route.params.variant_id,
            token: this.isAuthUser ? null : this.getUniqueUserID,
          });
        }
      }
      this.selectedAnswers = {
        question_id: null,
        answer_id: null,
      };

      this.isLoader = false;
    },

    async setCurrentStep(id, order) {
      this.selectedAnswers = {
        question_id: null,
        answer_id: null,
        order_position: null,
      };

      this.isLastQuestion = !!(this.getLastQuestionId === order);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== order);

      this.currentNumberQuestion = order;
    },

    selectTestAnswer(id) {
      if (
        !!this.getMyTrialTest.studentResponses.find(
          (el) => el.question_id === this.getCurrentQuestion.id
        )
      ) {
        return;
      } else {
        this.selectedAnswers.question_id = this.getCurrentQuestion.id;
        this.selectedAnswers.answer_id = id;
      }
      // console.log('>>> selectedAnswers', this.selectedAnswers);
    },

    createUniqueUserID() {
      const client = new ClientJS();
      if (!this.isAuthUser) {
        this.$store.commit('SET_FINGERPRINT', client.getFingerprint());
      }
    },
    getLabel() {
      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: this.getTrialCategories.find(
          (el) => el.slug === this.$route.params.direction
        ).title,
        variant_list_name: this.$t('tests.variants'),
        variant_number: this.getCurrentTrialTest.title,
      });
    },
    getRightQuestion(id) {
      if (!!this.getMyTrialTest.studentResponses) {
        let res = this.getMyTrialTest.studentResponses.find(
          (el) => el.question_id === id
        );
        return res && res.right
          ? 'rightAnswer'
          : res && res.right === false
          ? 'bad_answer'
          : '';
      }
    },

    getStylesAnswer(question_id, answer_id) {
      let styles = [];
      if (!!this.getMyTrialTest.studentResponses) {
        let res = this.getMyTrialTest.studentResponses.find(
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
      }
      return styles;
    },
  },
};
</script>

<style lang="sass" scoped>
.current_test_main
  display: grid
  grid-template-columns: 29.5% 1fr
  grid-template-rows: 140px 1fr
  gap: 6%
  margin-bottom: 100px
  @include s
    grid-template-columns: 1fr
    grid-template-rows: 100px 0.5fr 1fr
  @include xs
    padding: 0 40px
  @include xxs
    padding: 0

.current_trial_test_questions
  padding: 24px

.current_trial_test_questions__wrapper
  padding: 24px
  margin: -24px
  background-color: var(--color-white)

.current_trial_test_questions .title--5
  padding-bottom: 20px
  border-bottom: 1px solid var(--color-border-bottom-stars)

.current_test_choose
  background-color: var(--color-white)
  padding: 40px
  grid-column: 2/3
  grid-row: 1/-1
  @include s
    grid-row: 3/4
    grid-column: 1
  @include xs
    padding: 24px

.current_test__timer
  display: flex
  align-items: center
  justify-content: center
  @include s
    justify-content: flex-start
  @include xxs
    justify-content: center

.current_trial_test_questions__steps
  display: grid
  grid-template-columns: repeat(auto-fill, 41px)
  gap: 16px
  margin-top: 24px

.current_trial_test_questions__step
  cursor: pointer
  width: 41px
  height: 41px
  border: 1px solid var(--primary-font-color)
  display: flex
  align-items: center
  justify-content: center

.current_trial_test_questions__step:hover
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_trial_test_questions__step.current
  color: var(--color-main)
  border: 1px solid var(--color-main)

.current_trial_test_questions__step.rightAnswer
  color: var(--color-white)
  background-color: var(--color-success)
  border: none

.current_trial_test_questions__step.rightAnswer.current
  color: var(--color-main)
  border: 1px solid var(--color-main)
  background-color: var(--color-white)

.current_trial_test_questions__step.bad_answer
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

.current_trial_test_choose__btns
  display: flex
  justify-content: space-between
  margin-top: 36px
  @media screen and (max-width: 640px)
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
