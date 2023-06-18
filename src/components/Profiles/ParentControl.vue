<template>
  <div class="profile_main">
    <div class="profile_inside">
      <div class="profile__parent_control">
        <div class="parent_control__link">
          <div class="link__title">
            {{ $t('parent_block.copy_conection_link') }}
          </div>
          <div class="link__block">
            <CopyLinkInput :link="connetionLink" />

            <a
              v-if="!!botConnection.application_submitted"
              :href="telegramLink"
              target="_blank"
            >
              <ButtonBase size="popular" color="orange">
                {{ $t('buttons.go_to_bot') }}
              </ButtonBase>
            </a>

            <ButtonBase
              v-else
              size="popular"
              color="orange"
              @click.native="parentSubscribe"
            >
              {{ $t('buttons.subscribe') }}
            </ButtonBase>
          </div>
        </div>
      </div>
    </div>
    <div class="profile_inside">
      <div class="parent_control__content">
        <div class="content__block">
          <Heading level="4">
            {{ $t('parent_block.what_is_parent_controll') }}
          </Heading>
        </div>
        <div class="content__text">
          {{ $t('parent_block.control_process') }}
        </div>

        <Heading level="4">
          {{ $t('parent_block.for_what') }}
        </Heading>
        <div class="content__text">
          {{ $t('parent_block.control_by_parent') }}
        </div>

        <Heading level="4">
          {{ $t('parent_block.bot_notification') }}
        </Heading>
        <ul class="content__text">
          <li v-for="item in notificationContent" :key="item">
            {{ $t(`parent_block.${item}`) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import CopyLinkInput from '@/elements/Inputs/CopyLinkInput.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    ButtonBase,
    CopyLinkInput,
  },

  data() {
    return {
      isParentControlBotConnected: {},

      notificationContent: [
        'success_dtm_test',
        'success_pay_for_course',
        'info_about_subscribtions',
        'success_lesson_test',
        'success_course',
        'have_not_activity',
      ],
    };
  },

  computed: {
    ...mapGetters(['getBotConnection']),

    botConnection() {
      return !!this.getBotConnection ? this.getBotConnection : '';
    },

    connetionLink() {
      return !!getFromLS('connection_token')
        ? getFromLS('connection_token')
        : '';
    },
    telegramLink() {
      return `https://t.me/${process.env.VUE_APP_TELEGRAM_BOT_USERNAME}`;
    },
  },

  async created() {
    await this.$store.dispatch('getParentConnectionStatus');
  },
  methods: {
    async parentSubscribe() {
      this.$store.commit('SET_MODAL', { state: true, name: 'parent-control' });
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_inside
  padding: 25px
  @include xxs
    padding: 16px

.parent_control__link
  display: flex
  flex-direction: column
  gap: 16px

.link__title
  font-size: 14px
  font-weight: bold
  color: var(--color-main)

.link__block a
  width: 230px

.link__block
  display: flex
  justify-content: space-between
  align-items: center
  gap: 100px
  @media only screen and (max-width: 690px)
    flex-direction: column
    align-items: flex-start
    gap: 24px

.link__block .copy_block__input
  max-width: 100%
  width: 100%

.content__text
  font-size: 18px
  margin-bottom: 28px
  line-height: 28px
  @media only screen and (max-width: 690px)
    font-size: 16px
    line-height: 24px

.content__text li
  list-style: disc
  margin-left: 24px

.content__text li::after
  display: none
</style>
