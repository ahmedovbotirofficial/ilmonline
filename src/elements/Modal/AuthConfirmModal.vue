<template>
  <div @click="$emit('close')" class="modal">
    <div @click.stop class="modal__content">
      <svg-icon name="mobile_confirm" />
      <Heading level="4" class="test_finish__title">{{
        $t('profilePage.confirm_phone_number')
      }}</Heading>
      <h4 class="confirm_text__mess">
        {{ $t('profilePage.confirm_phone_number__texts') }}
      </h4>
      <TextField
        id="confirmation-number"
        v-model="confirmationNumber"
        :value="confirmationNumber"
        placeholder="_ _ _ _ _"
        class="confirm__text-field"
        value-mask="numbers"
        :error="is_error"
        :error-txt="error_text"
        max-length="5"
        @focus="resetServerError('otp_number')"
      />
      <span
        :style="is_error ? 'margin-top: -20px' : 'margin-top: -30px'"
        class="time"
        v-if="time > 0"
        >{{ calcTime(time) }}</span
      >
      <ButtonBase
        v-if="time > 0"
        class="modal__btn"
        color="orange"
        size="popular"
        :disabled="confirmationNumber.length !== 5"
        @click.native="confirmPhone(confirmationNumber)"
        >{{ $t('buttons.confirm') }}
      </ButtonBase>
      <p
        @click="$emit('resend', 'tell'), (time = 60)"
        class="againsendCode"
        v-else
      >
        {{ $t('mix.resend_code') }}
      </p>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import { mapGetters } from 'vuex';
import confirmPhoneNumberValidation from '@/mixins/validation/forms/confirmPhoneNumber';
import { calcTimeHHMMSS } from '@/helpers/time.js';
import axios from 'axios';

export default {
  components: {
    ButtonBase,
    Heading,
    TextField,
  },

  props: {
    scroll: {
      type: Boolean,
      default: false,
    },
    user: {
      tye: Object,
      default: {
        name: '',
        phone: '',
        password: '',
        confirm_pass: '',
      },
    },
    token: {
      type: String,
      default: '',
    },
  },

  mixins: [confirmPhoneNumberValidation],

  data() {
    return {
      confirmationNumber: '',
      time: 60,
      is_error: false,
      error_text: '',
    };
  },

  mounted() {
    this.decreaseTime();
  },

  computed: {
    ...mapGetters(['getPaymentData', 'getTransitionId']),
  },

  methods: {
    confirmPhone(confimCode) {
      // axios({
      //   method: 'get',
      //   url: `https://my.ilmonline.uz/api/sms.php?code=${confimCode}&token=${this.user.token}&userfam=${this.user.name}&role=${this.user.role}&pacc=${this.user.password}`,
      //   headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'Access-Control-Allow-Credentials': true,
      //       'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      //       'Access-Control-Allow-Headers': 'http://localhost:8080',
      //   },
      //   data: data,
      //   timeout: 60 * 1000,
      // })
      // .then((res) => {
      //   console.log(res);
      // })
      // .catch((e) => {
      //   console.log(e);
      // });
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=d3a78d574e700c84d199d3707d1e0478');

      var formdata = new FormData();
      const lang = `${localStorage.getItem('multi_lang')}`
        .replace('"', '')
        .substring(0, 2);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `https://my.ilmonline.uz/api/sms.php?sms=${confimCode}&lang=${lang.substring(
          0,
          2
        )}&phone=${this.user.phone}&token=${this.user.token}&userfam=${
          this.user.name
        }&role=${this.user.role}&pacc=${this.user.password}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);

          if (res.result.javob == 'SMS noto`g`ri') {
            this.is_error = true;
            this.error_text = res.result.javob;
          } else {
            console.log('ok', res);
            this.logIn();
          }
        })
        .catch((error) => console.log('error', error));
    },

    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },

    calcTime(time) {
      return calcTimeHHMMSS(time);
    },

    decreaseTime() {
      setInterval(() => {
        this.time = this.time - 1;
      }, 1000);
    },

    async logIn() {
      console.log('sign in');

      const data = new FormData();

      data.append('email', this.user.phone);
      data.append('password', this.user.password);

      let res = await this.$store.dispatch('authorization', data);

      if (res.status === 200) {
        console.log('everything ok');
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.svg-icon.icon-mobile_confirm
  max-width: 53px
  max-height: 53px

.modal__content
  padding: 0 90px
  @include s
    padding: 0 74px
  @include xs
    padding: 0 16px

  &::v-deep
    .text_field__input
      text-align: center

    .text_field__placeholder
      left: 47%

.test_finish__title
  font-size: 26px
  line-height: 32px
  margin-top: 34px
  margin-bottom: 16px
  @include xs
    font-size: 24px
    margin-top: 32px
    margin-bottom: 12px

.confirm_text__mess
  @include adaptive-font-size(20, 20, 16)
  @include adaptive-line-height(28, 28, 24)
  font-weight: 400
  text-align: center
  margin-bottom: 32px
  @include xs
    margin-bottom: 24px

.confirm__text-field
  max-width: 185px
  margin-bottom: 40px
  @include xs
    margin-bottom: 32px
</style>

<style scoped>
/* body::-webkit-scrollbar {
    width: 0px;
  } */
.modal {
  z-index: 99999999999;
  position: fixed !important;
  top: -0px !important;
  left: -0%;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.526);
}

.modal__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 50%;
  padding: 16px;
  border-radius: 10px;
}

.time {
  margin-top: -30px;
  margin-bottom: 10px;
}

.againsendCode {
  color: #1b69c1;
  cursor: pointer;
}
</style>
