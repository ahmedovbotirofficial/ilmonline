<template>
  <div class="current_test">
    <div v-if="isLoader" class="current_test_loader">
      <Loader color="orange" />
    </div>
    <template v-else>
      <TrialCurrentTestHeader
        v-if="$route.name !== 'trial-list-results'"
        :test-info-for-header="testInfoForHeader"
      />
      <TrialTestPassing v-if="!getTrialTestTimerStatus" />
    </template>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import TrialCurrentTestHeader from '@/components/Tests/TrialTests/TrialCurrentTestHeader.vue';
import TrialTestPassing from '@/components/Tests/TrialTests/TrialTestPassing.vue';
import Loader from '@/elements/Loader/Loader.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    TrialCurrentTestHeader,
    TrialTestPassing,
    Loader,
  },

  data() {
    return {
      testInfoForHeader: {
        testNumber: this.$route.params.variant_id,
        correct_answers: 0,
        total_answers: 0,
      },

      isLoader: false,

      unloading: false,

      questions_count: 0,
    };
  },

  computed: {
    ...mapGetters([
      'getSelectedLanguage',
      'getTrialTestTimerStatus',
      'getUniqueUserID',
      'getLeavePageStatus',
      'isAuthUser',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchTrialTestVariant() && this.fetchMyTrialTestVariant();
    },
  },

  mounted() {
    this.$store.commit('SET_TRIAL_TIMER_STATUS', false);
  },

  async created() {
    // <--   notification for user about leave TEST page /////////
    window.onbeforeunload = function (e) {
      return false;
    };
    // window.addEventListener('beforeunload', this.reload);
    // -->

    await this.fetchTrialTestVariant();
    await this.fetchMyTrialTestVariant();
  },

  beforeDestroy() {
    window.onbeforeunload = null;
    // this.deleteTest();
  },

  beforeRouteLeave(to, from, next) {
    if (!this.getTrialTestTimerStatus) {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'leave-page',
        props: to,
      });
      if (this.getLeavePageStatus) {
        next();
      } else {
        return false;
      }
    } else {
      next();
    }
  },

  methods: {
    async fetchTrialTestVariant() {
      this.isLoader = true;
      await this.$store.dispatch('getTrialTest', this.$route.params.variant_id);
    },

    async fetchMyTrialTestVariant() {
      await this.$store.dispatch('getMyTrialTest', {
        try_id: this.$route.params.try_id,
      });
      this.isLoader = false;
    },

    deleteTest() {
      // console.log('start delete');
      this.$store.dispatch('deleteTrialTestVariant', {
        try_id: this.$route.params.try_id,
        token: this.isAuthUser ? null : this.getUniqueUserID,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.current_test_loader
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
</style>
