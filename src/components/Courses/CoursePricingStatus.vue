<template>
  <h5 class="about-lesson__card_text status" :class="statusColor">
    {{ statusText }}
  </h5>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    coursePrice: {
      type: String,
      default: '',
    },
    courseBtn: {
      type: String,
      default: '',
    },
    canBePurchased: {
      type: Boolean,
      default: true,
    },
    hasSubscriptionForCourse: {
      type: Boolean,
      default: false,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    isFreeCourse: {
      type: Boolean,
      default: false,
    },
    isCourseStarted: {
      type: Boolean,
      default: false,
    },
    curCourse: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(['getUserRole']),
    statusColor() {
      if (this.hasSubscriptionForCourse || this.isPurchased) {
        return 'grey';
      } else if (!this.canBePurchased) {
        return 'orange';
      } else if (!this.hasSubscriptionForCourse && this.isCourseStarted) {
        if (this.courseBtn === 'buy') {
          return 'blue';
        } else if (this.courseBtn === 'open_lesson') {
          return 'grey';
        }
      } else if (this.canBePurchased) {
        return 'blue';
      }
      return '';
    },
    statusText() {
      if (
        !this.hasSubscriptionForCourse &&
        this.isCourseStarted &&
        !this.isPurchased
      ) {
        if (this.courseBtn === 'buy') {
          return `${this.coursePrice} UZS`;
        } else if (this.courseBtn === 'open_lesson') {
          return this.$t('courses.course_purchased');
        }
      } else if (this.hasSubscriptionForCourse || this.isPurchased) {
        return this.$t('courses.course_purchased');
      } else if (!this.canBePurchased) {
        return this.$t('courses.course_free');
      } else if (
        this.canBePurchased ||
        (this.canBePurchased &&
          !this.hasSubscriptionForCourse &&
          this.courseBtn === 'buy')
      ) {
        return `${this.coursePrice} UZS`;
      }
      return '';
    },
  },
};
</script>

<style lang="sass" scoped>
.about-lesson__card_text.status
  font-size: 24px
  font-weight: 600
  line-height: 30px
  opacity: 1

  @include xxs
    font-size: 20px
    line-height: 22px

.about-lesson__card_text.status.orange
  color: var(--color-main)

.about-lesson__card_text.status.grey
  color: var(--primary-font-color)

.about-lesson__card_text.status.blue
  color: var(--btn-color-blue-dark)
</style>
