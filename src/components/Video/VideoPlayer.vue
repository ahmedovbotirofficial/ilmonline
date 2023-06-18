<template>
  <div id="videoWrapper">
    <!-- disablepictureinpicture -->
    <video
      id="videoPlayer"
      ref="videoPlayer"
      controlsList="nodownload"
      controls
      preload="auto"
      class="video-js"
      :src="src"
      @play="videoPlay($event)"
      @pause="videoPause($event)"
      @progress="videoProgress($event)"
      @canplaythrough="videoCanPlayThrough($event)"
      @timeupdate="videoTimeUpdate($event)"
      @ended="videoEnded($event)"
      @abort="videoAbort($event)"
      @load="videoLoad($event)"
    ></video>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      default: 'https://media.w3.org/2010/05/bunny/movie.mp4',
    },

    lessonId: {
      type: Number,
      default: null,
    },

    lessonDuration: {
      type: Number,
      default: 0,
    },

    lessonCurrentTimeVideo: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      player: null,

      videoDataToBackEnd: {
        lastVideoPoint: null,
        video_id: 2,
      },

      aborted: false,
    };
  },

  computed: {
    ...mapGetters([
      'changeUserVideoData',
      'getUserRole',
      'getCoursesMode',
      'getCoursesModeDispatch',
    ]),
    // updatedVideoOptions() {
    //   return this.getVideoOptions;
    // },
    changedSrc() {
      // console.log(this.src);
      return this.src;
    },
    lessonsKeyName() {
      return this.getCoursesMode === COURSES_MODES.SCHOOL
        ? 'lessons_and_tests'
        : 'lessons_and_tests_and_tasks';
    },
  },

  watch: {
    src(value) {
      if (value) {
        // console.log('new video', value);
        const video = this.$refs.videoPlayer;
        video.setAttribute('src', value);
        video.load();
        this.aborted = false;
      }
    },

    lessonCurrentTimeVideo(value) {
      if (value) {
        const video = this.$refs.videoPlayer;
        video.currentTime = this.lessonCurrentTimeVideo;
      }
    },
  },

  mounted() {
    // const video = this.$refs.videoPlayer;
    // video.currentTime = this.lessonCurrentTimeVideo;
  },

  beforeDestroy() {
    const video = this.$refs.videoPlayer;
    video.setAttribute('src', null);
  },

  methods: {
    videoLoad(event) {
      // console.log(event);
    },

    setTime(event) {
      // console.log(event);
    },
    videoPlay(event) {
      this.aborted = false;
    },
    async videoPause(event) {
      if (this.getUserRole === 'student') {
        await this.$store.dispatch(
          `set${this.getCoursesModeDispatch}VideoSecond`,
          {
            lesson_id: this.lessonId,
            minute: { minute: parseInt(event.target.currentTime) },
          }
        );
        await this.$store.dispatch(
          `getCurrent${this.getCoursesModeDispatch}CourseData`,
          this.$route.params.course_id
        );
      }
    },
    videoProgress(event) {
      // console.log(event);
    },
    videoCanPlayThrough(event) {
      // console.log(event);
    },
    async videoTimeUpdate(event) {
      if (!this.aborted) {
        this.videoDataToBackEnd.lastVideoPoint = event.target.currentTime;
      }

      if (event.target.currentTime === this.lessonDuration * 0.95) {
        if (this.getUserRole === 'student') {
          await this.$store.dispatch(
            `set${this.getCoursesModeDispatch}VideoSecond`,
            {
              lesson_id: this.lessonId,
              minute: { minute: 30000 },
            }
          );
        }
      }
      // console.log(event.target.currentTime);
    },
    videoAbort(event) {
      if (event) {
        this.aborted = true;
      }
      // console.log(event.target.currentTime);
    },
    async videoEnded(event) {
      if (this.getUserRole === 'student') {
        await this.$store.dispatch(
          `set${this.getCoursesModeDispatch}VideoSecond`,
          {
            lesson_id: this.lessonId,
            minute: { minute: 30000 },
          }
        );
        await this.$store.dispatch(
          `getCurrent${this.getCoursesModeDispatch}CourseData`,
          this.$route.params.course_id
        );
      }
    },
  },
};
</script>

<style lang="sass">
video
  width: 100% !important
  height: 100% !important

.vjs-big-play-button
  top: 50% !important
  left: 50% !important
  transform: translate(-50%, -50%)
</style>
