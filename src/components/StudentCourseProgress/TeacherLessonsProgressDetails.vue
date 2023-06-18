<template>
  <div class="video_page">
    <div
      v-if="!!getLessonProgress && !!getCourseProgressData"
      class="video_page__container"
    >
      <div class="video_page__left">
        <div class="video_info__top">
          <div class="container">
            <div class="video_info__top_inner">
              <Heading level="4" class="video_info__title">{{
                courseTitle
              }}</Heading>
              <ButtonBase
                color="orange"
                size="m"
                @click.native.stop="toggleVideoList"
              >
                {{ $t('buttons.lesson_watching') }}
              </ButtonBase>
            </div>
          </div>
        </div>
        <VideoPlayer
          :src="src"
          :lesson-id="startLessonId"
          :lesson-duration="lessonDuration"
          :lesson-current-time-video="lessonCurrentTimeVideo"
          :is-teacher="true"
        />

        <TeacherVideoCourseInfo
          :current-chapter-title="courseTitle"
          :current-title-of-video="titleOfVideo"
          :current-lesson-description="lessonDescription"
          :lesson-duration="lessonDuration"
        />
      </div>
      <LessonMaterials
        :is-opened-video-list="isOpenedVideoList"
        @update-cart="valueDetect"
        @selected-titles="playSelectedLessonVideo"
        @toogle-video-list="toggleVideoList"
      />
    </div>
    <div v-else class="loader_page">
      <Loader color="orange" />
    </div>
  </div>
</template>
<script>
import VideoPlayer from '@/components/Video/VideoPlayer.vue';
import TeacherVideoCourseInfo from './TeacherVideoCourseInfo.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase';
import moment from 'moment';
import { getFromLS } from '@/library/helpers';
import Loader from '@/elements/Loader/Loader.vue';
import LessonMaterials from './LessonMaterials.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Loader,
    LessonMaterials,
    ButtonBase,
    VideoPlayer,
    TeacherVideoCourseInfo,
  },

  data() {
    return {
      userToken: null,
      currentTitleOfVideo: null,
      isOpenedVideoList: false,
      currentChapterTitle: null,
      currentLessonDescription: null,
      startLessonId: null,
      lessonDuration: null,
      firstIdLesson: null,
      lessonCurrentTimeVideo: 0,
      src: process.env.VUE_APP_API_HOST + '/api/profile/pro-courses/lesson/',
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesModeDispatch',
      'getLessonProgress',
      'getCourseProgressData',
    ]),
    courseTitle() {
      return (
        this.currentChapterTitle || this.getCourseProgressData.course_title
      );
    },
    lessonDescription() {
      return (
        this.currentLessonDescription ||
        this.getCourseProgressData.lessonProgress[0].lesson_description
      );
    },
    titleOfVideo() {
      return (
        this.currentTitleOfVideo ||
        this.getCourseProgressData.lessonProgress[0].lesson_title
      );
    },
  },

  ///progress api/profile/teacher/my-students/student/1/lesson/124/progress

  mounted() {
    this.fetchVideo(this.$route.params.lesson_id);
    this.fetchStudentsCourseProgress();
    this.fetchLessonProgress();
  },
  methods: {
    async valueDetect(value) {
      await this.$router.replace({
        name: 'teacher-lesson-detail',
        params: { lesson_id: value },
      });
      // await this.fetchLessonProgress();
      await this.fetchVideo(this.$route.params.lesson_id);
    },
    async fetchLessonProgress() {
      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}LessonProgressData`,
        {
          lesson_id: this.$route.params.lesson_id,
          student_id: this.$route.params.student_id,
        }
      );
    },
    async fetchStudentsCourseProgress() {
      await this.$store.dispatch(
        `getStudents${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_progress_id
      );
      // console.log(this.getLessonProgress);
      this.lessonCurrentTimeVideo = this.getLessonProgress.lessonProgress?.find(
        (el) => el.lesson_id === +this.$route.params.lesson_id
      );
      !!this.lessonCurrentTimeVideo
        ? (this.lessonCurrentTimeVideo =
            this.lessonCurrentTimeVideo.video_minute_stop)
        : (this.lessonCurrentTimeVideo = 0);
    },

    fetchVideo(id) {
      this.userToken = getFromLS('token');
      this.src =
        process.env.VUE_APP_API_HOST +
        '/api/profile/pro-courses/lesson/' +
        `${id}/video?token=${this.userToken}`;
    },

    playSelectedLessonVideo(value) {
      this.currentChapterTitle = value.titleOfChapter;
      this.currentTitleOfVideo = value.titleOfLesson;
      this.currentLessonDescription = value.lessonDescription;
      this.lessonDuration = value.lessonDuration;
      this.startLessonId = value.id;
      // console.log('>>> play video link', value.id);
    },

    toggleVideoList(value) {
      this.isOpenedVideoList = !this.isOpenedVideoList;
    },
  },
};
</script>

<style lang="sass">
.vjs-big-play-button
  top: 50% !important
  left: 50% !important
  transform: translate(-50%, -50%)

.video_page__left
  display: flex
  flex-direction: column
  width: 100%

.video_page__container
  display: flex
  max-width: 1440px
  // padding-right: 80px
  padding-left: 80px
  margin-right: auto
  margin-left: auto
  @include s
    padding-left: 0
    flex-wrap: wrap
    margin-bottom: 28px

.video_info__top
  padding: 32px 0
  display: none
  @include s
    display: block

  @include xxs
    padding: 24px 0

.video_info__top_inner
  display: flex
  justify-content: space-between
  align-items: center
  gap: 30px
  @include xs
    flex-direction: column
    gap: 24px

.video_info__top .title
  margin-bottom: 0
  text-align: left
  @include adaptive-font-size(28, 28, 24)
  @include adaptive-line-height(35, 35, 30)
  @include xxs
    width: 100%

.video_info__top .primary-btn
  flex: 0 0 215px
  @include xxs
    flex: 0 0 auto

.bad_test_text
  width: 100%
  font-size: 12px
  color: var(--color-main)

.icon-icon_arrow_back
  width: 8px
  height: 12px

.vjs-big-play-button
  top: 50% !important
  left: 50% !important
  transform: translate(-50%, -50%)

.video_page__left
  display: flex
  flex-direction: column
  width: 100%

.subitem__lesson,
.subitem__test
  padding: 15px 16px 15px 24px
  border-bottom: 1px solid #ECECEC

.subitem__lesson.not_access,
.subitem__test.not_access
  opacity: 0.5

.subitem__lesson:hover,
.subitem__test:hover
  cursor: pointer
  background-color: #FDF6F4

.subitem__lesson.not_access:hover,
.subitem__test.not_access:hover
  opacity: 0.5

.subitem__lesson.selected
  background-color: #FDF6F4

.subitem__title
  display: flex
  align-items: center
  gap: 10px
  font-weight: bold
  width: 100%

.subitem__title svg
  max-width: 15px

.subitem__duration
  font-size: 12px
  padding-top: 5px

.bad_test_text
  width: 100%
  font-size: 12px
  color: var(--color-main)

.icon-icon_arrow_back
  width: 8px
  height: 12px
</style>
