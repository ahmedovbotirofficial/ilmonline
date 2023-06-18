<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="current_test_header_wrapper">
    <div class="container">
      <div class="current_test_header">
        <Heading level="2" v-html="headerTitle" />
        <div class="current_test_header__info">
          <ul class="test_main__text">
            <li>
              {{
                $t('tests.test_solving_info_1', {
                  count: questionsCount,
                })
              }}
            </li>
            <li>
              {{ $t('tests.test_solving_info_2') }}
            </li>
          </ul>
        </div>

        <div class="test_header_btns">
          <ButtonBase
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="goTo"
          >
            <span v-if="$route.name !== 'teacher-test-detail'">{{
              $t('buttons.go_back_to_lesson')
            }}</span>
            <span v-else>{{ $t('buttons.go_back_to_profile') }}</span>
          </ButtonBase>
        </div>
        <div class="current_header_img">
          <img src="/images/course_test_with_progress.png" />
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
    ...mapGetters(['getCoursesMode', 'getWindowWidth', 'getLessonTest']),

    questionsCount() {
      return !!this.getLessonTest ? this.getLessonTest.questions_count : '';
    },

    headerTitle() {
      return !!this.getLessonTest
        ? this.$t('courses.test') +
            ` <span style=\"color: ${
              MAIN_COLORS[this.getCoursesMode].button
            }\">№${this.getLessonTest.lesson_order_position}</span>`
        : '';
    },
  },

  mounted() {},

  methods: {
    goTo() {
      if (this.$route.name !== 'teacher-test-detail') {
        this.$router.push({
          name: `lesson-detail`,
          params: {
            course_id: this.$route.params.course_id,
            lesson_id: +this.$route.params.lesson_id + 1,
          },
        });
      } else {
        this.$router.push({ name: `students` });
      }
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
  background-color: var(--color-head-title)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px rgba(236, 82, 57, 0.25)

.current_test_header_wrapper
  background-color: var(--color-white)

.current_test_header
  display: grid
  padding: 45px 0 80px
  margin-bottom: 100px
  grid-template-rows: 1fr 1fr 48px
  row-gap: 10%
  column-gap: 10%
  @include s
    grid-template-rows: 0fr 0.5fr 1fr 0.5fr
    grid-template-columns: 1fr
    column-gap: 0%
    row-gap: 3%
    padding: 0
    padding-top: 16px
    margin-bottom: 40px

.current_test_header .title--2
  align-self: flex-end
  @include s
    font-size: 23px

.current_test_header__info
  display: flex
  flex-direction: column
  gap: 24px
  @include s
    margin-bottom: 0px
    align-self: center
    grid-row: 2/3

.current_header_img
  grid-column: 2/3
  grid-row: 1/-1
  align-self: flex-end
  justify-self: end
  @include s
    grid-row: 3/4
    grid-column: 1
    justify-self: center

.current_header_img img
  @include s
    max-width: 240px
    width: 100%

.test_main__text
  @include xs
    font-size: 14px

.test_main__text_item.bold
  font-size: 24px
  font-weight: bold

.test_header_btns
  display: flex
  gap: 32px
  @include s
    grid-row: 3/4
    flex-direction: column
    align-items: center
    gap: 16px
    grid-row: 4/5
</style>
