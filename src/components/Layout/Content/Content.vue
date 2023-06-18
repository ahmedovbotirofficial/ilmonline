<template>
  <div class="content">
    <BreadCrumbs v-if="isShowBreadCrumbs" />
    <router-view />
  </div>
</template>

<script>
import BreadCrumbs from '@/elements/BreadCrumbs.vue';
export default {
  components: {
    BreadCrumbs,
  },
  computed: {
    isShowBreadCrumbs() {
      return !!this.$route.meta.breadcrumb;
    },
  },
  mounted() {},
};
</script>

<style lang="sass" scoped>
.content
   //position: relative
</style>
