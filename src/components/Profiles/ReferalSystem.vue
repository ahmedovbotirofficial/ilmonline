<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="profile_main">
    <div class="profile_inside">
      <div class="profile__referal referal">
        <div
          class="referal__title"
          v-html="$t('titles.invite_friends_info')"
        ></div>
        <div class="referal__row">
          <div class="referal__col">
            <div class="referal__bonuses">
              <div class="bonuses__text bonuses__text--white">
                {{ $t('titles.earned') }}
              </div>
              <div class="bonuses__percent">
                {{ referral_data.bonuses_earned }}
              </div>
            </div>
            <div class="referal__bonuses">
              <div class="bonuses__text">
                {{ $t('titles.invited_users') }}
              </div>
              <div class="bonuses__percent">
                {{ referral_data.invited_users }}
              </div>
            </div>
          </div>
          <div class="referal__col">
            <div class="referal__copy_block">
              <div class="copy_block__col">
                <div class="copy_block__title">
                  {{ $t('titles.copy_link') }}
                </div>

                <CopyLinkInput :link="referral_data.link" />
              </div>

              <div
                class="copy_block__text"
                v-html="$t('titles.new_customer')"
              ></div>
            </div>
          </div>
        </div>
        <div class="referal__row_items">
          <div class="referal__title">
            <Heading level="4">
              {{ $t('titles.how_get_referal') }}
            </Heading>
          </div>
          <div class="referal__item_block">
            <div class="referal__item">
              <div class="referal__item_icon">
                <svg-icon :name="`icon_friend_chat_${getCoursesMode}`" />
              </div>
              <div class="referal__item_text">
                {{ $t('titles.send_copied_link') }}
              </div>
            </div>
            <div class="referal__item">
              <div class="referal__item_icon">
                <svg-icon :name="`icon_friend_buy_${getCoursesMode}`" />
              </div>
              <div class="referal__item_text">
                {{ $t('titles.your_friend_can_buy') }}
              </div>
            </div>
            <div class="referal__item">
              <div class="referal__item_icon">
                <svg-icon :name="`icon_friend_gift_${getCoursesMode}`" />
              </div>
              <div
                class="referal__item_text"
                v-html="$t('titles.your_discount')"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import CopyLinkInput from '@/elements/Inputs/CopyLinkInput.vue';
export default {
  components: {
    Heading,
    CopyLinkInput,
    // ButtonBase,
  },
  data() {
    return {
      referral_data: {},
      copied_link: false,
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode']),
    copied() {
      return this.copied_link ? 'copied_link' : '';
    },
  },

  mounted() {
    this.fetchUserData();
  },
  methods: {
    copyToClipBoard(link) {
      if (!this.copied_link) {
        navigator.clipboard.writeText(link);
        this.copied_link = true;
        setTimeout(() => {
          this.copied_link = false;
        }, 4000);
      }
    },
    async fetchUserData() {
      let res = await this.$store.dispatch('getPprofileData');
      this.referral_data = res.referral_data;
    },
    goToEdit() {
      this.$router.push({ name: 'profile-edit' });
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_inside
  padding: 25px
  @include xxs
    padding: 16px
    margin: 0 -16px

.referal__title
  margin-bottom: 24px
  max-width: 540px
  line-height: 28px
  @include xxs
    margin-bottom: 16px

.referal__title .title
  @include xxxs
    max-width: 180px

.referal__row
  display: flex
  gap: 24px
  @include xs
    flex-direction: column

.referal__col
  display: flex
  flex-direction: column
  gap: 24px
  margin-bottom: 40px
  @include xs
    flex-direction: row
  @include xxs
    gap: 16px
    margin-bottom: 0

.referal__col:last-child
  width: 100%

.referal__bonuses
  padding: 30px 60px 18px 24px
  background-color: var(--color-main)
  color: var(--color-white)
  font-size: 14px
  line-height: 22px
  box-shadow: 0px 6px 16px rgba(214, 205, 202, 0.12)
  // white-space: nowrap
  @include xxs
    padding: 15px
    line-height: 15px

.referal__bonuses:last-child
  background-color: var(--color-white)
  color: var(--color-main)

.school-courses
  .referal__bonuses,
  .referal__copy_block
    border: 1px solid #FCF8F7

.pro-courses
  .referal__bonuses,
  .referal__copy_block
    border: 1px solid #E7FCE8

.bonuses__percent
  font-size: 32px
  line-height: 48px
  @include xxs
    font-size: 24px
    line-height: 35px

.referal__copy_block
  height: 100%
  display: flex
  flex-direction: column
  justify-content: space-between
  padding: 24px
  box-shadow: 0px 6px 16px rgba(214, 205, 202, 0.12)
  @include xs
    padding: 10px
    width: 100%
  @include xxs
    margin-bottom: 24px

.bonuses__text
  color: var(--primary-font-color)
  @include xxs
    font-size: 12px

.bonuses__text--white
  color: var(--color-white)

.copy_block__col
  display: flex
  flex-direction: column
  justify-content: space-between
  gap: 16px
  position: relative
  top: 24px

.referal__link
  white-space: nowrap
  max-width: 240px
  overflow-y: hidden
  @include m
    font-size: 14px
    width: 85%
  // text-overflow: ellipsis
.referal__link::-webkit-scrollbar
  display: none

.copy_block__text
  opacity: 0.6
  @include xs
    padding-top: 44px

.copy_block__notifiction
  position: absolute
  display: none
  align-items: center
  padding: 12px
  color: var(--color-white)
  background-color: var(--color-success)
  gap: 10px
  top: -68px
  right: -73px

.copy_block__notifiction.active
  display: flex

.copy_block__notifiction::after
  content: ''
  position: absolute
  top: 46px
  transform: translateX(-50%)
  left: 50%
  height: 20px
  width: 20px
  background-image: url(/images/arrow_link_copy_after.svg)

.copy_block__notifiction svg
  position: relative
  top: 12px
  left: 0

.referal__item_block
  display: flex
  gap: 33px
  @include s
    flex-direction: column
    gap: 16px

.referal__item
  display: flex
  flex-direction: column
  justify-content: flex-start
  gap: 13px
  flex: 1 1 33.333%
  padding: 22px
  border: 1px solid rgba(150, 150, 150, 0.16)
  @include m
    padding: 16px
  @include s
    flex-direction: row
  @include xxs
    flex-direction: column
    gap: 10px
  &_text
    font-size: 14px
    line-height: 22px
    @include xxs
      // max-width: 198px

.copy_block__title
  color: var(--color-main)
  font-size: 14px
  font-weight: bold
  @include xxxs
    max-width: 157px

</style>
