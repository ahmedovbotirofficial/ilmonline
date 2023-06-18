<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="current_test_header_wrapper">
    <div class="container">
      <div
        class="current_test_header"
        :class="{ ended: getEndedLessonTestStatus }"
      >
        <Heading level="2" v-html="headerTitle" />
        <div
          class="current_test_header__info"
          :class="{ ended: getEndedLessonTestStatus }"
        >
          <ul v-if="!getEndedLessonTestStatus" class="test_main__text">
            <li>
              {{
                $t('tests.test_solving_info_1', {
                  count: testInfoForHeader.total_answers,
                })
              }}
            </li>
            <li>
              {{ $t('tests.test_solving_info_2') }}
            </li>
          </ul>

          <ul v-else class="test_main__text">
            <li class="test_main__text_item bold">
              <span
                :class="{
                  green: correctAnswersPercent >= 70,
                  orange: correctAnswersPercent < 70,
                }"
                >{{ Math.round(correctAnswersPercent) }} %</span
              >.
              {{ successTest }}
            </li>
            <li class="test_main__text_item">
              {{
                $t('tests.right_answers_info', {
                  correct_answers: correctAnswers,
                  total_answers: testInfoForHeader.total_answers,
                })
              }}
            </li>
          </ul>
        </div>

        <div v-if="getEndedLessonTestStatus" class="test_header_btns">
          <ButtonBase
            color="transparent"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="deleteTest"
          >
            {{ $t('buttons.go_to_test_again') }}
          </ButtonBase>

          <ButtonBase
            v-if="!getLessonTest.is_last"
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="goToNextLesson"
          >
            <span v-if="correctAnswersPercent >= 70">
              <span v-if="getCoursesMode === 'pro'">{{
                $t('buttons.go_to_individual_task')
              }}</span>
              <span v-else>{{ $t('buttons.go_to_next_lesson') }}</span>
            </span>
            <span v-else>
              {{ $t('buttons.go_back_to_lesson') }}
            </span>
          </ButtonBase>
          <ButtonBase
            v-else
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="goToNextLesson"
          >
            {{ $t('buttons.go_back_to_lesson') }}
          </ButtonBase>
        </div>
        <div
          class="current_header_img"
          :class="{ ended: getEndedLessonTestStatus }"
        >
          <img v-if="!getEndedLessonTestStatus" src="/images/course_test.png" />
          <img v-else src="/images/course_test_with_progress.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: {
    Heading,
    ButtonBase,
    // LessonCard,
  },
  props: {
    testInfoForHeader: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getEndedLessonTestStatus',
      'getUserRole',
      'getWindowWidth',
      'getLessonTestProgress',
      'getLessonTest',
    ]),

    correctAnswersPercent() {
      return (this.correctAnswers / this.testInfoForHeader.total_answers) * 100;
    },

    correctAnswers() {
      return this.getLessonTestProgress.filter((el) => el.right).length;
    },

    successTest() {
      return this.correctAnswersPercent >= 70
        ? this.$t('tests.test_success')
        : this.$t('tests.test_wrong');
    },
    headerTitle() {
      if (this.getLessonTest) {
        return this.getEndedLessonTestStatus
          ? this.$t('tests.work_with_mistakes') +
              `<span style=\"color: ${
                MAIN_COLORS[this.getCoursesMode].button
              }\">№${this.getLessonTest.lesson_order_position}</span>`
          : this.$t('tests.test_header') +
              `<span style=\"color: ${
                MAIN_COLORS[this.getCoursesMode].button
              }\">№${this.getLessonTest.lesson_order_position}</span>`;
      } else return '';
    },
  },

  mounted() {},

  methods: {
    deleteTest() {
      this.$emit('clearTest', true);
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

<style lang="sass">
.test_main__text_item
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px

.test_main__text_item::after
  position: absolute
  content: ''
  background-color: var(--color-head-title)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.current_test_header_wrapper
  background-color: var(--color-white)

.current_test_header
  display: grid
  grid-template-columns: 2fr 1fr
  column-gap: 10%
  row-gap: 10%
  padding: 45px 0 80px
  margin-bottom: 100px
  @include s
    grid-template-rows: 50px 0.1fr 0.5fr
    row-gap: 5%
    margin-bottom: 40px
  @include xxs
    row-gap: 0%
    padding: 45px 0 40px

.current_test_header.ended .title--2
  align-self: flex-end
  @include s
    grid-column: 1/-1
    grid-row: 1/2
  @media only screen and (max-width: 640px)
    font-size: 23px

.current_test_header.ended
  grid-template-rows: 1fr 1fr 48px
  row-gap: 10%
  @include s
    grid-template-rows: 50px 1fr 0.5fr
  @media only screen and (max-width: 640px)
    grid-template-rows: 50px 0fr 1fr 0.8fr
    grid-template-columns: 1fr
    column-gap: 0%
    row-gap: 5%
    padding: 0px 0 40px

.current_test_header__info
  grid-column: 1/2
  display: flex
  flex-direction: column
  gap: 24px
  @include s
    margin-bottom: 50px
    grid-column: 1/3

.current_test_header__info.ended
  @include s
    margin-bottom: 0px
    grid-row: 2/3
  @media only screen and (max-width: 640px)
    align-self: center
    grid-row: 2/3

.current_header_img
  grid-column: 2/3
  grid-row: 1/3
  align-self: flex-end
  justify-self: end
  @include s
    grid-column: 1/-1
    grid-row: 3/4
    justify-self: center

.current_header_img img
  @include s
    max-width: 570px
    width: 100%

.current_header_img.ended
  grid-row: 1/-1
  @include s
    grid-row: 2/4
    grid-column: 2/3
  @media only screen and (max-width: 640px)
    grid-row: 3/4
    grid-column: 1

.current_header_img.ended img
  max-width: 240px

.test_main__text
  @include xs
    font-size: 14px

.test_main__text_item.bold
  font-size: 24px
  font-weight: bold

.orange
  color: var(--color-orange)
.green
  color: var(--color-success)

.test_header_btns
  display: flex
  gap: 32px

  @media only screen and (max-width: 900px)
    flex-direction: column
    gap: 16px
  @media only screen and (max-width: 640px)
    grid-row: 4/5

  .button_wrapper.popular
    max-width: 274px

  .primary-btn
    width: 274px

  .primary-btn--max
    width: 100%

.test_header_btns,
.current_test_choose__btns
  .button_wrapper.primary-btn--transparent
    border: 1px solid var(--color-head-title)
    .primary-btn--transparent:hover
      background: var(--color-head-title)

  .primary-btn--popular:not(.primary-btn--transparent),
  .primary-btn--max:not(.primary-btn--transparent)
    background: var(--color-head-title)

  .primary-btn--popular[disabled],
  .primary-btn--max[disabled]
    opacity: 0.5
</style>
