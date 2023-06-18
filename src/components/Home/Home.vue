<template>
  <main class="main">
    <Header />
    <Content />
    <Footer />
  </main>
</template>

<script>
import Header from '@/components/Layout/Header/Header.vue';
import Content from '@/components/Layout/Content/Content.vue';
import Footer from '@/components/Layout/Footer/Footer.vue';

export default {
  components: {
    Header,
    Content,
    Footer,
  },
};
</script>

<style lang="sass" scoped>
.main
  height: 100%
  width: 100%
  background-color: var(--color-background)
  display: flex
  flex-direction: column
  justify-content: space-between
</style>
