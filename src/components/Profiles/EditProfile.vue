<template>
  <div class="profile_main">
    <Loader v-if="!profile_photo" color="orange" />
    <template v-else>
      <div class="profile_inside">
        <Heading level="4">{{ $t('titles.photo') }}</Heading>
        <div class="profile__row" :class="{ photo: !!profile_photo }">
          <div class="profile__photo">
            <Loader v-if="loadingPhoto" color="orange" />
            <img v-else :src="profile_photo" />
          </div>
          <div class="profile__btns">
            <label
              v-if="!profile_photo.includes('non_user_avatar')"
              class="profile__download_photo disabled"
            >
              {{ $t('buttons.download_btn') }}
            </label>

            <div v-else class="profile_download_photo__wrapper">
              <label for="upload" class="profile__download_photo">
                {{ $t('buttons.download_btn') }}
                <input
                  id="upload"
                  ref="profile_photo"
                  type="file"
                  class="input"
                  @input="uploadPhoto"
                />
              </label>
            </div>

            <ButtonBase
              color="transparent"
              :size="getWindowWidth < 540 ? 'max' : 'popular'"
              class="profile__delete_photo"
              :disabled="!!profile_photo.includes('non_user_avatar')"
              @click.native="deletePhoto"
              >{{ $t('buttons.delete_btn') }}</ButtonBase
            >
          </div>
        </div>
        <!-- {{ userProfileData }} -->
      </div>
      <div class="profile_inside">
        <Heading level="4"> {{ $t('titles.main_info') }}</Heading>

        <PersonalData />

        <div class="profile__fields__wrapper">
          <Heading level="4"> {{ $t('titles.social') }}</Heading>
          <div class="profile__fields profile__auth_btns">
            <ButtonBase
              v-for="{
                id,
                text,
                color,
                size,
                border,
                iconName,
              } in registerBtns"
              :key="id"
              :color="color"
              :size="size"
              :border="border"
              :icon-name="iconName"
              auth-btn
              @click.native="goToRegisterSotional(id)"
              >{{ text }}</ButtonBase
            >

            <div class="telegram_btn">
              <vue-telegram-login
                mode="redirect"
                :telegram-login="getTelegramBotUsername"
                radius="0"
                :userpic="false"
                :size="getTelegramBtnSize"
                :redirect-url="getTelegramRedirectUrl"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="profile_inside">
        <PasswordData />
      </div>
    </template>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import PasswordData from './ProfileData/PasswordData.vue';
import PersonalData from './ProfileData/PersonalData.vue';
import { vueTelegramLogin } from 'vue-telegram-login';

import validate from '@/mixins/ProfileInfo';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
    vueTelegramLogin,
    PasswordData,
    PersonalData,
  },
  mixins: [validate],

  data() {
    return {
      profile_photo: null,
      loadingPhoto: false,

      registerBtns: [
        {
          id: 'google',
          color: 'white',
          size: 'max',
          text: 'Google',
          iconName: 'google',
          border: true,
        },
        {
          id: 'twitter',
          color: 'cyan',
          size: 'max',
          text: 'Twitter',
          iconName: 'twitter',
        },
        {
          id: 'facebook',
          color: 'blue',
          size: 'max',
          text: 'Facebook',
          iconName: 'facebook',
        },
      ],
    };
  },

  computed: {
    ...mapGetters(['getWindowWidth', 'getCoursesMode', 'getUserProfileData']),
    getTelegramRedirectUrl() {
      return process.env.VUE_APP_TELEGRAM_REDIRECT_URI;
    },
    getTelegramBotUsername() {
      return this.getCoursesMode === COURSES_MODES.PRO
        ? process.env.VUE_APP_TELEGRAM_BOT_USERNAME_PRO
        : process.env.VUE_APP_TELEGRAM_BOT_USERNAME;
    },
    getTelegramBtnSize() {
      return window.innerWidth >= 768 ? 'large' : 'small';
    },
  },

  async created() {
    await this.fetchUserData();
  },
  methods: {
    async uploadPhoto() {
      this.loadingPhoto = true;
      let formData = new FormData();
      // this.profile_photo = this.$refs.profile_photo.files[0];
      formData.append('image', this.$refs.profile_photo.files[0]);
      this.profile_photo = await this.$store.dispatch('uploadPhoto', formData);
      this.loadingPhoto = false;
    },
    async deletePhoto() {
      this.loadingPhoto = true;
      this.profile_photo = await this.$store.dispatch('deletePhoto');
      this.loadingPhoto = false;
    },
    async fetchUserData() {
      await this.$store.dispatch('getPprofileData');
      !!this.getUserProfileData.profile_photo
        ? (this.profile_photo = this.getUserProfileData.profile_photo)
        : (this.profile_photo =
            this.getUserProfileData.non_avatars[this.getCoursesMode]);
    },
    async goToRegisterSotional(id) {
      const url = process.env.VUE_APP_API_HOST + '/auth/social/sign-in';
      window.open(`${url}/${id}?role=${this.isSelectedRole}`, '_self');
    },
  },
};
</script>

<style lang="sass" scoped>
.profile__row
  display: flex
  gap: 40px
  align-items: center

  @include s
    gap: 24px

  @include xxs
    gap: 20px

.profile__row.photo
  align-items: stretch

.profile__btns
  display: flex
  flex-direction: column
  align-self: center
  gap: 24px

  @include xxs
    gap: 16px
    width: 100%

.profile__delete_photo
  @include xxs
    width: 100%
    height: 44px

.input
  display: none

.profile_download_photo__wrapper
  background: var(--primary-font-color)

.profile_download_photo__wrapper:hover .profile__download_photo
  transform: translate(4px, -4px)

.profile__download_photo
  display: flex
  align-items: center
  justify-content: center
  text-transform: uppercase
  cursor: pointer
  font-weight: 600
  height: 48px
  background-color: var(--color-main)
  color: var(--color-white)

  @include xxs
    width: 100%
    height: 44px

.profile__download_photo.disabled
  cursor: default
  background: var(--color-main-light)

.profile__fields
  display: grid
  grid-template-columns: 1fr 1fr
  row-gap: 30px
  column-gap: 40px
  width: 100%

  @include s
    column-gap: 24px
    grid-template-columns: 1fr
  @include xxs
    grid-template-columns: 1fr

.profile__text_inputs
  padding-bottom: 40px
  border-bottom: 1px solid #CFCFCF
  margin-bottom: 24px

  @include s
    padding-bottom: 32px

  @include xxs
    padding-bottom: 28px
    margin-bottom: 18px

.profile__passwords_inputs
  margin-bottom: 40px
  grid-auto-flow: column
  @include xxs
    margin-bottom: 24px
    grid-auto-flow: initial

.profile__text_inputs,
.profile__passwords_inputs
  @include xxs
    grid-template-columns: 1fr

.profile__auth_btns
  margin-bottom: 40px
  @include xxs
    gap: 16px
    margin-bottom: 24px

.profile__auth_btns .button_wrapper
  width: 100%

.profile__fields__wrapper
  display: flex
  flex-direction: column

.telegram_btn
  width: 100%
  height: 48px
  display: flex
  align-items: center
  justify-content: center
  background-color: #54a9eb

  @include xxs
    height: 44px
    grid-row: 2/3

.telegram_btn div
  display: flex
  align-items: center
</style>
