<template>
  <div
    class="card_lesson_background"
    :class="cardsData.course_button"
    height="440"
    @click="goToCoursePage(cardsData.id, cardsData.title)"
  >
    <div class="card_lesson_wrapper" :class="cardsData.course_button">
      <div class="card_lesson__img">
        <div
          class="card_lesson__major business"
          :style="{
            'background-color': cardsData.category.color_hex
              ? cardsData.category.color_hex
              : '#F3F2FF',
          }"
        >
          {{ cardsData.category.title }}
        </div>
        <img :src="cardsData.poster" alt="" />
        <div
          v-if="cardsData.user_data.current_progress_percent"
          class="card_rest_time"
        >
          <vue-ellipse-progress
            :progress="cardsData.user_data.current_progress_percent"
            :color="`${MAIN_COLORS[getCoursesMode].text}`"
            :empty-color="`${MAIN_COLORS[getCoursesMode].text}`"
            line="butt"
            line-mode="in 2"
            :size="15"
            :thickness="4.5"
            :legend="false"
          />
          <!-- <svg-icon name="icon_rest_time" /> -->
          {{ $t('courses.progress') }}
          {{ cardsData.user_data.current_progress_percent }} %
        </div>
      </div>
      <div class="card_lesson__info">
        <Heading level="5" class="">{{ cardsData.title }}</Heading>
        <div class="card_lesson__author">{{ cardsData.author.full_name }}</div>

        <div class="card_stars_time_wrapper">
          <div class="card_lesson__stars">
            <star-rating
              :rating="+cardsData.avg_rating"
              :read-only="true"
              :star-size="16"
              text-class="card_custom_star_text"
              :fixed-points="1"
              show-rating
              inactive-color="#FFEBD4"
              active-color="#FF9B26"
              :increment="0.1"
            />
            <span>({{ cardsData.reviews_count }})</span>
          </div>
          <div class="card_lesson__timing">
            <svg-icon name="icon_time_clock" />
            <span>{{ calculateTime(cardsData.duration_minutes) }}</span>
          </div>
        </div>

        <div class="card_info">
          <CoursePricingStatus
            :course-price="cardsData.price"
            :course-btn="cardsData.course_button"
            :can-be-purchased="
              cardsData.pricing_type !== 'free' &&
              !cardsData.user_data.has_subscription_for_this_course
            "
            :has-subscription-for-course="
              cardsData.user_data.has_subscription_for_this_course
            "
            :is-purchased="cardsData.user_data.is_purchased"
            :is-course-started="cardsData.user_data.is_course_started"
          />
          <ButtonBase
            size="small"
            color="orange"
            :status-config="cardsData.course_button"
            icon-name="card_arrow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import StarRating from 'vue-star-rating';
import CoursePricingStatus from '@/components/Courses/CoursePricingStatus.vue';
import { onlyHoursAndMinutes, calcTimeHHMMSS } from '@/helpers/time';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

export default {
  components: { Heading, ButtonBase, StarRating, CoursePricingStatus },
  props: {
    cardsData: {
      type: Object,
      default: () => {},
    },
    windowWidth: {
      type: Number,
      default: 711,
    },
  },

  data() {
    return {
      MAIN_COLORS,
      studentSubscriptionCheck: [],
    };
  },

  computed: {
    ...mapGetters(['getCoursesMode', 'getStudentsSubscribes']),
  },

  methods: {
    goToCoursePage(id, title) {
      this.$router.push({
        name: 'current-course',
        params: { course_id: id, title: title },
      });
      this.$emit('fetchOnAllCoursePage', true);
    },

    calculateTime(time) {
      return onlyHoursAndMinutes(time);
    },
  },
};
</script>
<style lang="sass">
.card_lesson_background
  background: var(--color-main)
  width: 100%
  cursor: pointer
  @include s
    max-width: 335px
  @media screen and (max-width: 650px)
    justify-self: center
  @media screen and (max-width: 450px)
    width: 100%
    max-width: 100%

