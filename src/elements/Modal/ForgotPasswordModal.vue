<template>
  <div class="modal__content" @keyup.enter="sentEmailToResetPassword">
    <svg-icon name="lock" />
    <h2 class="modal__content_title">
      {{ $t('titles.get_password') }}
    </h2>
    <div class="modal__content_text">
      {{ $t('form.write_password') }}
    </div>
    <TextField
      id="user-email"
      v-model.trim="email"
      :value="email"
      :error="isEmailError"
      :error-txt="emailErrorText"
      :placeholder="'Email'"
      class="modal__text-field"
    />

    <div class="modal__btn">
      <ButtonBase
        color="orange"
        size="popular"
        @click.native="sentEmailToResetPassword"
      >
        <span v-if="!isLoader">{{ $t('buttons.send_btn') }}</span>
        <span v-else>
          <Loader color="white" size="small" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import TextField from '../Inputs/TextField.vue';
import ButtonBase from '../Buttons/ButtonBase.vue';
import Modal from '../Modal/Modal.vue';
import Loader from '@/elements/Loader/Loader.vue';
import fogotPassword from '@/mixins/validation/forms/fogot_password.js';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    TextField,
    Loader,
  },

  mixins: [fogotPassword],

  data() {
    return {
      email: '',

      serverErrors: {
        emailError: false,
      },

      isLoader: false,
    };
  },

  computed: {
    ...mapGetters(['getModalProps']),
  },

  mounted() {
    this.getModalProps ? (this.email = this.getModalProps) : '';
  },

  methods: {
    async sentEmailToResetPassword() {
      if (this.$v.email.$invalid) {
        this.$v.$touch();
        return;
      }
      let data = new FormData();
      data.append('email', this.email);
      this.isLoader = true;

      this.serverErrors = await this.$store.dispatch('resetPassword', data);
      this.isLoader = false;
      if (!this.serverErrors) {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `instructions-sent`,
          props: this.email,
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.svg-icon.icon-lock
  max-height: 52px
  max-width: 48px

.modal__btn
  width: 100%
  display: flex
  justify-content: center
</style>
