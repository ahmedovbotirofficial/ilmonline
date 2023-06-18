<template>
  <v-dialog
    v-model="dialog"
    :content-class="contentClass"
    no-click-animation
    :persistent="isPersistent"
    @click:outside="close"
  >
    <v-card>
      <div class="dialog-content">
        <slot />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    isPersistent: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    contentClass() {
      return this.customClass
        ? `v-dialog--custom ${this.customClass}`
        : 'v-dialog--custom';
    },
  },
  methods: {
    close() {
      if (this.isPersistent) {
        return;
      }
      this.$emit('update:dialog', false);
    },
  },
};
</script>

<style lang="sass">
// .v-dialog.v-dialog--custom
//   box-shadow: 0px 32px 80px rgba(38, 55, 76, 0.3)
//   width: 650px

//   @media screen and (max-width: 1199px)
//     width: 100%
//     margin: 0

// .v-dialog.v-dialog--custom.v-dialog--wide
//   width: 815px

// .v-dialog__content
//   @media screen and (max-width: 1199px)
//     // align-items: flex-end!important

// .v-card
//   padding: 80px 110px
//   @media screen and (max-width: 1199px)
//     padding: 80px 0

// .dialog-content
//   max-width: 560px
//   margin: 0 auto
//   text-align: center

//   @media screen and (max-width:990px)
//     max-width: 560px

// .popup__title
//   margin: 0!important

// .popup__subtitle
//   font-size: 24px
//   line-height: 32px
//   color: var(--primary-color-dark-blue)
//   margin: 20px 0 45px 0

// .popup__clear-icon,
// .popup__logout-icon
//   margin-bottom: 22px

// .popup__clear-icon
//   display: flex
//   align-items: center
//   justify-content: center
//   margin-left: auto
//   margin-right: auto
//   height: 64px
//   width: 68px

//   .icon-cross
//     width: 32px
//     height: 32px

// .popup__logout-icon
//   .icon-logout
//     height: 40px
//     width: 36px

// .popup__buttons-box
//   display: flex
//   align-items: center
//   justify-content: space-between
//   gap: 32px

// .popup__icon
//   width: 200px
//   height: 170px
</style>
