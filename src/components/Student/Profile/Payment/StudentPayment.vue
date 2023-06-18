<template>
  <div class="profile_main">
    <div class="profile_payment">
      <Balance />
      <Heading level="4" class="profile_payment__title">{{
        $t('profilePage.payment_title')
      }}</Heading>
      <div class="cards_wrapper">
        <div class="cards_information">
          <CardsList v-if="getCardsList" :cards-list="getCardsList" />
        </div>
      </div>
    </div>

    <div class="card_notification">
      <svg-icon name="card_installments" />
      <Heading level="5" class="card_installments__title">
        {{ $t('profilePage.title_installments') }}
      </Heading>
    </div>

    <div class="card_history">
      <Heading level="5" class="card_history__title">
        {{ hisoryTableTitle }}
      </Heading>
      <PaymentHistory />
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import Balance from './Balance.vue';
// import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import PaymentHistory from './PaymentHistory.vue';
import CardsList from './CardsList.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    // ButtonBase,
    Balance,
    PaymentHistory,
    CardsList,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getCardsList']),

    hisoryTableTitle() {
      return this.$t('profilePage.payment_card_history');
    },
  },

  async mounted() {
    await this.$store.dispatch('getCardsList');
  },

  methods: {},
};
</script>

<style lang="sass" scoped>
.cards_wrapper
  display: flex
  gap: 5%
  margin-bottom: 40px
  @include s
    margin-bottom: 24px

.cards_information
  display: flex
  flex-direction: column
  gap: 16px
  justify-content: center
  width: 100%

.card_notification
  position: relative
  background-color: var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 40px
  padding: 40px 0
  border-radius: 12px
  @include xs
    margin-bottom: 32px
    padding: 35px 0
  @include xxs
    margin-bottom: 27px
    padding: 25px 0

.card_notification svg
  position: absolute
  left: 40px
  bottom: 0
  max-width: 77px
  max-height: 84px
  @include xs
    max-width: 60px
  @include xxs
    max-width: 45px
    max-height: 75px
    left: 25px

.card_installments__title
  @include adaptive-font-size(24, 24, 16)
  @include adaptive-line-height(30, 30, 20)
  @include xxxs
    max-width: 200px
    padding-left: 25px

.profile_payment__title,
.card_history__title
  @include adaptive-font-size(32, 28, 20)
  @include adaptive-line-height(40, 35, 25)
  margin-bottom: 16px

.card_history__table_wrapper
  background-color: var(--color-white)
  margin-bottom: 40px

.card_history__table_header,
.card_history__table_content
  display: grid
  grid-template-columns: 22% 23% 20% 20% 15%
  padding: 20px 40px
  @include xs
    grid-template-columns: 5% 37% 25% 17% 20%
  @include xxs
    grid-template-columns: 0% 22% 16% 11% 2% 0
    gap: 5%

.card_history__table_header
  border-bottom: 2px solid rgba(150, 150, 150, 0.2)

.card_history__table_header.teacher,
.card_history__table_content.teacher
  grid-template-columns: 2% 33% 20% 16% 21%
  gap: 2%

.header__title,
.content__value
  display: flex
  align-items: center
  @include xs
    font-size: 14px
  @include xxs
    max-width: 150px

.content__value.circle_avg
  justify-content: center

.header__title
  max-width: 160px
  opacity: 0.5
  font-size: 14px

.card_history__table_content
  padding: 20px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)

.content__value.title
  font-weight: bold
  font-size: 16px

.content__value.orange_title
  color: #39A455
  font-weight: bold

.content__value.amount
  color: #39A455
</style>
