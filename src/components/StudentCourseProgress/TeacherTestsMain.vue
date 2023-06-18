<template>
  <div class="current_test">
    <div v-if="isLoader" class="current_test_loader">
      <Loader color="orange" />
    </div>
    <template v-else>
      <TeacherTestWatchingHeader />
      <TeacherTestWatching />
    </template>
  </div>
</template>

<script>
import TeacherTestWatchingHeader from './TeacherTestWatchingHeader.vue';
import TeacherTestWatching from './TeacherTestWatching.vue';
import Loader from '@/elements/Loader/Loader.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    TeacherTestWatchingHeader,
    TeacherTestWatching,
    Loader,
  },

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getLessonTest',
      'getSelectedLanguage',
      'getWindowWidth',
      'getUserRole',
      'getCoursesMode',
      'getCoursesModeDispatch',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchCourseProgress();
    },
  },

  mounted() {
    document.documentElement.classList.remove('overflow_hidden');
  },
  async created() {
    this.isLoader = true;
    await this.$store.dispatch(`get${this.getCoursesModeDispatch}LessonTest`, {
      lesson_id: this.$route.params.lesson_id,
    });
    this.isLoader = false;
  },

  methods: {},
};
</script>

<style lang="sass" scoped>
.current_test_loader
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
</style>
