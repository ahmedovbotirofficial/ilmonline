<template>
  <div class="detail_card">
    <Heading level="4"> {{ $t('titles.card_detail') }} </Heading>
    <div class="detail_card__images">
      <svg-icon :name="`card_detail_img_${getCoursesMode}`" />
    </div>

    <div class="detail_card__user">
      <TextField
        :id="userFullName.id"
        :key="userFullName.id"
        v-model.trim="userFullName.value"
        :value="userFullName.value"
        :placeholder="$t(`form.${userFullName.placeholder}`)"
        :name="userFullName.placeholder"
        autocomplete="off"
        class="user_full_name"
        :empty-error="getEmptyErrorUserFullName"
        :error="getEmptyErrorUserFullName"
      />
      <TextField
        :id="userCardNumber.id"
        :key="userCardNumber.id"
        v-model.trim="userCardNumber.value"
        :value="userCardNumber.value"
        :placeholder="$t(`form.${userCardNumber.placeholder}`)"
        :name="userCardNumber.placeholder"
        autocomplete="off"
        :mask="'################'"
        :empty-error="getEmptyErrorUserCardNumber"
        :error="getEmptyErrorUserCardNumber"
        class="user_card_number"
      />
      <TextField
        :id="userExpireDate.id"
        :key="userExpireDate.id"
        v-model.trim="userExpireDate.value"
        :value="userExpireDate.value"
        :empty-error="getEmptyErrorUserExpireDate"
        :mask="'##/##'"
        :error="getEmptyErrorUserExpireDate"
        :placeholder="$t(`form.${userExpireDate.placeholder}`)"
        :name="userExpireDate.placeholder"
        autocomplete="off"
        class="user_expire_date"
      />
    </div>

    <div class="detail_card__check">
      <div class="level__select" @click="selectMainCard">
        <div class="level__checkbox" :class="{ selected: selectMainCard }">
          <div v-if="isMainCard" class="level__checkbox--center"></div>
        </div>
        <span> {{ $t('titles.card_main') }}</span>
      </div>
    </div>

    <div class="detail_card__btns">
      <ButtonBase
        color="transparent"
        size="popular"
        @click.native="cancelChanges"
        >{{ $t('buttons.cancelation_btn') }}</ButtonBase
      >
      <ButtonBase color="orange" size="popular" @click.native="saveCard">
        <span v-if="!isLoader"> {{ $t('buttons.save_btn') }}</span>
        <span v-else> <Loader color="white" size="small" /> </span
      ></ButtonBase>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { minLength, required } from 'vuelidate/lib/validators';

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
    TextField,
  },
  data() {
    return {
      userFullName: {
        id: 0,
        placeholder: 'full_name',
        value: '',
      },
      isLoader: false,
      userCardNumber: {
        id: 1,
        placeholder: 'card_number',
        value: '',
      },
      userExpireDate: {
        id: 3,
        placeholder: 'expire_date',
        value: '',
      },
      isMainCard: false,
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode', 'getTransitionId']),
    getEmptyErrorUserFullName() {
      return !!(
        this.$v.userFullName.value.$dirty &&
        !this.$v.userFullName.value.required
      );
    },
    getEmptyErrorUserCardNumber() {
      return !!(
        this.$v.userCardNumber.value.$dirty &&
        !this.$v.userCardNumber.value.required
      );
    },
    getEmptyErrorUserExpireDate() {
      return !!(
        this.$v.userExpireDate.value.$dirty &&
        !this.$v.userExpireDate.value.required
      );
    },
  },
  validations: {
    userFullName: {
      value: {
        required,
      },
    },
    userCardNumber: {
      value: {
        required,
        minLength: minLength(16),
      },
    },
    userExpireDate: {
      value: {
        required,
      },
    },
  },

  methods: {
    selectMainCard() {
      this.isMainCard = !this.isMainCard;
    },

    cancelChanges() {
      this.$router.push({ name: 'payment' });
    },

    async saveCard() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      let cardsData = {};
      cardsData.card_holder = this.userFullName.value;
      cardsData.card_number = this.userCardNumber.value;
      cardsData.card_expiry = this.userExpireDate.value;
      cardsData.is_main = this.isMainCard;
      this.isLoader = true;
      await this.$store.dispatch('addPaymentCard', cardsData);
      this.isLoader = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.detail_card
  display: flex
  flex-direction: column
  padding: 40px
  background-color: var(--color-white)
  @include s
    padding: 24px
  @include xxs
    padding: 24px 16px

.detail_card .title
  @include xxs
    margin-bottom: 16px

.detail_card__images
  display: flex
  justify-content: center
  gap: 6%
  margin: 16px 0 40px 0
  @include xxs
    margin: 4px 0 28px 0

.detail_card__images svg
  max-height: 135px
  max-width: 220px

.detail_card__user
  display: flex
  flex-wrap: wrap
  row-gap: 32px
  column-gap: 3%
  margin-bottom: 24px
  justify-content: space-between
  @include xxs
    row-gap: 28px

.user_full_name
  grid-column: 1/-1

.user_card_number
  width: 72%
  @include xxs
    width: 100%

.user_expire_date
  width: 25%
  @include xxs
    width: 100%

.detail_card__check
  max-width: 200px
  margin-bottom: 24px

.detail_card__btns
  display: flex
  justify-content: space-between
  @include xs
    flex-wrap: wrap
    gap: 16px
</style>
