<template>
  <div class="modal__content">
    <svg-icon :name="`smart_subscribe_${getCoursesMode}`" />
    <Heading level="4" class="unsubscribe__title"
      >{{ $t('titles.are_you_sure') }}
      <p class="unsubscribe__subtitle">
        {{ $t('titles.we_will_cry') }}
      </p></Heading
    >

    <div class="unsubscribe__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        :size="getWindowWidth > 640 ? 'popular' : 'max'"
        @click.native="closeAll"
        >{{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="orange"
        :size="getWindowWidth > 640 ? 'popular' : 'max'"
        :disabled="isLoader"
        @click.native="deleteStudentSubscription"
      >
        <span v-if="!isLoader">{{ $t('buttons.finish_btn') }}</span>
        <span v-else>
          <Loader color="white" size="small" />
        </span>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';

export default {
  components: {
    ButtonBase,
    Heading,
    Loader,
  },

  data() {
    return {
      userProfileData: {},

      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getWindowWidth',
    ]),
  },

  methods: {
    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
    async deleteStudentSubscription() {
      this.isLoader = true;
      let res = await this.$store.dispatch(
        `delete${this.getCoursesModeDispatch}StudentSubscription`
      );
      this.isLoader = res.error;
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.icon-smart_subscribe_school,
.icon-smart_subscribe_pro
  max-width: 53px
  max-height: 53px

.unsubscribe__title
  margin: 35px 0
  max-width: 400px

.unsubscribe__subtitle
  padding-top: 16px

.unsubscribe__btns
  display: flex
  justify-content: space-between
  gap: 40px
  flex-wrap: wrap
  @include xs
    width: 100%
    gap: 16px
</style>
