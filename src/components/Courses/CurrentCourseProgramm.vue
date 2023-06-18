<template>
  <div>
    <div class="info_bock__item">
      <svg-icon name="player" />
      <div class="program_lesson__info-block">
        <h3 class="program_lesson__text info_title">
          {{ info.lesson.title }}
        </h3>
        <div class="program_lesson__info-block_time">
          {{ calculateTime(info.lesson.duration_minutes) }}
        </div>
      </div>
    </div>
    <div class="info_bock__item">
      <div class="program_lesson__info-block">
        <h3 class="program_lesson__text info_title">
          {{ $t('courses.test') }}
        </h3>
        <div class="program_lesson__info-block_time">
          {{ info.test.questions_count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { calcTimeHHMMSS, onlyHoursAndMinutes } from '@/helpers/time';

export default {
  title: 'Change direction',

  data() {
    return {
      openItem: [],
    };
  },

  computed: {
    ...mapGetters(['getCurrentCourseData']),
  },

  watch: {},

  async created() {},
  methods: {
    toggleItem(id) {
      if (this.openItem.includes(id)) {
        this.openItem = this.openItem.filter((item) => item !== id);
      } else {
        this.openItem.push(id);
      }
    },

    calculateTime(time) {
      return calcTimeHHMMSS(time);
    },
  },
};
</script>

<style lang="sass" scoped>
.program_lesson__info-block
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  cursor: pointer

.program_lesson__info-block_time
  font-size: 12px
  line-height: 15px

  @include xxs
    display: none

.program_lesson__info-block.opened + .program_lesson__text + .program_lesson__block
  margin-bottom: 16px

.info_bock__item
  display: flex
  align-items: center
  margin-bottom: 8px

.info_bock__item svg
  max-width: 15px
  max-height: 15px
</style>
