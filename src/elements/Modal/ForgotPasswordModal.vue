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
      filled 
      prefix="+998"
      mask="+998#########"
      maxlength="9"
      :error="email_error"
      :error-txt="email_errot_text"
      :placeholder="'Telefon raqami'"
      class="modal__text-field"
    />

    <div class="modal__btn">
      <ButtonBase
        color="orange"
        size="popular"
        :class="isDisabled"
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
      email: '+998',
      email_error: false,
      email_errot_text: '',

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
      // if (this.$v.email.$invalid) {
      //   this.$v.$touch();
      //   return;
      // }
      const data = {
        phone: this.email,
      };

      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=d3a78d574e700c84d199d3707d1e0478");

      var formdata = new FormData();

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch(`https://my.ilmonline.uz/api/sms.php?z=${data.phone}`, requestOptions)
        .then(response => response.text())
        .then(result => {
           const res = JSON.parse(result)
          if(res.result.status == 'ok'){
            this.email_error = false
            this.email_errot_text = ''
            this.$store.commit('SET_MODAL', {
          state: false,
          name: `verification`,
          props: { email: this.email, isResentPassword: true },
        });
          }else{
            this.email_error = true
            this.email_errot_text = 'Nimadir xato ketdi, tekshiring va qaytadan urining.'
          }
        })
        .catch(error => console.log('error', error));

        
      // let data = new FormData();
      // data.append('phone', this.email);
      // this.isLoader = true;

      // this.serverErrors = await this.$store.dispatch('resetPassword', data);
      // this.isLoader = false;
      // if (!this.serverErrors) {
      //   this.$store.commit('SET_MODAL', {
      //     state: true,
      //     name: `instructions-sent`,
      //     props: this.email,
      //   });
      // }
    },
  },

  computed: {
    isDisabled(){
      if(this.email.length == 13)
       return ''
      else
       return 'disable'
    }
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


<style scoped>
.disable {
  opacity: 0.6 !important;
  pointer-events: none;
}
</style>