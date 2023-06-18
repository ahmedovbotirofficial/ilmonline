<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="modal__content">
    <div class="modal__content_wrapper">
      <Heading
        level="4"
        class="modal__content_title"
        v-html="$t('titles.almost_target')"
      />
      <div class="chosen-destinations__wrapper">
        <div
          v-for="el in categoriesList"
          :key="el.id"
          class="chosen-destinations__block"
        >
          <svg-icon :name="getIConName(el.id)" class="direction_icons" />
          <p class="chosen-destinations__item">
            {{ $t(`${el.title}`) }}
          </p>
        </div>
      </div>
    </div>
    <div class="modal__btns">
      <ButtonBase
        :size="getWindowWidth > 630 ? 'popular' : 'max'"
        color="transparent"
        class="auth_form__sign_in_btn cansel_btn"
        @click.native="closeAll"
        >{{ $t('buttons.cansel') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        :size="getWindowWidth > 630 ? 'popular' : 'max'"
        :disabled="isLoader"
        class="auth_form__sign_in_btn"
        @click.native="updateStudentSubscription"
      >
        <span v-if="!isLoader">{{ $t('buttons.confirm') }}</span>
        <span v-else>
          <Loader color="white" size="small" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import Heading from '@/elements/Heading/Heading.vue';

import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Loader,
    Heading,
  },
  data() {
    return {
      categoriesList: [],

      allSubscribes: [],

      isLoader: false,
    };
  },
  computed: {
    ...mapGetters([
      'getModalProps',
      'getWindowWidth',
      'getCoursesModeDispatch',
    ]),
  },

  mounted() {
    this.allSubscribes = [
      ...this.getModalProps.existSubscribes,
      ...this.getModalProps.waitingSubscribes,
    ];
    this.fetchStudentCategory();
  },
  methods: {
    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
    getIConName(id) {
      if (this.allSubscribes.includes(id)) {
        return 'check';
      } else {
        return 'cross';
      }
    },
    async updateStudentSubscription() {
      this.isLoader = true;
      let normalizeData = this.getModalProps.waitingSubscribes.map((el) => {
        return {
          id: el,
        };
      });
      let data = {
        categories: normalizeData,
        isExistSubscribes: !!this.getModalProps.existSubscribes.length,
      };
      await this.$store.dispatch(
        `update${this.getCoursesModeDispatch}StudentSubscription`,
        data
      );
      this.$router.push({ name: 'smart_subscribe' });
      this.isLoader = false;
    },

    async fetchStudentCategory() {
      this.categoriesList = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}CoursesCategories`
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.modal
  @include xs
    height: auto

.modal__btn
  margin-bottom: 32px

.modal__content_title
  text-align: center

.chosen-destinations__block
  display: flex
  align-items: center
  margin-top: 10px
  cursor: pointer

.chosen-destinations__wrapper
  border: 1px solid rgba(150, 150, 150, 0.16)
  padding: 16px
  max-width: 345px
  margin: 0 auto
  @include xxs
    max-width: 320px

.chosen-destinations__item
  font-size: 15px
  line-height: 24px
  padding-left: 10px

// .modal__content_title
//   font-size: 24px
//   line-height: 32px

.modal__content
  text-align: start

.modal__btns
  display: flex
  gap: 40px
  margin-top: 48px
  @include xs
    width: 100%
    flex-wrap: wrap
    padding: 0 40px
    gap: 16px
  @include xxs
    padding: 0

.auth_form__sign_in_btn
  background: none

.cansel_btn
  border: 1px solid var(--color-main)

.icon-check
  max-width: 14px
  max-height: 14px
  fill: var(--color-success)

.direction_icons.icon-cross
  max-width: 12px
  max-height: 12px
  fill: var(--color-orange)
</style>
