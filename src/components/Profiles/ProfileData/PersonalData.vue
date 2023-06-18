<template>
  <div>
    <div class="profile__fields profile__text_inputs">
      <TextField
        id="user-name"
        v-model.trim="fullName"
        :value="fullName"
        :error="isFullNameError"
        :error-txt="fullNameErrorText"
        :placeholder="$t('form.name')"
        type="text"
        name="name"
      />
      <TextField
        id="user-email"
        v-model.trim="email"
        :value="email"
        :error="isEmailError"
        disabled
        :error-txt="emailErrorText"
        :placeholder="'Email'"
        type="text"
        name="email"
      />
      <TextField
        id="user-city"
        v-model.trim="city"
        :value="city"
        :error="isCityNameError"
        :error-txt="cityNameErrorText"
        :placeholder="$t('form.city')"
        type="text"
        name="city"
      />
      <TextField
        id="user-phone_number"
        v-model.trim="phone_number"
        :value="phone_number"
        :error="isPhoneError"
        :error-txt="phoneErrorText"
        :placeholder="$t('form.phone_number')"
        type="number"
        name="phone_number"
      />
      <div class="profile__update_btn">
        <ButtonBase
          color="orange"
          :disabled="disabledSave"
          :size="getWindowWidth < 450 ? 'max' : 'popular'"
          @click.native="updateProfileInfo"
          >{{ $t('buttons.save_btn') }}</ButtonBase
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import profileData from '@/mixins/validation/forms/profile_data.js';

export default {
  mixins: [profileData],

  data() {
    return {
      fullName: '',
      email: '',
      city: '',
      phone_number: '',
    };
  },

  computed: {
    ...mapGetters(['getUserProfileData', 'getWindowWidth']),
    disabledSave() {
      if (
        this.fullName === this.getUserProfileData.full_name &&
        this.city === this.getUserProfileData.city &&
        this.phone_number === this.getUserProfileData.phone_number
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  created() {
    this.fullName = this.getUserProfileData.full_name;
    this.email = this.getUserProfileData.email;
    this.city = this.getUserProfileData.city;
    this.phone_number = this.getUserProfileData.phone_number;
  },

  methods: {
    async updateProfileInfo() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      let formData = new FormData();
      formData.append('full_name', this.fullName);
      formData.append('phone_number', this.phone_number);
      formData.append('city', this.city);

      await this.$store.dispatch('updateProfileInfo', formData);
    },
  },
};
</script>

<style lang="sass" scoped>
.profile__fields
  display: grid
  grid-template-columns: 1fr 1fr
  row-gap: 30px
  column-gap: 40px
  width: 100%

  @include s
    column-gap: 24px
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

.profile__update_btn
  grid-column: 2/3
  display: flex
  justify-content: flex-end
  @include xxs
    grid-column: 1
    width: 100%
</style>
