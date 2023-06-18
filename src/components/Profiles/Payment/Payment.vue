<template>
  <div>
    <StudentPayment v-if="getUserRole === 'student'" />
    <TeacherPayment v-else-if="getUserRole === 'teacher'" />
  </div>
</template>

<script>
import TeacherPayment from '@/components/Teacher/Profile/Payment/TeacherPayment.vue';
import StudentPayment from '@/components/Student/Profile/Payment/StudentPayment.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    StudentPayment,
    TeacherPayment,
  },

  computed: {
    ...mapGetters(['getUserRole']),
  },
};
</script>

<style lang="sass" scoped>
.cards_wrapper
  display: flex
  gap: 5%
  margin-bottom: 40px
  @include s
    margin-bottom: 24px

.cards_added
  position: relative
  display: flex
  flex-direction: column
  justify-content: space-between
  width: 100%
  max-width: 50%
  padding: 22px 20px 20px 20px
  background-color: var(--color-main)
  min-height: 220px
  border-radius: 12px
  color: white
  overflow: hidden
  border: 2px solid var(--color-white)

.circle_gradient,
.circle_gradient_big
  content: ''
  position: absolute
  right: -46px
  top: -170px
  width: 290px
  height: 260px
  border-radius: 50%
  background: linear-gradient(var(--color-white), rgba(255, 255, 255, .08))
  z-index: 0

.circle_gradient_big
  right: -15px
  top: 40px
  width: 460px
  height: 380px
  background: linear-gradient(-40deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, .1))

.cards_added__header
  display: flex
  justify-content: space-between

.header__owner
  font-size: 14px
  letter-spacing: 2px

.header__icons
  display: flex
  gap: 16px
  z-index: 2

.header__icons svg
  cursor: pointer

.cards_added__number
  display: flex
  gap: 26px

.number_value
  font-size: 26px

.value_star svg
  max-width: 44px

.cards_added__info
  display: flex
  justify-content: space-between

.info__left
  display: grid
  column-gap: 20px
  grid-template-columns: 1fr 1fr
  grid-template-rows: 1fr 1fr

.left__title
  font-size: 12px
  text-transform: uppercase
  letter-spacing: 2px
  color: rgba(255, 255, 255, .42)

.left__value
  font-size: 14px
  font-weight: 300
  letter-spacing: 2px

.left__star svg
  max-height: 14px

.card_type
  align-self: flex-end

.card_type svg
  max-width: 40px

.cards_add,
.cards_withdrawal
  min-height: 220px
  cursor: pointer
  width: 100%
  max-width: 50%
  background-color: rgba(255, 255, 255, 0.4)
  border-radius: 12px
  display: flex
  align-items: center
  justify-content: center

.cards_add__info
  display: flex
  flex-direction: column
  align-items: center
  gap: 12px

.cards_withdrawal
  position: relative
  overflow: hidden
  background-color: var(--color-white)
  flex-direction: column
  justify-content: space-between
  align-items: flex-start
  padding: 20px

.cards_withdrawal img
  position: absolute
  right: 0
  top: 0
  max-width: 45%

.cards_withdrawal__balance_number
  font-size: 36px
  font-weight: bold

.cards_withdrawal__balance_btn
  width: 200px

.cards_information
  display: flex
  flex-direction: column
  gap: 16px
  justify-content: center
  max-width: 50%

.card_notification
  position: relative
  background-color: var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 40px
  padding: 40px 0
  border-radius: 12px

.card_notification svg
  position: absolute
  left: 40px
  bottom: 0
  max-width: 77px
  max-height: 84px

.card_installments__title
  font-size: 24px

.card_history__title
  margin-bottom: 16px

.card_history__table_wrapper
  background-color: var(--color-white)
  margin-bottom: 40px

.card_history__table_header,
.card_history__table_content
  display: grid
  grid-template-columns: 22% 23% 20% 20% 15%
  padding: 20px 40px

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
