<template>
  <div class="chat-wrapper">
    <div v-if="!isLoader">
      <div v-if="!isLoader" class="chat">
        <ChatUsers
          :users-threads="getUserThreads"
          :selected-thread-id="threadId"
          @detect-search-value="fetchThreads"
          @choose-thread="chooseThread"
        />

        <ChatDialog
          :user-auth-id="userAuthId"
          :users-threads="getUserThreads"
          :selected-thread-id="threadId"
          :is-show-mobile-dialog="isShowMobileDialog"
          @go-back="hideMobileDialog"
        />
      </div>
      <div v-else-if="isThreadsEmpty" class="profile_no_tests">
        <div class="profile_no_tests__title">
          {{ $t('profilePage.have_not_dialogs') }}
        </div>
        <ButtonBase
          color="orange"
          size="popular"
          type="submit"
          class="current_lesson__btn"
          @click.native="goToAllLessons"
        >
          <span>
            {{ $t(`buttons.go_to_lessons.${getCoursesMode}`) }}
          </span>
        </ButtonBase>
      </div>
    </div>

    <Loader v-if="isLoader" color="orange"></Loader>
  </div>
</template>

<script>
import ChatUsers from '@/components/Chat/ChatUsers.vue';
import ChatDialog from '@/components/Chat/ChatDialog.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { getFromLS } from '@/library/helpers';
import { mapGetters } from 'vuex';
import * as Pusher from 'pusher-js';
import { setToLS } from '../../library/helpers';

export default {
  components: {
    ChatUsers,
    ChatDialog,
    Loader,
  },
  data() {
    return {
      userAuthId: null,
      threadId: null,
      pusher: null,
      offset: 0,
      isShowMobileDialog: false,
      isThreadsEmpty: false,
      isLoader: false,
    };
  },
  computed: {
    ...mapGetters([
      'getMessages',
      'getUserThreads',
      'getOffset',
      'getWindowWidth',
      'getCoursesModeDispatch',
      'getCoursesMode',
      'getSelectedLanguage',
    ]),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchThreads();
    },
  },

  async created() {
    this.isLoader = true;
    this.userAuthorizationId();
    await this.fetchThreads();
    this.isLoader = false;
    this.pusherLaunch();
  },

  beforeDestroy() {
    this.pusher = null;
  },
  methods: {
    userAuthorizationId() {
      this.userAuthId = getFromLS('user_id');
    },
    goToAllLessons() {
      this.$router.push({ name: 'courses' });
    },

    async fetchThreads(searchQuery) {
      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}Threads`,
        searchQuery
      );
      if (!!this.getUserThreads.length || !!searchQuery) {
        this.isThreadsEmpty = false;
        if (!!this.getUserThreads.length) {
          this.threadId = this.getUserThreads[0].id;
        } else {
          this.threadId = 0;
        }
      } else {
        this.isThreadsEmpty = true;
        return;
      }
      !!this.threadId && (await this.fetchMessages());
    },
    pusherLaunch() {
      this.pusher = new Pusher(process.env.VUE_APP_PUSHER_ID, {
        cluster: process.env.VUE_APP_PUSHED_CLUSTER,
      });

      let channel = this.pusher.subscribe(getFromLS('broadcasting_channel_id'));
      channel.bind('new-thread-message', (data) => {
        // alert(JSON.stringify(data));
        this.$store.dispatch(`get${this.getCoursesModeDispatch}Threads`, '');
        this.fetchMessages(this.threadId);
        // console.log('pusher fetchMessages <<<<');
      });
    },

    async fetchMessages() {
      this.$store.commit('SET_OFFSET', 0);
      await this.$store.dispatch('getMessages', {
        thread_id: this.threadId,
        offset: this.getOffset,
      });
    },
    chooseThread(id) {
      this.threadId = id;
      this.fetchMessages(this.threadId);
      this.$store.dispatch(`get${this.getCoursesModeDispatch}Threads`, '');

      if (this.getWindowWidth < 768) this.isShowMobileDialog = true;
    },

    hideMobileDialog() {
      if (this.getWindowWidth < 768) this.isShowMobileDialog = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.chat-wrapper
  @include xs
    margin-left: -16px
    margin-right: -16px

.chat
  background-color: var(--color-white)
  display: grid
  grid-template-columns: 40% 55%
  gap: 5%
  padding: 24px
  @include m
  @include s
    grid-template-columns: 40% 55%
    gap: 20px
    padding: 20px
  @include xs
    grid-template-columns: 1fr
    gap: 0
    position: relative
    padding: 0
.profile_no_tests
  display: flex
  align-items: center
  flex-direction: column
  padding-top: 40px
  padding-bottom: 40px
  border: 1px solid var(--color-main)

.profile_no_tests__title,
.profile_no_tests__text
  color: var(--primary-font-color)

.profile_no_tests__title
  font-weight: 500
  font-size: 24px
  line-height: 32px
  margin-bottom: 40px

.profile_no_tests__text
  font-size: 18px
  line-height: 28px
  margin: 16px 0 40px 0
</style>
