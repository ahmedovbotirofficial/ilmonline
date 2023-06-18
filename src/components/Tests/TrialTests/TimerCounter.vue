<template>
  <div class="timer_items">
    <div class="timer_item">{{ displayHours }}</div>
    <div class="timer_dots">
      <span class="dot"></span><span class="dot"></span>
    </div>
    <div class="timer_item">{{ displayMinutes }}</div>
    <div class="timer_dots">
      <span class="dot"></span><span class="dot"></span>
    </div>
    <div class="timer_item">{{ displaySeconds }}</div>
  </div>
</template>

<script>
import moment, { duration } from 'moment';
import { mapGetters } from 'vuex';
import { getFromLS, setToLS } from '../../../library/helpers';

export default {
  props: {
    direction: {
      type: String,
      default: 'down',
    },
    createdAt: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    ended: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displayHours: 0,
      displayMinutes: 0,
      displaySeconds: 0,

      timer: null,
    };
  },
  computed: {
    ...mapGetters([]),

    createdTime() {
      return +this.transformDate(this.createdAt);
    },
  },

  mounted() {
    this.showRemaining();
  },

  methods: {
    formatNum(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    showRemaining() {
      this.timer = setInterval(() => {
        const now = Math.round(Date.now() / 1000);
        let end = 0;
        let distance = 0;
        if (this.duration) {
          // end = this.createdTime + 20;
          end = this.createdTime + this.duration;
          distance = end - now;
        } else {
          distance = now - this.createdTime;
        }

        if (this.ended || distance < 0) {
          this.$store.commit('SET_TRIAL_TIMER_STATUS', true);
          clearInterval(this.timer);
        }

        if (distance < 60) {
          this.displaySeconds = this.formatNum(distance);
        }
        if (distance >= 60 && distance < 3600) {
          this.displayHours = this.formatNum(0);
          this.displayMinutes = this.formatNum(Math.floor(distance / 60));
          this.displaySeconds = this.formatNum(
            distance - this.displayMinutes * 60
          );
        } else {
          this.displaySeconds = this.formatNum(
            Math.floor((distance % 3600) % 60)
          );
          this.displayMinutes = this.formatNum(
            Math.floor((distance % 3600) / 60)
          );
          this.displayHours = this.formatNum(Math.floor(distance / 3600));
        }
        // console.log('now >>>', now, 'end >>>', end);
      }, 1000);
    },

    clearInterval() {
      clearInterval(this.timer);
    },

    transformDate(date) {
      return moment(date).format('X');
    },
  },
};
</script>

<style lang="sass" scoped>
.timer_items
  display: flex
  align-items: center
  gap: 14px

.timer_item
  display: flex
  justify-content: center
  align-items: center
  font-size: 36px
  font-weight: bold
  height: 72px
  width: 72px
  color: var(--color-white)
  background-color: var(--color-main)

.timer_dots
  display: flex
  flex-direction: column
  gap: 9px

.timer_dots .dot
  height: 4px
  width: 4px
  background-color: var(--color-main)
</style>
