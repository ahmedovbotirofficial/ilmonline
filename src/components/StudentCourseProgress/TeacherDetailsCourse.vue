<template>
  <div class="video_page">
    <div v-if="!!getCurrentCourseData" class="video_page__container">
      <div class="video_page__left">
        <div class="video_info__top">
          <div class="container">
            <div class="video_info__top_inner">
              <Heading level="4" class="video_info__title">{{
                currentChapterTitle
              }}</Heading>
              <ButtonBase
                color="orange"
                size="popular"
                @click.native.stop="toggleVideoList"
              >
                {{ $t('buttons.lesson_content') }}
              </ButtonBase>
            </div>
          </div>
        </div>

        <VideoPlayer
          :src="src"
          :lesson-id="startLessonId"
          :lesson-duration="lessonDuration"
          :lesson-current-time-video="lessonCurrentTimeVideo"
        />

        <VideoCourseInfoTeacher
          :current-chapter-title="currentChapterTitle"
          :current-title-of-video="currentTitleOfVideo"
          :current-lesson-description="currentLessonDescription"
          :lesson-duration="lessonDuration"
        />
      </div>

      <!-- video_page__right_part START-->
      <div
        class="video_list__overlay"
        :class="{
          opened: isOpenedVideoList,
        }"
      >
        <div
          class="video_list"
          :class="{
            active: isOpenedVideoList,
          }"
        >
          <div class="video_list__top">
            <div class="video_list__title">
              {{ $t('buttons.lesson_content') }}
            </div>
            <div class="video_list__close" @click="toggleVideoList">
              <svg-icon name="filter_cross"></svg-icon>
            </div>
          </div>

          <div
            v-for="(chapter, idx) in getCurrentCourseData.chapters"
            :key="chapter.id"
            class="video_list_item"
            @click="openLessonsVideosList(chapter.id)"
          >
            <div
              class="video_list_item__title"
              :class="{
                active: openedVideoListIds.includes(chapter.id),
              }"
            >
              <span>{{ idx + 1 }}.</span>

              <div style="width: 80%">
                <span>{{ chapter.title }}</span>
              </div>
              <div class="video_list_arrow">
                <svg-icon name="video_list_arrow" />
              </div>
            </div>
            <div class="video_list_item__info">
              <div class="info__item">
                <svg-icon name="video_lesson" />
                {{ chapter.lessons_count }}
                {{ $t('courses.lessons') }}
              </div>
              <div class="info__item">
                <svg-icon name="video_duration" />
                {{ calculateTimeSeconds(chapter.duration_minutes) }}
              </div>
            </div>

            <template v-if="openedVideoListIds.includes(chapter.id)">
              <div
                v-for="(item, index) in chapter[lessonsKeyName]"
                :key="index"
                class="video_list__subitem"
              >
                <div
                  class="subitem__lesson"
                  :class="{
                    selected: startLessonId === item.lesson.id,
                  }"
                  @click.stop="
                    playSelectedLessonVideo(
                      item.lesson.id,
                      chapter.title,
                      item.lesson.description,
                      item.lesson.duration_minutes
                    )
                  "
                >
                  <div class="subitem__title">
                    <svg-icon name="video_play" />
                    {{ item.lesson.title }}
                  </div>
                  <div class="subitem__duration">
                    {{ calculateTimeSeconds(item.lesson.duration_minutes) }}
                  </div>
                </div>
                <div
                  v-if="!!item.test"
                  class="subitem__test"
                  @click.stop="goToCourseTest(item.lesson.id, item.test.id)"
                >
                  <div class="subitem__title">
                    <svg-icon name="video_test" />
                    <span style="width: 65%">Test</span>
                  </div>
                  <div class="subitem__duration">
                    {{ item.test.questions_count }}
                    {{ $t('courses.questions') }}
                  </div>
                </div>
                <div
                  v-if="!!item.task"
                  class="subitem__test"
                  @click.stop="goToIndividualTask(item.lesson.id, item.task.id)"
                >
                  <div class="subitem__title">
                    <svg-icon name="pro_task_start" />
                    <span style="width: 65%"
                      >{{ item.task.title }}
                      <span
                        v-if="item.task.is_required_individual_task"
                        class="required"
                        >*</span
                      ></span
                    >
                  </div>
                  <!-- <div class="subitem__duration">
                    {{ $t('courses.questions') }}
                  </div> -->
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- video_page__right_part END -->
    </div>
    <div v-else class="loader_page">
      <Loader color="orange" />
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/Video/VideoPlayer.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import moment from 'moment';

