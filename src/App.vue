<template>
  <div id="app" data-app :class="`${getCoursesMode}-courses`">
    <SelectAppMode v-if="getIsShowSelectModePage" />
    <div v-else>
      <Modal />
      <Notification />
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFromLS, setToLS, isLSHasItem } from '@/library/helpers';
import SelectAppMode from '@/components/AppMode/SelectAppMode.vue';
import Modal from '@/elements/Modal/Modal.vue';
import Notification from '@/elements/Notification/Notification';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    SelectAppMode,
    Modal,
    Notification,
  },
  computed: {
    ...mapGetters(['getCoursesMode', 'getIsShowSelectModePage']),
  },

  created() {
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const isSchoolCourses = !window.location.href.includes('pro.');
    const isLandinPage = window.location.pathname === '/';

    const isRedirect = !!queryParams.redirect;
    const selectedQueryLang = queryParams.lang;
    const jwtToken = queryParams.jwt;

    if (!!jwtToken) {
      this.signInUser(jwtToken);
    }

    if (!!selectedQueryLang)
      this.$store.commit('selectLanguage', selectedQueryLang);

    if (isRedirect || selectedQueryLang || jwtToken) {
      window.location.pathname !== '/auth/success'
        ? this.$router.replace({ path: window.location.pathname, query: null })
        : this.$router.push({ path: '/', query: null });
    }

    if (isSchoolCourses && isLandinPage && !isRedirect)
      this.$store.commit('SET_IS_SHOW_SELECT_MODE_PAGE', true);

    if (window.location.href.includes('pro.')) {
      this.$store.commit('SET_COURSES_MODE', COURSES_MODES.PRO);
    } else {
      this.$store.commit('SET_COURSES_MODE', COURSES_MODES.SCHOOL);
    }
  },

  mounted() {
    window.addEventListener('resize', this.windowWidthListener);

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.addEventListener(
        'touchmove',
        (e) => {
          if (e.scale !== 1) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }
  },
  methods: {
    windowWidthListener() {
      this.$store.commit(
        'setWindowHeight',
        document.documentElement.clientHeight
      );
      this.$store.commit(
        'setWindowWidth',
        document.documentElement.clientWidth
      );
    },
    signInUser(token) {
      this.$store.commit('SAVE_USER_TOKEN', token);

      this.fetchUserData(token).then((user) => {
        const role = user.role;

        this.$store.commit('SAVE_USER', {
          token,
          role,
          user,
        });
        this.$store.dispatch('getConnectionToken');
      });
    },
    async fetchUserData(token) {
      return this.$store.dispatch('getPprofileData', { token: token });
    },
  },
};
</script>

<style lang="sass">
@import '@/assets/styles/main.sass'
</style>
