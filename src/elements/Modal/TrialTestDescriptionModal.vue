<template>
  <div class="modal__content">
    <svg-icon name="trial_modal_icon" />
    <Heading level="4" class="modal__content_title">
      {{ getModalProps.title }}
    </Heading>
    <!-- <div class="tiral_modal__description">ddd</div> -->
    <div class="tiral_modal__description">
      <li>
        {{ $t('tests.test_count_info', { count: getModalProps.tests_count }) }}
      </li>
      <li>
        {{ $t('tests.test_count_result_info') }}
      </li>
    </div>
    <div class="tiral_modal__results">
      {{ $t('tests.test_max_results') }}
    </div>
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      right-icon="card_arrow"
      @click.native="startTest"
      >{{ $t('buttons.start_test') }}
    </ButtonBase>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Heading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['getModalProps']),
  },
  mounted() {},
  methods: {
    closeModal() {
      this.$store.commit('SET_MODAL', { state: false });
    },
    startTest() {
      this.$router.push({
        name: 'trial-list',
        params: {
          direction: this.$route.params.direction,
          category_id: this.getModalProps.id,
          variant_list_name: this.getModalProps.slug,
        },
      });
      this.closeModal();
    },
  },
};
</script>

<style lang="sass" scoped>
li
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px
  list-style: none
  @include xxs
    font-size: 14px

li::after
  position: absolute
  content: ''
  background-color: var(--color-main)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.modal__content
  padding: 0 90px
  text-align: left
  @include xs
    padding: 0 24px
  @include xxs
    padding: 0 16px

.svg-icon.icon-trial_modal_icon
  max-height: 54px
  max-width: 40px

.tiral_modal__description
  display: flex
  flex-direction: column
  gap: 20px
  font-size: 18px
  line-height: 24px
  margin-bottom: 16px
  @include xxs
    gap: 0px

.tiral_modal__results
  font-size: 18px
  font-weight: bold
  align-self: flex-start
  margin-bottom: 40px
  @include xxs
    font-size: 14px
</style>
