<template>
  <div class="chat_users">
    <div class="chat_users__wrapper">
      <InputSearch
        v-model="searchQuery"
        class="chat_users__input"
        :is-white="true"
        :placeholder-value="$t('main.search_placholder')"
        @input="searchValue"
      />
      <div class="chat_users__scroll">
        <div v-if="usersThreads.length" class="chat_users_block">
          <div
            v-for="item in usersThreads"
            :key="item.id"
            class="chat_users_main__wrapper"
            @click="chooseThread(item.id)"
          >
            <div class="chat_users__main_title">{{ item.course_title }}</div>
            <div
              class="chat_users__main"
              :class="{ selected: item.id === selectedThreadId }"
            >
              <span v-if="!!item.latest_message" class="chat_users__time">{{
                getMessageDate(item.latest_message.created_at)
              }}</span>
              <img
                v-if="!!item.participant.profile_photo"
                :src="item.participant.profile_photo"
                class="chat_users__image"
              />
              <svg-icon
                v-else
                :name="`non_user_avatar_${getCoursesMode}`"
                class="chat_users__foto"
              />
              <div class="chat_users__content">
                <Heading level="6" class="chat_users__name">
                  {{ item.participant.full_name }}
                </Heading>
                <div
                  v-if="!!item.latest_message"
                  class="chat_users__message_wrapper"
                >
                  <p class="chat_users__message">
                    {{ item.latest_message.body.slice(0, 28) }}...
                  </p>
                </div>
              </div>
              <div class="chat_users__unread">
                <span
                  v-if="item.unread_count"
                  class="chat_users__unread_mess"
                  >{{ item.unread_count }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else class="chat_users_block">
          {{ $t('chat.not_found_dialogs') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/elements/Inputs/InputSearch.vue';
import Heading from '@/elements/Heading/Heading.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  components: {
    Heading,
    InputSearch,
  },
  props: {
    usersThreads: {
      type: Array,
      default: () => [],
    },
    selectedThreadId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    ...mapGetters(['getSelectedLanguage', 'getCoursesMode']),
  },
  methods: {
    searchValue(value) {
      this.searchQuery = value;
      this.$emit('detect-search-value', this.searchQuery);
    },
    getMessageDate(date) {
      let lang = this.getSelectedLanguage;
      if (lang === 'uz') {
        lang = 'uz-latn';
      }

      return moment(date, 'YYYY-MM-DD').locale(`${lang}`).format('ll');
    },
    chooseThread(id) {
      this.$emit('choose-thread', id);
    },
  },
};
</script>

<style lang="sass">
.choosen
  background-color: #F7F3F2

.chat_users
  min-height: 500px
  @include xs
    position: relative
    padding: 20px 16px
    z-index: 1

.chat_users_block
  margin-top: 24px

.chat_users__scroll
  position: relative
  max-height: 480px
  overflow-y: scroll

.chat_users__scroll::-webkit-scrollbar
  width: 5px
  height: 70px

.chat_users__scroll::-webkit-scrollbar-thumb
  display: none

.chat_users__scroll:hover::-webkit-scrollbar-thumb
  display: block
  background: #ECECEC
  border-radius: 2px

.chat_users_title
  color: var(--color-font-light-dark)
  margin-bottom: 8px

.chat_users_main__wrapper
  padding-top: 20px

.chat_users__main_title
  color: #969696
  padding-bottom: 8px
  line-height: 20px
  @include s
    font-size: 14px

.chat_users__main
  display: flex
  align-items: center
  border: 1px solid var(--color-thread-bg)
  padding: 16px 12px
  position: relative
  cursor: pointer
  &:hover
    background-color: var(--color-thread-bg)

.chat_users__main.active
  background-color: var(--color-thread-bg)

.chat_users__main.selected
  background-color: #F7F3F2

.chat_users__time
  position: absolute
  top: 8px
  right: 8px
  color: var(--color-font-light-dark)
  font-size: 12px

.chat_users__content
  padding-left: 8px

.chat_users__name
  margin-bottom: 0
  font-size: 16px
  line-height: 20px

.chat_users__name,
.chat_users__message
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
  width: 120px
  display: inline-block

.chat_users__message_wrapper
  display: flex
  align-items: flex-end
  justify-content: space-between
  width: 100%

.chat_users__unread
  position: absolute
  right: 8px
  top: 50%
  transform: translateY(-50%)

.chat_users__unread_mess
  background-color: var(--color-main)
  padding: 2px 7px
  color: var(--color-white)
  font-size: 12px

.chat_users__message
  font-size: 14px
  line-height: 18px

.school-courses
  .chat_users__message
    color: #A66241

.pro-courses
  .chat_users__message
    color: #4188A6

.chat_users__image
  width: 32px
  height: 32px
  border-radius: 50%
  object-fit: cover

.chat_users__input .input-search__list
  height: 48px
  background-color: var(--color-white)
  z-index: 9

.chat_users__input .input-search__wrapper
  display: flex
  align-items: center
</style>
