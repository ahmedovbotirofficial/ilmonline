<template>
  <div class="cards_list">
    <div
      v-for="card in cardsList"
      :key="card.id"
      class="card_item"
      :class="{ main: card.is_main }"
    >
      <span v-if="card.is_main" class="main-item">
        <svg-icon name="check-btn" />
      </span>
      <div class="card_topbar">
        <h4>{{ card.card_holder }}</h4>
        <button @click="deleteCard(card.id)">
          <svg-icon name="delete_card" />
        </button>
      </div>
      <h4 class="card__number">{{ card.card_number }}</h4>
      <h3 class="expire_date">
        <p class="expire">expire</p>
        <span>{{ card.card_expiry }}</span>
      </h3>
    </div>
    <div class="add__card" @click="addCard">
      <div class="cards_add">
        <div class="cards_add__info">
          <svg-icon name="card_plus" />
          {{ $t('profilePage.payment_add_card') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardsList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},

  mounted() {},

  methods: {
    async deleteCard(id) {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'delete-card',
        props: { id },
      });
      // await this.$store.dispatch('deleteCard', id);
    },
    addCard() {
      this.$router.push({ name: 'payment-add-card' });
    },
  },
};
</script>
<style lang="sass" scoped>
.cards_list
  display: flex
  flex-wrap: wrap
  gap: 30px 50px
  @include m
    gap: 24px
  @include xxs
    flex-direction: column
  .card_item
    height: 220px
    cursor: pointer
    background-position: center
    background-size: cover
    box-shadow: 0px 4px 4px 0px rgba(18, 50, 62, .04)
    border-radius: 12px
    padding: 22px 20px
    color: white
    @include s
      height: 195px
    @include xxs
      padding: 12px
      height: 180px

.card_item::after
  display: none

.cards_list li::after
  display: none

.card_item,
.add__card
  flex: 0 0 calc(50% - 25px)
  @include m
    flex: 0 0 calc(50% - 12px)
  @include xxs
    flex: 0 0 auto
    width: 100%

.add__card
  cursor: pointer
  height: 220px
  background: rgba(255, 255, 255, 0.4)
  border: 2px dashed var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  border-radius: 12px
  margin-left: 0
  @include s
    height: 195px
  @include xs
    width: 100%
  @include xxs
    height: 180px

.add__card:hover
  border: 2px dashed var(--color-main)

.cards_add__info
  display: flex
  flex-direction: column
  align-items: center
  gap: 12px

.school-courses
  .cards_list .card_item:nth-child(odd)
    background-image: url(/images/orange_bg.png)

.pro-courses
  .cards_list .card_item:nth-child(odd)
    background-image: url(/images/green_bg.png)

.cards_list .card_item
  margin-left: 0
.cards_list .card_item:nth-child(even)
  background-image: url(/images/blue_bg.png)

.card_topbar
  display: flex
  justify-content: space-between
  margin-bottom: 56px
  @include s
    margin-bottom: 30px
  h4
    font-size: 14px
    font-weight: 400
    line-height: 18px

.card__number
  font-size: 26px
  font-weight: 400
  line-height: 33px
  @include xs
    font-size: 22px

.expire
  font-size: 12px
  line-height: 15px
  margin-bottom: 4px
  opacity: 0.48

.expire_date
  margin-top: 30px
  font-size: 12px
  font-style: normal
  font-weight: 400
  text-transform: uppercase
  @include s
    margin-top: 15px
  span
    display: block
    opacity: 1
    font-size: 14px

.cards_add__info
  display: flex
  flex-direction: column
  align-items: center
  gap: 12px

.main
  border: 2px solid white
  position: relative

.main-item
  border-radius: 50%
  display: block
  position: absolute
  top: -18px
  right: -18px
  @include s
    top: -14px
    right: -14px
  @include xxs
    top: -10px
    right: -10px

.main-item svg
  max-width: 40px
  max-height: 40px
  @include s
    max-width: 32px
    max-height: 32px
    @include xxs
      max-width: 24px
      max-height: 24px
</style>