.card_lesson_background:nth-child(odd)
  @include s
    justify-self: end
  @include xs
    justify-self: center

.card_lesson_background.open_lesson
  background: var(--primary-font-color)

.card_lesson_background.is_subscribe
  background: #015DFF

.card_lesson_background.buy
  background: var(--btn-color-blue-dark)
.card_lesson_wrapper
  transition: var(--transition-speed)
  background-color: var(--color-white)
  // cursor: pointer
.card_lesson_background.open_my_lesson
  background: #015DFF
.card_lesson_wrapper:hover
  outline: 1px solid var(--color-main)
  transform: translate(8px, -8px)

.news_slide .card_lesson_wrapper:hover
  outline: none

.card_lesson_background--touch_device:hover .card_lesson_wrapper
  transform: translate(0px, 0px)

.card_lesson_wrapper:hover.open_lesson
  outline: 1px solid var(--primary-font-color)

.card_lesson_wrapper:hover.buy
  outline: 1px solid var(--btn-color-blue-dark)

.card_lesson_wrapper:hover.is_subscribe
  outline: 1px solid #015DFF

.card_lesson__img
  // max-height: 200px
  position: relative

.card_lesson__img img
  width: 100%
  height: 200px
  object-fit: cover

.card_lesson__info
  padding: 16px 24px 24px
  border: 1px solid #D8D8D8
  border-top: none
  margin-top: -3px
  @media screen and (max-width: 1150px)
    padding: 16px 20px 20px
.card_lesson_wrapper.buy:hover
  outline: 1px solid var(--btn-color-blue-dark)
.card_lesson__info .title.title--5
  padding-top: 0px
  min-height: 64px
  @media screen and (max-width: 1150px)
    font-size: 18px

  @include xxs
    font-size: 16px

.card_lesson__author
  margin-bottom: 11px
  color: var(--color-font-light-dark)
  @media screen and (max-width: 1150px)
    font-size: 14px

  @include xxs
    font-size: 12px

.card_lesson__major
  position: absolute
  right: 16px
  top: 16px
  padding: 6px 10px
  @media screen and (max-width: 1150px)
    font-size: 12px

.card_lesson__major.business
  color: var(--primary-font-color)
  background-color: var(--color-business-bgc)

.card_lesson__timing
  display: flex
  align-items: center
  gap: 6px
  color: var(--color-font-light-dark)
  @media screen and (max-width: 1150px)
    font-size: 12px

.card_lesson__timing svg
  max-width: 16px

.card_lesson__timing span
  color: var(--color-font-light-dark)

.card_lesson__stars
  display: flex
  align-items: center
  font-size: 14px
  color: var(--color-font-light-dark)
  gap: 4px
  margin-left: 25px

.vue-star-rating
  position: relative

.card_custom_star_text
  position: absolute
  left: -32px
  top: 0
  font-size: 16px
  font-weight: bold
  color: #FF9B26

.card_stars_time_wrapper
  display: flex
  justify-content: space-between
  padding-bottom: 17px
  margin-bottom: 16px
  border-bottom: 1px solid var(--color-border-bottom-stars)

.card_rest_time
  position: absolute
  right: 16px
  bottom: 16px
  background-color: var(--color-white)
  padding: 8px 10px
  display: flex
  align-items: center
  gap: 9px
  font-size: 14px

.card_rest_time svg
  max-width: 15px

.card_lesson__info .card_info
  display: flex
  justify-content: space-between
  align-items: center
  div.button_wrapper.small
    width: 48px

// .card_info .primary-btn--small
//   @media screen and (max-width: 1150px)
//     width: 43px
//     height: 43px

.card_price
  font-size: 24px
  font-weight: bold
  color: var(--color-main)
  @media screen and (max-width: 1150px)
    font-size: 22px

  @include xxs
    font-size: 18px

.card_price__purchased
  color: var(--primary-font-color)
  @include xxs
    font-size: 18px

.card_price__premium
  color: var(--btn-color-blue-dark)
</style>