import { getFromLS, isLSHasItem } from '@/library/helpers';

import { onlyHoursAndMinutes, calcTimeHHMMSS } from '@/helpers/time';
import { mapGetters } from 'vuex';
import VideoCourseInfoTeacher from './VideoCourseInfoTeacher.vue';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    VideoPlayer,
    Heading,
    Loader,
    ButtonBase,
    VideoCourseInfoTeacher,
  },

  data() {
    return {
      src: '',

      userToken: null,
      currentTitleOfVideo: null,
      currentChapterTitle: null,
      currentLessonDescription: null,
      startLessonId: null,
      lessonDuration: null,
      lessonCurrentTimeVideo: null,

      firstIdLesson: null,

      openedVideoListIds: [],

      isOpenedVideoList: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCurrentCourseData',
      'getSelectedLanguage',
      'getUserRole',
      'getCoursesModeDispatch',
      'getLastWatchedLessonId',
      'getCoursesMode',
    ]),
    lessonsKeyName() {
      return this.getCoursesMode === COURSES_MODES.SCHOOL
        ? 'lessons_and_tests'
        : 'lessons_and_tests_and_tasks';
    },
  },

  watch: {
    isOpenedVideoList(value) {
      if (value) {
        document.documentElement.classList.add('overflow_hidden');
      } else {
        document.documentElement.classList.remove('overflow_hidden');
      }
    },
    getSelectedLanguage(value) {
      value && this.fetchCurrentCourseData();
    },
  },

  async created() {
    this.src =
      this.getCoursesMode === 'pro'
        ? `${process.env.VUE_APP_API_HOST}/api/profile/pro-courses/lesson/`
        : `${process.env.VUE_APP_API_HOST}/api/profile/courses/lesson/`;
    await this.fetchCurrentCourseData();

    this.$store.commit('SET_CURR_BREAD_LABEL', {
      current_course_name: this.getCurrentCourseData.title,
      watching_current_course: 'breadCrumbs.watching',
    });
  },

  methods: {
    toggleVideoList() {
      this.isOpenedVideoList = !this.isOpenedVideoList;
    },
    goToIndividualTask(lessonId, taskId, hasAccess) {
      this.isOpenedVideoList = false;
      this.$router.push({
        name: 'teacher-individual-task-details',
        params: {
          course_id: this.$route.params.course_id,
          lesson_id: lessonId,
          individual_task_id: taskId,
        },
      });
    },

    async fetchCurrentCourseData() {
      await this.$store.dispatch(
        `getCurrent${this.getCoursesModeDispatch}CourseData`,
        this.$route.params.course_id
      );

      this.firstIdLesson =
        this.getCurrentCourseData.chapters[0][this.lessonsKeyName][0].lesson.id;
      // console.log('this.getCurrentCourseData >>>', this.getCurrentCourseData);

      this.$route.params.lesson_id
        ? (this.startLessonId = +this.$route.params.lesson_id)
        : (this.startLessonId =
            this.getCurrentCourseData.chapters[0][
              this.lessonsKeyName
            ][0].lesson.id);

      this.fetchVideo(this.startLessonId);

      let currChapter = this.getCurrentCourseData.chapters.filter((chapter) =>
        chapter[this.lessonsKeyName].find(
          (el) => el.lesson.id === this.startLessonId
        )
      );

      this.currentChapterTitle = currChapter[0].title;
      this.openedVideoListIds.push(currChapter[0].id);

      this.currentTitleOfVideo = currChapter[0][this.lessonsKeyName].filter(
        (el) => el.lesson.id === this.startLessonId
      )[0].lesson.title;

      this.currentLessonDescription = currChapter[0][
        this.lessonsKeyName
      ].filter(
        (el) => el.lesson.id === this.startLessonId
      )[0].lesson.description;
    },

    fetchVideo() {
      this.userToken = getFromLS('token');
      this.src =
        this.getCoursesMode === 'pro'
          ? `${process.env.VUE_APP_API_HOST}/api/profile/pro-courses/lesson/${this.getLastWatchedLessonId}/video?token=${this.userToken}`
          : `${process.env.VUE_APP_API_HOST}/api/profile/courses/lesson/${this.getLastWatchedLessonId}/video?token=${this.userToken}`;
    },

    playSelectedLessonVideo(
      id,
      titleOfChapter,
      titleOfLesson,
      lessonDescription
    ) {
      this.fetchVideo(id);
      this.currentChapterTitle = titleOfChapter;
      this.currentTitleOfVideo = titleOfLesson;
      this.currentLessonDescription = lessonDescription;

      this.startLessonId = id;

      this.isOpenedVideoList = false;
    },

    goToCourseTest(lessonId) {
      this.isOpenedVideoList = false;
      this.$router.push({
        name: 'teacher-test-detail-main',
        params: {
          course_id: this.$route.params.course_id,
          lesson_id: lessonId,
        },
      });
    },

    calculateTimeSeconds(time) {
      return calcTimeHHMMSS(time);
    },

    openLessonsVideosList(id) {
      if (this.openedVideoListIds.includes(id)) {
        this.openedVideoListIds = this.openedVideoListIds.filter(
          (el) => el !== id
        );
      } else {
        this.openedVideoListIds.push(id);
      }
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

.video_list__overlay
  display: flex
  flex-direction: column
  width: 100%
  max-width: 30%
  background-color: var(--color-white)
  @include s
    display: none
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    max-width: 100%
    overflow-x: hidden
    overflow-y: auto
    background: rgba(5, 12, 15, 0.4)
    z-index: 999

.video_list
  padding: 20px 16px 0 24px

  @include s
    position: absolute
    top: 0
    right: 0
    width: 100%
    height: max-content
    min-height: 100%
    max-width: 358px
    transform: translateX(100%)
    background: var(--color-white)
    transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1)

  @include xxs
    max-width: 100%

.video_list.active
  transform: translateX(0%)

.video_list__close
  position: absolute
  left: -72px
  top: 24px
  height: 48px
  width: 48px
  background-color: var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  @include xxs
    position: static
    top: 0
    left: 0
    width: auto
    height: auto

  .icon-filter_cross
    width: 20px
    height: 20px

    @include xxs
      width: 16px
      height: 16px

.video_list__overlay.opened
  @include s
    display: block

.video_info
  display: flex
  flex-direction: column
  padding-top: 32px
  margin-bottom: 100px
  @include s
    margin-bottom: 20px

  @include xxs
    padding-top: 26px

.video_info__row
  display: flex
  flex-wrap: wrap
  grid-template-columns: 2fr 1fr

  @include xs
    grid-template-columns: 1fr 1fr

.video_info__row
  padding-bottom: 24px
  margin-bottom: 24px
  border-bottom: 1px solid var(--border-color)
  margin-right: 28px

.video_info__row .video_info__title
  width: 100%
  @include adaptive-font-size(28, 28, 24)
  @include adaptive-line-height(35, 35, 30)

  @include s
    display: none

.video_list__top
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0 0 16px 24px
  border-bottom: 1px solid var(--border-color)
  margin: 0 -16px 0 -24px
  @include xxs
    padding: 0 16px 16px 24px

.video_list__title
  font-size: 20px
  font-weight: bold

.video_list_item
  display: flex
  flex-direction: column
  gap: 8px
  padding: 24px 0 0 0
  cursor: pointer

.video_list_item__title
  display: flex
  // justify-content: space-between
  font-size: 18px
  font-weight: bold

.video_list_item__title span
  max-width: 240px

.video_list_item__title svg
  max-width: 15px
  transition: var(--transition-speed)

.video_list_item__title.active svg
  transform: rotate(180deg)

.video_list_item__title.finished
  color: #ccc

.video_list_arrow
  display: flex
  justify-content: flex-end
  width: 20%

.video_list_item__info
  display: flex
  gap: 12px
  padding: 0 0 24px 40px
  margin: 0 -16px 0 -24px
  border-bottom: 1px solid var(--border-color)

.video_list_item:last-child .video_list_item__info
  @include s
    border: none

.info__item
  display: flex
  align-items: center
  gap: 5px
  font-size: 14px

.info__item svg
  max-width: 16px

.video_list__subitem
  display: flex
  flex-direction: column
  margin: -8px -16px 0 -24px

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

.subitem__title svg
  max-width: 15px

.subitem__title .required
  color: var(--color-orange)

.subitem__duration
  font-size: 12px
  margin-top: 8px

.bad_test_text
  width: 100%
  font-size: 12px
  color: var(--color-main)

.icon-icon_arrow_back
  width: 8px
  height: 12px
</style>
