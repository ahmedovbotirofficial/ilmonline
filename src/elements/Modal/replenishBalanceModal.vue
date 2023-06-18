<template>
  <div class="modal__content balance_replenishment">
    <h2 class="modal__content_title balance_replenishment__title">
      {{ $t('titles.balance_up') }}
    </h2>
    <h4 class="modal__content_text balance_replenishment__subtitle">
      {{ $t('titles.another_pay_methods') }}
    </h4>
    <ul v-if="!!getCardsList.length >= 1" class="card_list-short">
      <li
        v-for="(card, index) in getCardsList"
        :key="card.id"
        class="card_list-short--item"
      >
        <div class="radio-item">
          <input
            :id="card.id"
            v-model="picked"
            type="radio"
            :checked="index === 0"
            :value="card.id"
          />
        </div>
        <h2 class="card_number">{{ card.card_number }}</h2>
      </li>
    </ul>
    <TextField
      id="amount"
      v-model.trim="amount"
      :value="amount"
      :placeholder="$t('mainPage.amount')"
      type="number"
      name="amount"
      class="amount_input"
      :error="isAmountError"
      :error-txt="amountErrorText"
    />
    <div class="buttons_container">
      <ButtonBase color="transparent" size="popular" @click.native="closeAll">
        {{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        size="popular"
        :disabled="isLoader"
        @click.native="updateBalance"
      >
        <span v-if="!isLoader">{{ $t('buttons.send_btn') }}</span>
        <span v-else> <Loader color="white" size="small" /> </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import Loader from '@/elements/Loader/Loader.vue';
import amountValidation from '@/mixins/validation/forms/replenish.js';

export default {
  components: {
    ButtonBase,
    Loader,
  },
  mixins: [amountValidation],
  data() {
    return {
      amount: '',
      cardId: null,
      picked: '',
      amountError: false,
      isLoader: false,
    };
  },
  computed: {
    ...mapGetters(['getCardsList', 'getNotificationMessage']),
  },
  async mounted() {
    await this.$store.dispatch('getCardsList');
    if (this.getCardsList.length >= 1) {
      this.cardId = this.getCardsList[0].id;
      this.picked = this.cardId;
    }
  },
  methods: {
    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
    async updateBalance() {
      if (this.getCardsList.length >= 1) {
        if (this.$v.$invalid) {
          this.$v.$touch();
          return;
        }
        this.amountError = false;
        this.isLoader = true;
        await this.$store.dispatch('replenishBalance', {
          card_id: this.picked,
          amount: parseInt(this.amount),
        });
        this.isLoader = false;
        if (this.getNotificationMessage) {
          if (this.getNotificationMessage === 'success') {
            this.$store.dispatch('getPaymentHistoryData');
            this.$store.commit('SET_MODAL', {
              state: false,
            });
          } else {
            this.$store.commit('SET_MODAL', {
              state: true,
              name: `rejected-purchase`,
              props: {
                serverError: this.getNotificationMessage,
              },
            });
          }
        }
      } else {
        this.$store.commit('SET_MODAL', {
          state: false,
          name: 'replenish-balance',
        });
      }
    },
  },
};
</script>
<style lang="sass" scoped>
.school-courses
  ul .card_list-short--item:nth-child(odd)
    background-image: url(/images/or_bg_sm.png)

.pro-courses
  ul .card_list-short--item:nth-child(odd)
    background-image: url(/images/green_bg_sm.png)

ul .card_list-short--item:nth-child(even)
  background-image: url(/images/blue_bg_sm.png)

.balance_replenishment__title
  font-size: 24px
  line-height: 28px
  padding-top: 4px
  @include xs
    padding-bottom: 12px

.balance_replenishment__subtitle
  font-size: 18px
  line-height: 28px
  font-weight: 400
  padding-bottom: 40px
  @include xs
    padding-bottom: 32px

.amount_input
  max-width: 516px
  margin-bottom: 60px
  @include xs
    max-width: 100%
    width: 100%
    margin-bottom: 32px

ul .card_list-short--item
  width: 238px
  height: 71px
  background-position: center
  background-size: cover
  display: flex
  align-items: center
  justify-content: flex-start
  border-radius: 12px
  margin: 0
  padding: 0 24px
  @include xs
    max-width: 100%

ul .card_list-short--item:only-child
  width: 100%
  max-width: 100%

.radio-item input
  cursor: pointer

.card_list-short
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin-bottom: 32px
  width: 77%
  gap: 32px
  @include xs
    width: auto
    flex-direction: column
    justify-content: center
  @include xxs

.card_number
  font-size: 18px
  font-weight: 400
  line-height: 23px
  letter-spacing: 0em
  color: white
  margin-left: 16px

.svg-icon.icon-check_box
  max-height: 54px
  max-width: 64px

.svg-icon.icon-warn
  width: 16px
  fill: var(--color-font-light-dark)

.modal__btn
  margin-bottom: 32px

.modal__warn
  display: flex

.modal__warn_title
  font-size: 14px
  line-height: 24px
  color: var(--color-font-light-dark)
  padding-left: 8px

.buttons_container
  width: 77%
  display: flex
  justify-content: space-between
  @include xs
    width: 100%
    flex-wrap: wrap
    justify-content: center
    gap: 16px

.buttons_container button
  @include xs
    margin-bottom: 20px

.round
  position: relative

.round label
  background-color: transparent
  border: 1.5px solid white
  border-radius: 50%
  cursor: pointer
  height: 20px
  left: 0
  position: absolute
  top: 0
  width: 20px

.round label:after
  border: 2px solid var(--color-white)
  border-top: none
  border-right: none
  content: ""
  height: 6px
  left: 5px
  opacity: 0
  position: absolute
  top: 4px
  transform: rotate(-45deg)
  width: 8px

.round input[type="checkbox"]
  visibility: hidden

.round input[type="checkbox"]:checked + label:after
  opacity: 1
.modal__container_content
  width: 72%
.modal__content
  width: 100%
.text_field__container .text_field__label
  left: -95%
.card_list-short--item input
  width: 20px
  height: 20px
input[type="radio"]
  /* remove standard background appearance */
  -webkit-appearance: none
  -moz-appearance: none
  appearance: none
  /* create custom radiobutton appearance */
  display: inline-block
  width: 20px
  height: 20px
  padding: 4px
  /* background-color only for content */
  background-clip: content-box
  border: 1.5px solid white
  border-radius: 50%
input[type="radio"]:checked
  background-color: white
.card_list-short--item::after
  display: none
</style>
