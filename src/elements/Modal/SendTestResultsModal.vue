<template>
  <div class="modal__content">
    <h2 class="modal__content_title">{{ $t('titles.want_share') }}</h2>
    <TextField
      id="user-fullName"
      v-model.trim="fullName"
      :value="fullName"
      :empty-error="getEmptyErrorFullName"
      :placeholder="$t('form.name')"
      class="modal__text-field"
    />
    <TextField
      id="user-email"
      v-model.trim="email"
      :value="email"
      :empty-error="getEmptyErrorEmail"
      :invalid-email-message="getInvalidEmail"
      :placeholder="'Email'"
      class="modal__text-field"
    />

    <div class="modal__btns">
      <ButtonBase color="transparent" size="popular" @click.native="closeAll">
        {{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        size="popular"
        @click.native="sentEmailToResetPassword"
      >
        <span v-if="!isLoader">{{ $t('buttons.send_btn') }}</span>
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
import Modal from '../Modal/Modal.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { required, email } from 'vuelidate/lib/validators';

export default {
  components: {
    ButtonBase,
    TextField,
    Loader,
  },
  // mixins: [validate],

  validations: {
    email: {
      required,
      email,
    },
    fullName: {
      required,
    },
  },

  data() {
    return {
      email: null,
      fullName: null,

      serverErrors: {
        emailError: false,
      },

      isLoader: false,
    };
  },

  computed: {
    getEmptyErrorFullName() {
      return !!(this.$v.fullName.$dirty && !this.$v.fullName.required);
    },
    getEmptyErrorEmail() {
      return !!(this.$v.email.$dirty && !this.$v.email.required);
    },
    getInvalidEmail() {
      return !!(this.$v.email.$dirty && !this.$v.email.email && this.email);
    },
  },

  methods: {
    async sentEmailToResetPassword() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.isLoader = true;
      let data = new FormData();
      data.append('pass_trial_test_id', this.$route.params.try_id);
      data.append('email', this.email);
      data.append('name', this.fullName);
      this.$store.dispatch('sendMyTrialTest', data);
      this.isLoader = false;
      this.closeAll();
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
