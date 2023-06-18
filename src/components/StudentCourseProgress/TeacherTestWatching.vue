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
          >
            <div class="test_block__checkbox"></div>
            <div class="test_block__link">
              <div v-if="!!item.title" class="test_block__link_text">
                {{ item.title }}
              </div>
              <img
                v-if="!!item.image"
                :src="item.image"
                class="test_block__link_image"
                :class="{ without_title: !item.title.length }"
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
              color="orange"
              :size="getWindowWidth < 640 ? 'max' : 'popular'"
              @click.native="finishTest"
            >
              <span v-if="!isLoader">
                {{ $t('buttons.go_back_to_lesson') }}
              </span>
              <span v-else>
                <Loader color="white" size="small" />
              </span>
            </ButtonBase>
            <ButtonBase
              v-else
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
              <span v-if="!isLoader">
                {{ $t('buttons.next_step') }}
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
      isLastQuestion: false,
      isNotFirstQuestion: false,
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getLessonTest',
      'getWindowWidth',
      'getEndedLessonTestStatus',
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
  },

  async created() {},

  methods: {
    setCurrentStep(id, order) {
      this.currentNumberQuestion = order;
      this.isLastQuestion = !!(this.getLastQuestionId === order);
      this.isNotFirstQuestion = !!(this.getFirstQuestionId !== order);
    },

    finishTest() {
      this.$router.push({ name: 'lesson-detail' });
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
  border-bottom: 1px solid #D9D9D9

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
  background-color: var(--color-orange)
  border: none

.current_test_questions__step.hasAnswer.current
  color: var(--color-orange)
  border: 1px solid var(--color-orange)
  background-color: var(--color-white)

.current_test_questions__step.hasAnswer:hover
  background-color: var(--color-white)
  color: var(--primary-font-color)
  border: 1px solid var(--color-orange)

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
  border: 1px solid var(--color-orange)
// background-color: var(--color-white)

.test_block__checkbox--center
  height: 8px
  width: 8px
  border-radius: 50%
  background-color: var(--color-orange)

.test_block__link
  display: flex
  flex-direction: column
  line-height: 24px

.test_block__link_image
  margin-top: 24px
  max-height: 350px

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
