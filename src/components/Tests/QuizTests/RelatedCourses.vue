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

        <h2 class="similar_courses__head">
          {{ $t('titles.similar_courses_title') }}
        </h2>

        <h3 class="similar_courses__sub_head">
          {{ $t('titles.similar_courses_subtitle') }}
        </h3>

        <div class="similar_courses__slider">
          <div
            slot="button-prev"
            class="swiper__quiz_arrow_prev"
            :class="{ small: getWindowWidth <= 440 }"
          >
            <svg-icon
              v-if="getWindowWidth >= 441"
              name="arrow_swipe_quiz_right"
            />
            <svg-icon v-else name="arrow_swipe_quiz_left__small" />
          </div>
          <swiper ref="swiper" class="swiper" :options="swiperOptions">
            <swiper-slide
              v-for="card in relatedCourses"
              :key="card.id"
              class="swiper_slide"
            >
              <LessonCard
                :cards-data="card"
                class="course_card_lesson_wrapper"
              />
            </swiper-slide>
            <!-- @fetchOnAllCoursePage="fetchSimilarCourses" -->
          </swiper>
          <div
            slot="button-next"
            class="swiper__quiz_arrow_next"
            :class="{ small: getWindowWidth <= 440 }"
          >
            <svg-icon
              v-if="getWindowWidth >= 441"
              name="arrow_swipe_quiz_left"
            />
            <svg-icon v-else name="arrow_swipe_quiz_right__small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    LessonCard,
  },
  props: {
    relatedCourses: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 80,
        navigation: {
          prevEl: '.swiper__quiz_arrow_prev',
          nextEl: '.swiper__quiz_arrow_next',
        },
        breakpoints: {
          1199: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 1,
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters(['getWindowWidth']),
  },
};
</script>

<style lang="sass">
.current_quiz_related
  position: relative
  background-color: #fff
  padding: 50px
  margin-bottom: 60px
  @include s
    padding-top: 30px
  @include xxs
    padding: 16px
    padding-bottom: 30px

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

.course_card_lesson_wrapper
  // margin: 0 80px 100px 0px
  // max-width: 375px

.swiper-container
  padding-top: 10px

.swiper-slide
  .course_card_lesson_wrapper
    margin: 0 auto

.similar_courses__slider
  .swiper__quiz_arrow_prev svg,
  .swiper__quiz_arrow_next svg
    max-width: 52px
    max-height: 52px

.similar_courses__slider
  .swiper__quiz_arrow_prev.small svg,
  .swiper__quiz_arrow_next.small svg
    max-width: 52px
    max-height: 100px

.similar_courses__slider
  .swiper__quiz_arrow_prev,
  .swiper__quiz_arrow_next
    display: flex
    align-items: center
    position: absolute
    top: 50%
    transform: translateY(-70%)
    z-index: 9
    width: 52px
    height: 52px

    @media screen and (max-width: 600px)
      border-radius: 50%

      .svg-icon
        fill: var(--color-white)

  .swiper__quiz_arrow_prev
    right: auto
    left: -26px

    @media screen and (max-width: 600px)
      justify-content: flex-end

    @media screen and (max-width: 400px)
      left: -18px

  .swiper__quiz_arrow_next
    right: -26px
    @media screen and (max-width: 440px)
      right: -10px

.swiper_slide
  display: flex

.similar_courses__head
  text-align: center
  @include adaptive-font-size(36, 24, 24)
  @include adaptive-line-height(48, 32, 30)
  margin-bottom: 16px
  @include s
    text-align: left
    padding-top: 20px
  @include xxs
    padding-top: 30px
    text-align: center

.similar_courses__sub_head
  font-size: 20px
  text-align: center
  font-weight: normal
  margin-bottom: 40px
  @include s
    text-align: left
  @include xxs
    text-align: center

.current_quiz_related_wrapper .container
  @include s
    margin: 0 !important
    padding: 0 !important
</style>
