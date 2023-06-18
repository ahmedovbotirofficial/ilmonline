<template>
  <AuthSignIn />
</template>

<script>
import AuthSignIn from '@/components/Auth/AuthSignIn.vue';

export default {
  components: {
    AuthSignIn,
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

<style lang="sass" scoped>
// .v-dialog:not(.v-dialog--fullscreen)
</style>
