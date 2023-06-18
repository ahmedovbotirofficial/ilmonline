<template>
  <div class="profile_main">
    <Loader v-if="!userProfileData" color="orange"></Loader>
    <div v-else class="profile_inside">
      <div class="profile__row">
        <div
          class="profile__photo desktop"
          :class="{ not_photo: !userProfileData.profile_photo }"
        >
          <img
            :src="
              !!userProfileData.profile_photo
                ? userProfileData.profile_photo
                : userProfileData.non_avatars[getCoursesMode]
            "
          />
        </div>
        <div class="profile__col">
          <div class="profile__head">
            <div
              class="profile__photo mob"
              :class="{ not_photo: !userProfileData.profile_photo }"
            >
              <img
                :src="
                  !!userProfileData.profile_photo
                    ? userProfileData.profile_photo
                    : userProfileData.non_avatars[getCoursesMode]
                "
              />
            </div>
            <Heading level="4">{{ userProfileData.full_name }}</Heading>
          </div>
          <ButtonBase
            :size="getWindowWidth > 768 ? 'popular' : 'max'"
            color="orange"
            class="edit_btn"
            @click.native="goToEdit"
            >{{ $t('buttons.edit_btn') }}</ButtonBase
          >
          <div v-if="!!userProfileData.city" class="profile__item item city">
            <div class="item__title">{{ $t('form.city') }}</div>
            <div class="item__value">{{ userProfileData.city }}</div>
          </div>
          <div
            v-if="!!userProfileData.phone_number"
            class="profile__item item phone"
          >
            <div class="item__title">{{ $t('form.phone_number') }}</div>
            <div class="item__value">
              {{ userProfileData.phone_number }}
            </div>
          </div>
          <div class="profile__item item email">
            <div class="item__title">E-mail</div>
            <div class="item__value">{{ userProfileData.email }}</div>
          </div>
          <div v-if="userProfileData.facebook_url" class="profile__item item">
            <div class="item__title">Facebook</div>
            <div class="item__value">
              <a
                href="https://facebook.com/"
                target="_blank"
                class="item__link"
              >
                {{ userProfileData.facebook_url }}
              </a>
            </div>
          </div>
          <div v-if="userProfileData.telegram_url" class="profile__item item">
            <div class="item__title">Telegram</div>
            <div class="item__value">
              <a
                href="https://web.telegram.org/"
                target="_blank"
                class="item__link"
              >
                {{ userProfileData.telegram_url }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    Loader,
    ButtonBase,
  },
  data() {
    return {
      userProfileData: null,
    };
  },
  computed: {
    ...mapGetters(['getWindowWidth', 'getCoursesMode']),
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      this.userProfileData = await this.$store.dispatch('getPprofileData');
    },
    goToEdit() {
      this.$router.push({ name: 'profile-edit' });
    },
  },
};
</script>

<style lang="sass" scoped>
.profile__row,
.profile__row_items
  display: flex
  gap: 40px
  width: 100%

.profile__row_items
  gap: 90px
  @include m
    gap: 50px

.profile__col
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 24px
  width: 100%

  @include xs
    gap: 20px

  .primary-btn
    justify-self: end
    padding: 8px 12px

    @media screen and (min-width: 1025px) and (max-width: 1250px)
      width: 100%

    @include xs
      grid-row: 6/7
      grid-column: 1/-1
      width: 100%

.profile__col .title--4
  align-self: center
  margin-bottom: 0
  @include xs
    grid-column: 1/-1

.profile__head
  align-self: center
  @include xs
    display: flex
    align-items: center
    gap: 20px
    grid-column: 1/-1

.profile__title_wrapper
  display: flex
  align-items: center
  justify-content: space-between
  max-height: 48px
  width: 100%
  margin-bottom: 24px

.profile__btns
  display: flex
  flex-direction: column
  align-self: center
  gap: 24px

.profile__item
  display: flex
  gap: 5px
  flex-direction: column
  @include xs
    grid-column: 1/-1

.profile__item.city
  @include xs
    grid-row: 2/3
    grid-column: 1/2

.profile__item.city .item__value
  @media only screen  and (max-width: 420px)
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    max-width: 111px

.profile__item.phone
  @include xs
    grid-row: 2/3
    grid-column: 2/3

.profile__item.phone,
.profile__item.email
  .item__value
    width: 125px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

.profile__item.email
  .item__value
    @include xs
      width: 100%

.edit_btn
  @include xs
    grid-column: 1/-1
    grid-row: 4/5

.edit_btn.button_wrapper
  @include xs
    width: 100% !important

.item__title
  font-size: 12px

.item__value
  font-weight: bold

.item__value,
.item__link
  font-size: 18px
  line-height: 23px

.item__link
  font-weight: 600
  text-decoration: underline
  color: #516EF9
</style>
