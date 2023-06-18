<template>
  <div class="current_quiz_related_wrapper">
    <div class="container">
      <div class="current_quiz_related">
        <svg-icon
          class="current_quiz_related__left_img"
          name="quiz_result_img_left"
        />
        <svg-icon
          class="current_quiz_related__right_img"
          name="quiz_result_img_right"
        />

        <div class="similar_courses__titles">
          <h2 class="similar_courses__head">
            {{ $t('titles.similar_courses_title') }}
          </h2>
          <h3 class="similar_courses__sub_head">
            {{ $t('titles.similar_courses_subtitle') }}
          </h3>

          <ButtonBase
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="goToRecommendedCourse"
          >
            {{ $t('buttons.goToCourse') }}
          </ButtonBase>
        </div>

        <div class="similar_courses__slider">
          <LessonCard
            :cards-data="relatedCourses[0]"
            class="course_card_lesson_wrapper"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import { mapGetters } from 'vuex';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';

export default {
  components: {
    LessonCard,
    ButtonBase,
  },
  props: {
    relatedCourses: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapGetters(['getWindowWidth']),
  },

  methods: {
    goToRecommendedCourse() {
      this.$router.push({
        name: 'current-course',
        params: {
          course_id: this.relatedCourses[0].id,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.current_quiz_related
  position: relative
  background-color: #fff
  padding: 60px
  margin-bottom: 60px
  display: flex
  gap: 5%
  @include s
    gap: 10%
    padding-top: 30px
  @include xs
    flex-direction: column
  @include xxs
    padding: 16px
    padding-bottom: 30px

.similar_courses__titles
  flex: 0 0 50%
  text-align: left
  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-start
  @include s
    flex: 0 0 40%
  @include xs
    align-items: center
    margin-bottom: 40px

.current_quiz_related__left_img
  position: absolute
  left: 0
  top: 0
  max-width: 80px
  max-height: 100px
  @include s
    max-width: 50px
    max-height: 60px
  @include xxs
    max-width: 45px
    max-height: 56px

.current_quiz_related__right_img
  position: absolute
  right: 17px
  bottom: 15px
  max-width: 72px
  max-height: 72px
  @include s
    max-width: 50px
    max-height: 60px
  @include xxs
    right: 0px
    bottom: 10px
    max-width: 38px
    max-height: 38px

.similar_courses__slider
  position: relative
  display: flex
  align-items: center
  justify-content: center

.course_card_lesson_wrapper
  @include s
    margin: 0

.similar_courses__head
  text-align: left
  @include adaptive-font-size(36, 24, 24)
  @include adaptive-line-height(48, 32, 30)
  margin-bottom: 16px
  @include s
    padding-top: 20px
  @include xs
    text-align: center
  @include xxs
    padding-top: 30px

.similar_courses__sub_head
  font-size: 20px
  text-align: left
  font-weight: normal
  margin-bottom: 40px
  @include xs
    text-align: center

.current_quiz_related_wrapper .container
  @include s
    margin: 0 !important
    padding: 0 !important
</style>
