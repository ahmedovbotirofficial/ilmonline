<template>
  <div class="video_page">
    <div v-if="!!getMyProgressOfCourse" class="video_page__container">
      <div class="video_page__left">
        <div class="video_info__top">
          <div class="container">
            <div class="video_info__top_inner">
              <Heading level="4" class="video_info__title">{{
                currentChapterTitle
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
          v-if="getLastWatchedLessonId"
          :src="src"
          :lesson-id="getLastWatchedLessonId"
          :lesson-duration="lessonDuration"
          :lesson-current-time-video="lessonCurrentTimeVideo"
        />
        <VideoCourseInfo
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
              {{ $t('buttons.lesson_watching') }}
            </div>
            <div class="video_list__close" @click="toggleVideoList">
              <svg-icon name="filter_cross"></svg-icon>
            </div>
          </div>
          <!-- {{ getCurrentCourseData }} -->

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
                finished: finishedChapter(chapter.id),
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

            <template
              v-if="
                openedVideoListIds.includes(chapter.id) &&
                !!chapter[lessonsKeyName]
              "
            >
              <div
                v-for="(item, index) in chapter[lessonsKeyName]"
                :key="index"
                class="video_list__subitem"
              >
                <div
                  v-if="!!item.lesson"
                  class="subitem__lesson"
                  :class="{
                    selected: getLastWatchedLessonId === item.lesson.id,
                    not_access: !item.lesson.access,
                  }"
                  @click.stop="playSelectedLessonVideo(item, chapter.title)"
                >
                  <div class="subitem__title">
                    <svg-icon
                      v-if="getMyProgressOfCourse"
                      :name="watchedVideo(item.lesson.id)"
                    />
                    {{ item.lesson.title }}
                  </div>
                  <div class="subitem__duration">
                    {{ calculateTimeSeconds(item.lesson.duration_minutes) }}
                  </div>
                </div>

                <div
                  v-if="!!item.test"
                  class="subitem__test"
                  :class="{ not_access: !item.test.access }"
                  @click.stop="
                    goToCourseTest(
                      item.lesson.id,
                      item.test.id,
                      item.test.access
                    )
                  "
                >
                  <div class="subitem__title">
                    <svg-icon
                      v-if="getMyProgressOfCourse"
                      :name="successTest(item.lesson.id)"
                    />
                    <!-- name="video_test"  -->
                    <span style="width: 65%">Test</span>
                    <div class="bad_test_text">
                      {{ badTestText(item.lesson.id) }}
                    </div>
                  </div>
                  <div class="subitem__duration">
                    {{ item.test.questions_count }}
                    {{ $t('courses.questions') }}
                  </div>
                </div>

                <div
                  v-if="!!item.task"
                  class="subitem__test"
                  :class="{ not_access: !item.task.access }"
                  @click.stop="
                    goToIndividualTask(
                      item.lesson.id,
                      item.task.id,
                      item.task.access
                    )
                  "
                >
                  <div class="subitem__title">
                    <svg-icon
                      v-if="getMyProgressOfCourse"
                      :name="stateOfTask(item.lesson.id, item.task.id)[0]"
                    />
                    <span
                      style="width: 65%"
                      :class="stateOfTask(item.lesson.id)[0]"
                      >{{ item.task.title }}
                      <span
                        v-if="item.task.is_required_individual_task"
                        class="required"
                        >*</span
                      >
                    </span>
                  </div>
                  <div
                    class="subitem__duration"
                    :class="stateOfTask(item.lesson.id)[0]"
                  >
                    <span v-if="!!stateOfTask(item.lesson.id)[1]"
                      >{{ stateOfTask(item.lesson.id)[1] }}
                    </span>
                    <span>{{
                      $t(`courses.${stateOfTask(item.lesson.id)[0]}`)
                    }}</span>
                  </div>
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
import VideoCourseInfo from './VideoCourseInfo.vue';

import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';

import { getFromLS, setToLS } from '@/library/helpers';
import { COURSES_MODES } from '@/types/constants';

import { onlyHoursAndMinutes, calcTimeHHMMSS } from '@/helpers/time';
import { mapGetters } from 'vuex';

export default {
  components: {
    VideoPlayer,
    VideoCourseInfo,
    Heading,
    Loader,
    ButtonBase,
  },

  data() {
    return {
      userToken: null,

      currentTitleOfVideo: null,
      currentChapterTitle: null,
      currentLessonDescription: null,
      lessonDuration: null,
      lessonCurrentTimeVideo: null,

      firstIdLesson: null,

      openedVideoListIds: [],
      watchedVideoListIds: [],

      isOpenedVideoList: false,
      src: '',
    };
  },

  computed: {
    ...mapGetters([
      'getMyProgressOfCourse',
      'getCurrentCourseData',
      'getSelectedLanguage',
      'getUserRole',
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getLastWatchedLessonId',
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
    this.getUserToken();
    await this.fetchCurrentCourseData();

    this.$store.commit('SET_CURR_BREAD_LABEL', {
      current_course_name: this.getCurrentCourseData.title,
      watching_current_course: 'breadCrumbs.watching',
    });
  },

  methods: {
    async fetchCourseProgress() {
      await this.$store.dispatch(
        `getMy${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_id
      );

      // console.log('this.getMyProgressOfCourse', this.getMyProgressOfCourse);

      this.lessonCurrentTimeVideo =
        this.getMyProgressOfCourse.lessonProgress?.find(
          (el) => el.lesson_id === +this.$route.params.lesson_id
        );
      !!this.lessonCurrentTimeVideo
        ? (this.lessonCurrentTimeVideo =
            this.lessonCurrentTimeVideo.video_minute_stop)
        : (this.lessonCurrentTimeVideo = 0);

      // console.log('lessoncurr time', this.lessonCurrentTimeVideo, 's');
      // console.log('getMyProgressOfCourse >>>', this.getMyProgressOfCourse);
    },

    async startLesson() {
      await this.$store.dispatch(`start${this.getCoursesModeDispatch}Lesson`, {
        course_id: this.$route.params.course_id,
        lesson_id: this.getLastWatchedLessonId,
      });
    },

    async fetchCurrentCourseData() {
      await this.$store.dispatch(
        `getCurrent${this.getCoursesModeDispatch}CourseData`,
        this.$route.params.course_id
      );

      this.$store.commit(
        'SET_LAST_WATCHED_LESSON',
        +this.$route.params.lesson_id
      );

      let currChapter = this.getCurrentCourseData.chapters.filter((chapter) =>
        chapter[this.lessonsKeyName].find(
          (el) => el.lesson.id === this.getLastWatchedLessonId
        )
      )[0];

      this.openedVideoListIds.push(currChapter.id);

      let currentLesson = currChapter[this.lessonsKeyName].filter(
        (el) => el.lesson.id === this.getLastWatchedLessonId
      )[0];

      // console.log('currLesson <<<<<', currentLesson);
      if (
        this.getCurrentCourseData.user_data.is_purchased ||
        this.getCurrentCourseData.user_data.has_subscription_for_this_course ||
        this.getCurrentCourseData.course_button === 'open_lesson'
      ) {
        this.playSelectedLessonVideo(currentLesson, currChapter.title);
        await this.fetchCourseProgress();
      } else {
        await this.$router.push({
          name: 'current-course',
          params: { id: this.$route.params.course_id },
        });
      }
      // console.log(this.getCurrentCourseData);
    },

    fetchVideo() {
      this.$router
        .push({
          name: `${this.getUserRole}-video`,
          params: { lesson_id: this.getLastWatchedLessonId },
        })
        .catch(() => {});
      this.src =
        this.getCoursesMode === 'pro'
          ? `${process.env.VUE_APP_API_HOST}/api/profile/pro-courses/lesson/${this.getLastWatchedLessonId}/video?token=${this.userToken}`
          : `${process.env.VUE_APP_API_HOST}/api/profile/courses/lesson/${this.getLastWatchedLessonId}/video?token=${this.userToken}`;
    },

    async playSelectedLessonVideo(item, titleOfChapter) {
      // console.log('item <<<<', item.lesson);
      if (item.lesson.access) {
        this.currentChapterTitle = titleOfChapter;
        this.currentTitleOfVideo = item.lesson.title;
        this.currentLessonDescription = item.lesson.description;
        this.lessonDuration = item.lesson.duration_minutes;

        this.isOpenedVideoList = false;

        this.$store.commit('SET_LAST_WATCHED_LESSON', item.lesson.id);

        if (item.lesson.is_started) {
          this.fetchVideo();
        } else {
          await this.startLesson();
          this.fetchVideo();
        }
      } else {
        return;
      }
    },

    ///////////////////////////////////// helpers ->>>>

    goToCourseTest(lessonId, testId, hasAccess) {
      this.isOpenedVideoList = false;
      if (hasAccess) {
        this.$router.push({
          name: 'course-test',
          params: {
            course_id: this.$route.params.course_id,
            lesson_id: lessonId,
            // test_id: testId,
          },
        });
      } else {
        return;
      }
    },

    goToIndividualTask(lessonId, taskId, hasAccess) {
      this.isOpenedVideoList = false;
      if (hasAccess) {
        this.$router.push({
          name: 'student-individual-task',
          params: {
            course_id: this.$route.params.course_id,
            lesson_id: lessonId,
            individual_task_id: taskId,
          },
        });
      } else {
        return;
      }
    },

    toggleVideoList() {
      this.isOpenedVideoList = !this.isOpenedVideoList;
    },

    finishedChapter(id) {
      // console.log(id);
    },

    getUserToken() {
      this.userToken = getFromLS('token');
      // console.log(this.userToken);
    },

    calculateTimeSeconds(time) {
      return calcTimeHHMMSS(time);
    },
    ////////////////////////////// styles functions ->>>>
    watchedVideo(lessonId) {
      if (lessonId) {
        let res = this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (res && res.viewed_video) {
          return 'video_watched';
        } else {
          return 'video_play';
        }
      }
      return 'video_play';
    },

    badTestText(lessonId) {
      // console.log(lessonId);
      if (lessonId) {
        let res = this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        // console.log('lessonProgress >>>>', res);
        if (res && res.test_grade < 70 && res.test_grade >= 0 && res.ended) {
          return 'Не набран проходной бал';
        }
      }
    },

    successTest(lessonId) {
      if (lessonId) {
        let res = this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (res && res.test_grade >= 70) {
          return 'video_watched';
        } else if (
          res &&
          res.test_grade < 70 &&
          res.test_grade >= 0 &&
          res.ended
        ) {
          return 'video_test_bad';
        } else {
          return 'video_test';
        }
      }
      return 'video_test';
    },

    stateOfTask(lessonId) {
      if (!!lessonId) {
        let res = this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (!!res && !!res.taskProgress) {
          if (res.taskProgress.is_ready_for_teacher_viewing) {
            return ['pro_task_teacher_viewing'];
          } else if (
            res.taskProgress.is_read_by_teacher &&
            res.taskProgress.grade >= 1 &&
            res.taskProgress.grade < 70
          ) {
            return ['pro_task_failed', res.taskProgress.grade];
          } else if (res.taskProgress.grade >= 70) {
            return ['pro_task_success', res.taskProgress.grade];
          } else {
            return ['pro_task_start'];
          }
        }
        return ['pro_task_start'];
      } else {
        return ['pro_task_start'];
      }
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
    padding-right: 16px

  .icon-filter_cross
    width: 20px
    height: 20px

    @include xxs
      width: 16px
      height: 16px

.video_list__overlay.opened
  @include s
    display: block

.author_info__date
  @include adaptive-font-size(16, 16, 14)
  @include adaptive-line-height(20, 20, 18)

.author_info__name
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(30, 25, 25)
  font-weight: bold
  padding-bottom: 4px

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
  padding-left: 26px
  font-size: 12px

.pro_task_success
  color: var(--color-main)

.pro_task_failed
  color: #EC5239

.pro_task_start
  color: #12323E

.pro_task_teacher_viewing
  color: #EBB20E

.bad_test_text
  width: 47%
  font-size: 12px
  color: var(--color-orange)

.icon-icon_arrow_back
  width: 8px
  height: 12px
</style>
