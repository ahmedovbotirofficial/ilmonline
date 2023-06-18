<template>
  <div class="direction_card">
    <div class="direction_card__top">
      <img :src="testByDirectionsData.image" />
    </div>
    <div class="direction_card__bottom">
      <div class="direction_card__title">
        {{ testByDirectionsData.title }}
      </div>

      <div class="direction_card__btns">
        <ButtonBase
          color="transparent"
          size="max"
          @click.native.stop="openDescribeModal"
        >
          {{ $t('buttons.test_more') }}</ButtonBase
        >
        <ButtonBase
          color="orange"
          size="max"
          right-icon="card_arrow"
          @click.native.stop="
            openTestListByDirection(
              testByDirectionsData.id,
              testByDirectionsData.slug
            )
          "
        >
          {{ $t('buttons.start_test') }}</ButtonBase
        >
      </div>
    </div>
  </div>
</template>

<script>
// import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
export default {
  components: {
    // Heading,
    ButtonBase,
  },
  props: {
    testByDirectionsData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      title: null,
    };
  },
  methods: {
    openTestListByDirection(category_id, slug) {
      this.$router.push({
        name: 'trial-list',
        params: {
          direction: this.$route.params.direction,
          category_id: category_id,
          variant_list_name: slug,
        },
      });
    },
    openDescribeModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'trial-test-description',
        props: this.testByDirectionsData,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.direction_card
  background: var(--color-white)
  @include xxs
    margin-top: 30px
    justify-self: center

.direction_card__top
  background-color: #EBFBEC
  // padding: 20px 20px 0
  justify-content: center
  display: flex
  height: auto

.direction_card__top img
  height: auto
  // height: 160px
  object-fit: contain
  object-position: bottom

.direction_card__bottom
  padding: 16px 24px 24px
  border: 1px solid #D8D8D8
  border-top: none
  display: flex
  height: 242px
  flex-direction: column
  justify-content: space-between
  @include s
    height: auto
  @include xs
    height: 242px
  @include xxs
    height: auto

.direction_card__title
  font-size: 20px
  line-height: 28px
  font-weight: bold
  margin-bottom: 24px
  min-height: min-content

.direction_card__btns
  display: flex
  flex-direction: column
  gap: 24px

.direction_card__btns .button_wrapper
  width: 100%
</style>
