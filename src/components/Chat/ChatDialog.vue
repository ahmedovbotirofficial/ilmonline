<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="chat_dialog__wrapper" :class="{ active: isShowMobileDialog }">
    <!-- {{ getMessages }} -->
    <div v-if="!!selectedThread" class="chat_dialog__current">
      <button
        type="button"
        class="chat_dialog__back_btn"
        @click="$emit('go-back')"
      >
        <svg-icon name="arrow_back"></svg-icon>
        {{ $t('buttons.go_back') }}
      </button>
      <div class="chat_dialog__current_inner">
        <img
          v-if="!!selectedThread && selectedThread.participant.profile_photo"
          :src="selectedThread.participant.profile_photo"
          class="image_user_chat"
        />

        <svg-icon
          v-else
          :name="`non_user_avatar_${getCoursesMode}`"
          class="chat_users__foto"
        />
        <div class="chat_dialog__current_user">
          <Heading level="6">{{ fullName }}</Heading>
          <span class="chat_dialog__title">{{ courseTitle }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="!!selectedThread"
      id="chat_container"
      class="chat_dialog__scroll"
      :class="{ have_no_mess: !!getMessages && !getMessages.length }"
    >
      <div
        v-if="!!getMessages && !getMessages.length"
        class="chat_dialog__empty_wrapper"
      >
        <div class="chat_dialog__empty">
          {{ $t('chat.send_mess') }}

          <svg-icon :name="`icon_pin_${getCoursesMode}`" />
        </div>
      </div>

      <template v-else>
        <div
          v-for="item in getMessages"
          :id="
            item.id === getMessages[getMessages.length - 1].id
              ? 'last_item'
              : ''
          "
          :key="item.id"
          class="chat_dialog"
          :class="{ my_mess: !!item && item.user.id === userAuthId }"
        >
          <img
            v-if="!!item.user.profile_photo"
            class="image_user_chat"
            :src="item.user.profile_photo"
          />
          <svg-icon
            v-else
            :name="`non_user_avatar_${getCoursesMode}`"
            class="chat_users__foto"
          />
          <div class="chat_dialog__time_content">
            <p
              v-if="item.body"
              class="chat_dialog__text"
              v-html="getCorrectMess(item.body)"
            ></p>

            <img
              v-if="item.has_attachment"
              :src="item.attachment.original_url"
            />
            <div class="chat_dialog__time_wrapper">
              <div v-if="item.user.id === userAuthId" class="eye_wrapper">
                <svg-icon
                  v-if="item.participant_unread"
                  :name="`eye_cross_${getCoursesMode}`"
                />
                <svg-icon v-else :name="`eye_${getCoursesMode}`" />
              </div>
              <span class="chat_dialog__time">{{
                getMessageTime(item.created_at)
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div
      class="chat_dialog__message"
      @keyup.enter.exact.prevent="sendMessage"
      @keyup.enter.shift.exact.prevent="newLine"
    >
      <TextField
        id="message"
        v-model="userMessage"
        :label="!!userMessage ? '' : 'Сообщение...'"
      />
      <div class="chat_dialog__foto">
        <label for="sent" class="profile__download_photo">
          <svg-icon name="camera"></svg-icon>
          <input
            id="sent"
            ref="file"
            type="file"
            class="input"
            @input="sendMessage"
          />
        </label>

        <button
          :disabled="!userMessage"
          class="mail-send_wrapper"
          @click="sendMessage"
        >
          <svg-icon name="mail-send" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    TextField,
  },
  props: {
    userAuthId: {
      type: Number,
      default: null,
    },
    usersThreads: {
      type: Array,
      default: () => [],
    },
    selectedThreadId: {
      type: Number,
      required: true,
    },
    isShowMobileDialog: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      userMessage: '',
      file: null,
      loadMore: true,
      nextItem: 1,
      topOfChatDilog: 0,
      bottomOfChatDilog: 0,
      lastItem: 0,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getMessages',
      'getOffset',
      'getSelectedLanguage',
    ]),
    selectedThread() {
      return this.usersThreads.find(
        (thread) => thread.id === this.selectedThreadId
      );
    },
    fullName() {
      return !!this.selectedThread
        ? this.selectedThread.participant.full_name
        : '';
    },
    courseTitle() {
      return !!this.selectedThread ? this.selectedThread.course_title : '';
    },
  },

  watch: {
    selectedThread(value) {
      value && (this.userMessage = '');
    },
  },

  mounted() {
    let topOfChatDilog = document.getElementById('chat_container');
    this.topOfChatDilog = Math.floor(
      topOfChatDilog.getBoundingClientRect().top
    );
    this.bottomOfChatDilog = this.topOfChatDilog - 30;
    topOfChatDilog.addEventListener('scroll', this.scrollWatcher);
  },

  methods: {
    getCorrectMess(value) {
      let mess = value;
      let urlRegex = /(https?:\/\/[^\s]+)/g;
      return mess.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank" style="color: #1877F2; text-decoration: underline">${url}</a>`;
      });
    },

    getMessageTime(date) {
      let lang = this.getSelectedLanguage;
      if (lang === 'uz') {
        lang = 'uz-latn';
      }
      return moment(date).locale(`${lang}`).format('HH:mm');
    },
    async sendMessage() {
      const message = {
        thread_id: this.selectedThreadId,
        body: this.userMessage,
        attachment: this.$refs.file.files[0],
      };
      this.$store.commit('SET_OFFSET', 0);
      await this.$store.dispatch('sendUserMessage', message);
      this.userMessage = '';
      this.$refs.file.value = null;
      this.file = null;
    },

    newLine() {
      return;
    },

    async scrollWatcher(event) {
      this.lastItem = Math.floor(
        document.getElementById('last_item').getBoundingClientRect().bottom +
          200
      );
      // console.log('item message pos >>>', this.lastItem);
      // console.log('chat_container top pos >>>', this.topOfChatDilog);
      // console.log('chat_container bottom pos >>>', this.bottomOfChatDilog);
      if (this.loadMore) {
        if (
          this.lastItem <= this.topOfChatDilog &&
          this.lastItem >= this.bottomOfChatDilog
        ) {
          this.loadMore = false;
          this.$store.commit('SET_OFFSET', 30);
          await this.$store.dispatch('getMessages', {
            thread_id: this.selectedThreadId,
            offset: this.getOffset,
          });
        }
        this.loadMore = true;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.chat_dialog__wrapper
  display: flex
  flex-direction: column
  justify-content: flex-end
  @include xs
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 2
    transform: translateX(-100%)
    padding: 20px 16px
    background: var(--color-white)
    transition: var(--transition-speed)

.chat_dialog__wrapper.active
  transform: translateX(0)

.chat_dialog__back_btn
  font-weight: 600
  font-size: 14px
  line-height: 18px
  color: var(--primary-font-color)
  align-items: center
  gap: 6px
  display: none
  @include xs
    display: flex

.icon-arrow_back
  width: 5px
  height: 10px

.chat_dialog__current
  border-bottom: 1px solid var(--primary-font-color)
  padding-bottom: 10px
  display: flex
  align-items: center
  margin-bottom: 55px
  @include xs
    justify-content: space-between

.chat_dialog__current_inner
  display: flex
  align-items: center
  @include xxs
    justify-content: flex-end

.image_user_chat
  width: 32px
  height: 32px
  border-radius: 50%
  object-fit: cover

.chat_dialog__scroll
  max-height: 400px
  overflow-y: scroll
  height: 100%
  display: flex
  flex-direction: column-reverse
  @include xxs
    padding-bottom: 4px

.chat_dialog__scroll::-webkit-scrollbar
  width: 5px
  height: 70px

.chat_dialog__scroll::-webkit-scrollbar-thumb
  display: none

.chat_dialog__scroll:hover::-webkit-scrollbar-thumb
  display: block
  background: #ECECEC
  border-radius: 2px

.chat_dialog__scroll.have_no_mess
  justify-content: center

.chat_dialog__current svg
  max-width: 32px
  max-height: 32px

.chat_dialog__title
  color: var(--color-font-light-dark)
  font-size: 14px

.chat_dialog__current_user .title,
.chat_dialog__title
  @include xxs
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    width: 170px
    display: inline-block

.chat_dialog__current_user
  margin-left: 8px
  @include xxs
    display: flex
    flex-direction: column

.chat_dialog__text
  font-size: 14px
  line-height: 18px
  background-color: var(--color-thread-bg)
  padding: 8px 12px
  max-width: 315px
  margin-bottom: 6px

.chat_dialog
  display: flex
  margin-bottom: 12px

.icon-user
  max-width: 26px
  max-height: 26px

.icon-eye_school,
.icon-eye_pro
  max-width: 12px
  max-height: 8px

.icon-eye_cross_school,
.icon-eye_cross_pro
  max-width: 12px
  max-height: 10px

.chat_dialog__time_content
  margin-left: 8px
  display: flex
  flex-direction: column

  img
    max-width: 60%

.chat_dialog__time
  color: var(--color-font-light-dark)
  font-size: 14px
  padding-left: 6px

.my_mess
  // justify-content: flex-end
  flex-direction: row-reverse

.my_mess .chat_dialog__time_content
  align-items: flex-end
  margin-right: 8px
  margin-left: 0

.my_mess .chat_dialog__text
  background-color: #F1F3F3

.chat_dialog__message
  background-color: #ECEFF0
  display: flex
  align-items: center
  padding: 0 12px
  gap: 12px
  margin-top: 24px
  @include xs
    margin-top: 0

.chat_dialog__message .text_field__container
  border: none

.mail-send_wrapper
  background-color: var(--color-head-title)
  padding: 8px 12px
  &:hover
    background-color: var(--color-head-title)
  @include xs
    padding: 4px 12px

.mail-send_wrapper[disabled]
  cursor: default
  background-color: #E56E5B

.pro-courses .mail-send_wrapper[disabled]
  background-color: var(--btn-color-cyan-blue)

.icon-mail-send
  max-width: 20px
  max-height: 20px

.icon-camera
  max-width: 20px
  max-height: 20px
  cursor: pointer
  &:hover
    fill: var(--color-main)

.chat_dialog__foto
  display: flex
  gap: 12px
  align-items: center

.input
  display: none

.chat_dialog__empty_wrapper
  height: 235px
  align-self: center
  justify-content: center
  width: 100%
  display: flex
  align-items: flex-end

.school-courses
  .chat_dialog__empty
    background: var(--color-main-light-bg)

.pro-courses
  .chat_dialog__empty
    background: var(--color-blue-light-bg)

.chat_dialog__empty
  width: 100%
  height: 180px
  max-width: 260px
  border-radius: 70px
  border: 1px solid rgba(0, 0, 0, 0.2)
  position: relative
  display: flex
  align-items: center
  justify-content: center
  padding: 0 34px
  text-align: center

.chat_dialog__empty svg
  position: absolute
  left: 50%
  transform: translateX(-30%)
  max-width: 80px
  max-height: 80px
  top: -55px

.chat_dialog__time_wrapper
  display: flex
  align-items: center
  gap: 5px

.eye_wrapper
  display: flex
  align-items: center

.eye_wrapper svg
  max-width: 12px

.chat_users__foto
  width: auto
  height: auto
  max-width: 24px
  max-height: 24px
</style>
