<template>
  <div class="interested">
    <div v-if="course" class="container interested_lesson">
      <div class="card_content interested_content">
        <Heading level="2" class="card_detail__title">
          {{ $t('main.interestedLesson') }}
        </Heading>
        <Heading level="5" class="card_detail__subtitle">
          {{ $t('main.interestedLessonText') }}
        </Heading>
        <ButtonBase
          color="orange"
          size="popular"
          type="submit"
          class="auth_form__sign_in_btn"
          @click.native="goToCoursePage(course.id, course.title)"
          >{{ $t('buttons.goToCourse') }}
        </ButtonBase>
      </div>
      <LessonCard :cards-data="course" class="course_card_lesson_wrapper" />
    </div>
  </div>
</template>

<script>
import LessonCard from '@/components/LessonCard/LessonCard';
export default {
  components: { LessonCard },
  props: {
    course: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    goToCoursePage(id, title) {
      this.$router.push({
        name: 'current-course',
        params: { course_id: id, title: title },
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.interested_lesson
  height: 556px
  background-image: url("../../assets/images/special_bg.png")
  background-repeat: no-repeat
  background-position: center
  background-size: cover
  margin-bottom: 150px
  width: 100%
  max-width: 1280px
  display: flex
  justify-content: space-between
  align-items: center
  gap: 74px
  @include s
    gap: 42px
  @include xs
    gap: 0
    flex-wrap: wrap
    background-image: url("../../assets/images/mobile_bg.png")
    height: auto
    padding-bottom: 40px!important
    margin-bottom: 52px
.course_card_lesson_wrapper
  width: calc(40% - 74px)
  max-width: 373px
  height: 428px
  margin: 0
  @include s
    width: calc(55% - 21px)
  @include xs
    width: 100%
    max-width: 288px
    margin: 0 auto
.card_content
  width: 60%
  max-width: 705px
  align-items: center
  display: flex
  flex-wrap: wrap
  @include s
    width: 45%
  @include xs
    width: 100%
    padding: 40px 16px
    text-align: center
    justify-content: center
.card_detail__title
  @include adaptive-font-size(44, 24, 24)
  @include adaptive-line-height(64, 32, 30)
.card_detail__subtitle
  @include adaptive-font-size(24, 16, 16)
  @include adaptive-line-height(30, 20, 20)
  width: 100%
  margin: 16px 0 48px 0
  font-weight: 400
  @include s
    margin: 8px 0 24px 0
.interested
  @include xs
    margin: 0 -16px
</style>
