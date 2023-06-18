<template>
  <div class="balance-container">
    <div class="balance__content">
      <div class="balance__value">
        <h4 class="current_balance">
          {{ $t('buttons.balance_value') }}
          <p class="balance">{{ getBalance }}</p>
        </h4>
        <ButtonBase
          color="orange"
          size="popular"
          class="replenish_btn"
          @click.native="goToWithdrawal"
          >{{ $t('buttons.output') }}</ButtonBase
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  computed: {
    ...mapGetters(['getBalance']),
  },

  async mounted() {
    await this.getBalanceData();
  },

  methods: {
    async getBalanceData() {
      return this.$store.dispatch('getBalanceData');
    },
    async openReplenishCard() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'replenish-balance',
      });
    },
    goToWithdrawal() {
      this.$router.push({ name: 'withdrawal' });
    },
  },
};
</script>

<style lang="sass" scoped>
.school-courses
  .balance__content
    background-image: url(/images/school/balance-bg.png)

.pro-courses
  .balance__content
    background-image: url(/images/pro/balance-bg.png)

.balance__title
  @include adaptive-font-size(32, 28, 20)
  @include adaptive-line-height(40, 35, 25)
  margin-bottom: 16px

.balance__content
  width: 100%
  height: 164px
  background-repeat: no-repeat
  background-position: center
  background-size: cover
  border-radius: 12px
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 40px
  box-shadow: 0px 4px 4px 0px rgba(18, 50, 62, .04)
  @include m
    background-position: inherit
  @include s
    max-width: 935px
  @include xs
    height: 145px
  @include xxs
    background-color: white
    background-size: contain

.current_balance
  color: #12323E
  font-size: 18px
  font-weight: 400
  line-height: 23px
  display: flex
  flex-wrap: nowrap
  align-items: center
  @include xxs
    font-size: 14px

.balance
  font-size: 32px
  font-weight: 600
  line-height: 40px
  letter-spacing: 0em
  margin-left: 16px
  @include xs
    font-size: 26px
    margin-left: 8px
  @include xxs
    font-size: 20px
.balance__value
  @include xs
    padding-left: 50px
  @include xxs
    padding-left: 0

.replenish_btn
  margin: 20px auto 0 auto
  @include xs
    font-size: 14px
    margin-top: 10px
</style>
