<template>
  <AuthRegistration />
</template>

<script>
import AuthRegistration from '@/components/Auth/AuthRegistration.vue';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

export default {
  components: {
    AuthRegistration,
  },

  data() {
    return {
      isLoader: false,
    };
  },

  methods: {
    async closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped></style>
