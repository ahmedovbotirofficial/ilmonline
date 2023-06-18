<template>
  <div class="video_info">
    <!-- {{ getCurrentCourseData }} -->
    <div class="video_info__row">
      <Heading level="4" class="video_info__title">{{
        currentChapterTitle
      }}</Heading>
      <div
        class="video_info__star"
        :class="{ disabled: getCurrentCourseData.is_student_commented }"
        @click="openModalRateIt"
      >
        <svg-icon name="video_star" />
        {{ $t('buttons.rate_it') }}
      </div>
      <div class="video_info__author">
        <div
          v-if="!!getCurrentCourseData.author.profile_photo"
          class="author_img"
        >
          <img :src="getCurrentCourseData.author.profile_photo" />
        </div>
        <div class="author_info">
          <div class="author_info__name">
            {{ getCurrentCourseData.author.full_name }}
          </div>
          <div class="author_info__date">
            Опубликовано
            {{ normalizeStartDate(getCurrentCourseData.created_at) }}
          </div>
        </div>
      </div>
      <div v-if="getMyProgressOfCourse" class="video_info__progress">
        <vue-ellipse-progress
          :progress="+getMyProgressOfCourse.grade"
          :color="MAIN_COLORS[getCoursesMode].text"
          :empty-color="MAIN_COLORS[getCoursesMode].text"
          line="butt"
          line-mode="in 3"
          :size="20"
          :thickness="6.3"
          :legend="false"
        />
        {{ $t('courses.progress') }}
        {{ getMyProgressOfCourse.grade }}%
      </div>
    </div>

    <div class="video_description">
      <Heading level="4" class="description__title">
        {{ currentTitleOfVideo }}
      </Heading>

      <div class="video_description__info">
        {{ currentLessonDescription }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';
import { COURSES_MODES } from '@/types/constants';

export default {
  props: {
    currentChapterTitle: {
      type: String,
      default: '',
    },
    currentTitleOfVideo: {
      type: String,
      default: '',
    },
    currentLessonDescription: {
      type: String,
      default: '',
    },
    lessonDuration: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      MAIN_COLORS,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCurrentCourseData',
      'getMyProgressOfCourse',
    ]),

    profilePhoto() {
      return !!this.getCurrentCourseData.author.profile_photo
        ? this.getCurrentCourseData.author.profile_photo
        : this.getCoursesMode === COURSES_MODES.SCHOOL
        ? this.getCurrentCourseData.author.non_avatars.standard
        : this.getCurrentCourseData.author.non_avatars.pro;
    },
  },
  methods: {
    openModalRateIt() {
      if (!this.getCurrentCourseData.is_student_commented) {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `rate`,
          props: this.getCurrentCourseData.title,
        });
      }
    },
    normalizeStartDate(date) {
      return moment(date, 'YYYY-MM-DD').locale('ru').format('ll');
    },
  },
};
</script>

<style lang="sass" scoped>
.video_info
  display: flex
  flex-direction: column
  padding-top: 32px
  margin-bottom: 100px
  @include s
    padding: 32px 40px
    margin-bottom: 20px
  @include xs
    padding: 32px 16px

  @include xxs
    padding-top: 26px

.video_info__row
  display: grid
  grid-template-columns: 2fr 1fr

  @include xs
    grid-template-columns: 1fr 1fr

.video_info__row
  padding-bottom: 24px
  margin-bottom: 24px
  border-bottom: 1px solid var(--border-color)
  margin-right: 28px

.video_info__row .video_info__title
  @include adaptive-font-size(28, 28, 24)
  @include adaptive-line-height(35, 35, 30)

  @include s
    display: none

.video_info__star
  cursor: pointer
  font-weight: bold
  margin-bottom: 24px

  @include xs
    grid-column: 2/3
    margin-bottom: 0
.video_info__star.disabled
  opacity: 0.4
.video_info__author
  display: flex
  align-items: center
  gap: 16px

  @include s
    grid-row: 1/-1

  @include xs
    grid-row: 1/2
    grid-column: 1/-1
    margin-bottom: 26px

.author_img
  border-radius: 50%
  overflow: hidden
  flex: 0 0 54px
  height: 54px

  @include xxs
    flex: 0 0 40px
    height: 40px

.author_img img
  width: 100%
  height: 100%
  object-fit: cover

.video_info__star,
.video_info__progress
  display: flex
  grid-gap: 10px
  align-items: center
  justify-content: flex-end
  font-size: 16px
  line-height: 20px

.video_info__progress
  @include s
    grid-column: 2/3

  @include xs
    grid-column: 1/2
    grid-row: 2/3
    justify-content: flex-start

.video_info__progress svg
  max-width: 20px

.video_description .title
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 24)
  margin-bottom: 12px

.video_description__info
  @include adaptive-font-size(18, 18, 16)
  @include adaptive-line-height(26, 26, 23)
  width: 68%

  @include s
    width: 100%
</style>
