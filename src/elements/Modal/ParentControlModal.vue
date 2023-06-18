<template>
  <div class="modal__content">
    <h2 class="modal__content_title">{{ $t('titles.want_parent_control') }}</h2>
    <TextField
      id="user-fullName"
      v-model.trim="fullName"
      :value="fullName"
      :error="isFullNameError"
      :error-txt="fullNameErrorText"
      :placeholder="$t('form.full_name_contact')"
      class="modal__text-field"
    />
    <TextField
      id="user-phone_number"
      v-model.trim="phone_number"
      :value="phone_number"
      :error="isPhoneError"
      :error-txt="phoneErrorText"
      name="phone_number"
      type="number"
      :placeholder="$t('form.contact_phone')"
      class="modal__text-field"
    />
    <TextField
      id="user-name"
      v-model.trim="userName"
      :value="userName"
      :error="isUserNameError"
      :error-txt="userNameErrorText"
      :placeholder="$t('form.telegram_user_name')"
      class="modal__text-field"
    />

    <div class="modal__btns">
      <ButtonBase color="transparent" size="popular" @click.native="closeAll">
        {{ $t('buttons.dont_want') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        size="popular"
        @click.native="sendParentControlInfo"
      >
        <span v-if="!isLoader">{{ $t('buttons.subscribe') }}</span>
        <span v-else>
          <Loader color="white" size="sm" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import TextField from '../Inputs/TextField.vue';
import ButtonBase from '../Buttons/ButtonBase.vue';
import Modal from './Modal.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { required, email } from 'vuelidate/lib/validators';
import parentControlValidation from '@/mixins/validation/forms/parent_control.js';

export default {
  components: {
    ButtonBase,
    TextField,
    Loader,
  },
  mixins: [parentControlValidation],

  data() {
    return {
      phone_number: '',
      fullName: '',
      userName: '',

      serverErrors: {
        emailError: false,
      },

      isLoader: false,
    };
  },

  computed: {},

  methods: {
    async sendParentControlInfo() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.isLoader = true;
      let data = new FormData();
      data.append('full_name', this.fullName);
      data.append('phone_number', this.phone_number);
      data.append('telegram_username', this.userName);
      let res = this.$store.dispatch('sendSubmitParentControl', data);
      res && this.openNextModal();
      this.isLoader = false;
      // this.closeAll();
    },

    openNextModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'connection-code',
      });
    },

    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.modal__content_title
  margin-bottom: 50px
.modal__btns
  display: flex
  gap: 40px
</style>
