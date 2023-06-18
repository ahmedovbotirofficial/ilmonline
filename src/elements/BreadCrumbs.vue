<template>
  <div class="breadcrumbs_color" :class="breadBgColor">
    <div class="container">
      <div id="bread" class="breadcrumbs">
        <div
          v-for="(item, idx) in breadcrumb"
          :key="item.name"
          class="breadcrmubs_link"
          @click="goTo(item.name)"
        >
          <div
            v-if="!!item.label && item.label.includes('breadCrumbs')"
            class="item"
          >
            {{ $t(`${item.label}`) }}
          </div>
          <div v-else class="item">
            {{ item.label }}
          </div>

          <svg-icon
            v-if="idx !== breadcrumb.length - 1"
            name="next_arrow_bread"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getCurrentBreadLabel']),

    breadcrumb() {
      const breadcrumbFromRoute = this.$route.meta?.breadcrumb;
      if (!breadcrumbFromRoute) return;
      const { finders, initialState } = breadcrumbFromRoute;
      // console.log('breadcrumbFromRoute', breadcrumbFromRoute);
      const bread = finders?.length
        ? finders.map((finder) => {
            return {
              name: finder.name,
              ...this.createParamsAndQuery(finder),
            };
          })
        : [];
      bread.unshift(...initialState);
      // console.log('bread', bread);
      return bread;
    },
    breadBgColor() {
      if (
        this.$route.name === 'vacancy' ||
        this.$route.name.includes('test') ||
        this.$route.name.includes('quiz') ||
        this.$route.name.includes('education') ||
        this.$route.name.includes('trial') ||
        this.$route.name.includes('individual-task')
      ) {
        return 'white';
      } else {
        return '';
      }
    },
  },

  watch: {
    $route(to, from) {
      // console.log('watch route in bread', from);
    },
  },

  methods: {
    createParamsAndQuery(finder) {
      // console.log('finder', finder);

      const { params, query } = this.$route;

      const paramsMapped = finder.params.map((paramsString) => {
        return { [paramsString]: params[paramsString] };
      });
      return {
        params: Object.assign({}, ...paramsMapped),
        label: this.getCurrentBreadLabel[finder.label],
      };
    },

    goTo(name) {
      this.$router.push({ name: `${name}`, params: this.$route.params });
    },
  },
};
</script>

<style lang="sass" scoped>
.breadcrumbs_color.white
  background-color: var(--color-white)

.breadcrumbs
  cursor: pointer
  display: flex
  align-items: center
  flex-wrap: nowrap
  gap: 14px
  font-size: 14px
  font-weight: bold
  padding-bottom: 10px
  overflow-x: auto
  overflow-y: hidden
.breadcrumbs::-webkit-scrollbar
  @media only screen and (min-width: 1023px)
    display: none

.breadcrumbs::-webkit-scrollbar
  @media only screen and (min-width: 1024px)
    opacity: 0

.breadcrumbs__item
  margin-right: 14px
  color: var(--primary-font-color)

.breadcrmubs_link
  display: flex
  align-items: center
  gap: 15px
  white-space: nowrap

.breadcrumbs .svg-icon,
.breadcrmubs_link .svg-icon
  max-width: 11px

.breadcrmubs_link:hover,
.breadcrumbs__item-back:hover
  color: var(--color-main)

.breadcrmubs_link:last-child
  color: var(--color-font-light-dark)
  font-weight: normal

.breadcrumbs__item[disabled]
  font-weight: normal
  color: var(--color-font-light-dark)
</style>
