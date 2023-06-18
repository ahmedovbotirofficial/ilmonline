<template>
  <ButtonBase
    v-if="courseBtn"
    :color="buttonColor"
    size="popular"
    type="submit"
    class="current_lesson__btn"
    @click.native="clickHandler"
  >
    <span>{{ buttonText }}</span>
  </ButtonBase>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: { ButtonBase },
  props: {
    courseId: {
      type: Number,
      required: true,
    },
    courseBtn: {
      type: String,
      default: '',
    },
    lessonCurrentTimeVideo: {
      type: Number,
      default: 0,
    },
    coursePrice: {
      type: String,
      default: '',
    },
    canBePurchased: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasSubscriptionForCourse: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCourseStarted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPurchased: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'getUserRole',
      'getCardsList',
      'getCoursesMode',
      'isAuthUser',
      'getBalance',
      'getLastWatchedLessonId',
    ]),
    buttonColor() {
      if (this.courseBtn === 'open_lesson') {
        return 'orange';
      } else if (
        !this.hasSubscriptionForCourse &&
        this.isCourseStarted &&
        !this.isPurchased
      ) {
        return 'blue';
      } else if (this.isPurchased || this.hasSubscriptionForCourse) {
        return 'orange';
      } else if (!this.canBePurchased) {
        return 'orange';
      } else if (this.canBePurchased) {
        return 'blue';
      }
      return '';
    },
    buttonText() {
      if (
        !this.hasSubscriptionForCourse &&
        this.isCourseStarted &&
        !this.isPurchased &&
        this.courseBtn === 'buy'
      ) {
        return this.$t('buttons.buy');
      } else if (
        (this.isPurchased && this.isCourseStarted) ||
        (this.hasSubscriptionForCourse && this.isCourseStarted)
      ) {
        return this.$t('buttons.go_to_lesson');
      } else if (
        (this.isPurchased && !this.isCourseStarted) ||
        (this.hasSubscriptionForCourse && !this.isCourseStarted) ||
        !this.canBePurchased
      ) {
        return this.$t('buttons.start');
      } else if (this.canBePurchased && this.courseBtn === 'buy') {
        return this.$t('buttons.buy');
      } else if (this.courseBtn === 'open_lesson') {
        return this.$t('buttons.go_to_lesson');
      } else return '';
    },
  },

  async mounted() {
    // await this.$store.dispatch('getCardsList');
  },

  methods: {
    clickHandler() {
      if (!this.isAuthUser) {
        this.$router.push({ name: 'sign' });
      } else if (
        !this.hasSubscriptionForCourse &&
        this.isCourseStarted &&
        !this.isPurchased &&
        this.courseBtn === 'buy'
      ) {
        this.purchaseCourse();
      } else {
        if (!this.canBePurchased || this.courseBtn === 'open_lesson') {
          this.goToWatchingCourse();
          return;
        }
        !this.hasSubscriptionForCourse &&
        !this.isPurchased &&
        !this.isCourseStarted
          ? this.purchaseCourse()
          : this.goToWatchingCourse();
      }
    },
    async goToWatchingCourse() {
      if (!this.isCourseStarted) {
        await this.startCourse();
      }
      this.$router
        .push({
          name: `${this.getUserRole}-video`,
          params: {
            course_id: this.courseId,
            lesson_id: this.getLastWatchedLessonId,
          },
        })
        .catch(() => {});
    },

    async startCourse() {
      if (!this.isCourseStarted) {
        this.getCoursesMode === COURSES_MODES.SCHOOL
          ? await this.$store.dispatch('startCourse', {
              course_id: this.courseId,
            })
          : await this.$store.dispatch('startProCourse', {
              course_id: this.courseId,
            });
      }
    },
    async purchaseCourse() {
      if (this.isAuthUser) {
        await this.$store.dispatch('getBalanceData');
        await this.$store.dispatch('getCardsList');
      }
      let index = this.getBalance.indexOf(' ');
      let balanceDigit = parseInt(
        this.getBalance.slice(0, index).replaceAll(',', '')
      );
      // console.log(balanceDigit);
      // console.log(parseFloat(this.coursePrice));
      // console.log(balanceDigit > parseFloat(this.coursePrice));
      if (
        this.getCardsList.length ||
        balanceDigit > parseFloat(this.coursePrice)
      ) {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `accept-purchase`,
          props: {
            courseId: this.courseId,
            coursePrice: this.coursePrice,
          },
        });
      } else {
        this.$router.push({
          name: 'payment',
        });
      }
    },
  },
};
</script>

<style scoped></style>
