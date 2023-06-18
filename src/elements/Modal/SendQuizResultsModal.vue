<template>
  <div class="modal__content">
    <h2 class="modal__content_title">{{ $t('titles.want_share') }}</h2>
    <div class="modal_socials_block">
      <ShareNetwork
        network="telegram"
        :title="myResultInfoTelegram"
        :quote="myResultInfoTelegram"
        :url="backUrl"
      >
        <svg-icon name="telegram" />
      </ShareNetwork>
      <ShareNetwork
        network="facebook"
        :url="backUrl"
        :quote="myResultInfo"
        :title="myResultInfo"
        hashtags="ilm"
      >
        <svg-icon name="quiz_facebook" />
      </ShareNetwork>
      <ShareNetwork
        network="twitter"
        :url="backUrl"
        :title="myResultInfo"
        hashtags="ilm"
      >
        <!-- :twitter-user="'Yurii'" -->
        <svg-icon name="twitter" />
      </ShareNetwork>
    </div>

    <div class="auth_form__else">
      {{ $t('titles.or') }}
    </div>

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
      <ButtonBase
        color="transparent"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
        @click.native="closeAll"
      >
        {{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
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
import { mapGetters } from 'vuex';

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
    ...mapGetters(['getWindowWidth', 'getModalProps']),

    myResultInfo() {
      return `Мой результат: ${this.getModalProps}. Проверь свой:`;
    },

    myResultInfoTelegram() {
      return `Мой результат: ${this.getModalProps}. Проверь свой!`;
    },

    backUrl() {
      return process.env.VUE_APP_HOST + `/tests`;
    },

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
      data.append('pass_quiz_test_id', this.$route.params.quiz_passing_id);
      data.append('email', this.email);
      data.append('name', this.fullName);
      this.$store.dispatch('sendQuizTestResults', data);
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
  @media screen and (max-width: 640px)
    flex-wrap: wrap
    gap: 16px
    width: 100%

.modal_socials_block
  display: flex
  max-width: 300px
  width: 100%
  justify-content: center
  gap: 24px
  margin-bottom: 40px

.modal_socials_block svg
  max-width: 44px
  max-height: 44px

.auth_form__else
  position: relative
  font-size: 12px
  margin-bottom: 40px

  @include xs
    margin-bottom: 32px

.auth_form__else::after, .auth_form__else::before
  content: ''
  position: absolute
  top: 60%
  left: 35px
  width: 140px
  height: 1px
  background-color: rgba(18, 50, 62, 0.2)

  @include xxxs
    width: 100px

.auth_form__else::before
  right: 35px
  left: auto
</style>
