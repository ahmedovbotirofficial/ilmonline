<!-- <template>
  <div>
    <div class="list_title" @click="showChoosenFilters">
      {{ $t('header.level') }}
      <svg-icon name="icon_cross_orange" :class="showFilters ? 'rotate' : ''" />
    </div>

    <template v-if="showFilters">
      <div v-for="{ id, title, childs } in filtersData.levels" :key="id">
        <div class="level__select" @click="chooseMasterLevelFilter(id)">
          <div
            class="level__checkbox"
            :class="{ selected: selectedCheckBoxIds.includes(id) }"
          >
            <div
              v-if="selectedCheckBoxIds.includes(id)"
              class="level__checkbox--center"
            ></div>
          </div>
          <span>{{ title }}</span>
        </div>

        <div v-if="!!childs.length" class="filter_main_levels__child_wrapper">
          <div
            v-for="{ id, title } in childs"
            :key="id"
            class="filter_main_levels__child"
            :class="{ selected: filtersOfChildLevels.includes(id) }"
            @click="chooseLevelChildFilter(id)"
          >
            {{ title.split(' ')[0] }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template> -->

<script>
// import { mapGetters } from 'vuex';
// export default {
//   props: {
//     filtersData: {
//       type: Object,
//       default: () => {},
//     },
//     title: {
//       type: String,
//       default: '',
//     },
//   },

//   data() {
//     return {
//       showFilters: true,

//       selectedCheckBoxIds: [],

//       juniorLevels: [],
//       middleLevels: [],
//       oldestLevels: [],

//       filtersOfChildLevels: [],
//     };
//   },
//   computed: {
//     ...mapGetters(['getCoursesFilterStatus', 'getHeaderCoursesFilter']),
//   },
//   watch: {
//     getCoursesFilterStatus(value) {
//       if (value) {
//         this.selectedCheckBoxIds = [];
//         this.filtersOfChildLevels = [];
//       }
//     },

//     getHeaderCoursesFilter(value) {
//       // console.log(value);
//       if (value.headId === 'level') {
//         this.selectedCheckBoxIds = [];
//         this.filtersOfChildLevels = [];
//         this.chooseLevelChildFilter(value.id);
//       } else {
//         this.selectedCheckBoxIds = [];
//         this.filtersOfChildLevels = [];
//         this.$emit('select-level', this.filtersOfChildLevels);
//       }
//     },
//   },

//   mounted() {
//     this.juniorLevels = this.filtersData.levels
//       .map((el) => el.childs)[0]
//       .map((child) => child.id);
//     this.middleLevels = this.filtersData.levels
//       .map((el) => el.childs)[1]
//       .map((child) => child.id);
//     this.oldestLevels = this.filtersData.levels
//       .map((el) => el.childs)[2]
//       .map((child) => child.id);

//     if (this.getHeaderCoursesFilter) {
//       if (this.getHeaderCoursesFilter.headId === 'level') {
//         this.selectedCheckBoxIds = [];
//         this.filtersOfChildLevels = [];
//         this.chooseLevelChildFilter(this.getHeaderCoursesFilter.id);
//       }
//     }
//   },

//   methods: {
//     showChoosenFilters() {
//       this.showFilters = !this.showFilters;
//     },

//     chooseMasterLevelFilter(levelId) {
//       this.chooseLevelChildFilter(levelId);
//     },

//     chooseLevelChildFilter(levelId) {
//       if (levelId === 1 || levelId === 6 || levelId === 12) {
//         if (this.selectedCheckBoxIds.includes(levelId)) {
//           this.selectedCheckBoxIds = this.selectedCheckBoxIds.filter(
//             (el) => el !== levelId
//           );
//           if (levelId === 1) {
//             // console.log('this 1');
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.juniorLevels.includes(el)
//             );
//           }
//           if (levelId === 6) {
//             // console.log('this 6');
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.middleLevels.includes(el)
//             );
//           }
//           if (levelId === 12) {
//             // console.log('this 12');
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.oldestLevels.includes(el)
//             );
//           }
//         } else {
//           this.selectedCheckBoxIds.push(levelId);
//           if (levelId === 1) {
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.juniorLevels.includes(el)
//             );
//             this.filtersOfChildLevels.push(...this.juniorLevels);
//           }
//           if (levelId === 6) {
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.middleLevels.includes(el)
//             );
//             this.filtersOfChildLevels.push(...this.middleLevels);
//           }
//           if (levelId === 12) {
//             this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//               (el) => !this.oldestLevels.includes(el)
//             );
//             this.filtersOfChildLevels.push(...this.oldestLevels);
//           }
//         }
//       } else {
//         if (
//           this.juniorLevels.every((el) =>
//             this.filtersOfChildLevels.includes(el)
//           ) &&
//           this.juniorLevels.includes(levelId)
//         ) {
//           // console.log('this');
//           this.selectedCheckBoxIds = this.selectedCheckBoxIds.filter(
//             (el) => el !== 1
//           );
//         }
//         if (
//           this.middleLevels.every((el) =>
//             this.filtersOfChildLevels.includes(el)
//           ) &&
//           this.middleLevels.includes(levelId)
//         ) {
//           this.selectedCheckBoxIds = this.selectedCheckBoxIds.filter(
//             (el) => el !== 6
//           );
//         }
//         if (
//           this.oldestLevels.every((el) =>
//             this.filtersOfChildLevels.includes(el)
//           ) &&
//           this.oldestLevels.includes(levelId)
//         ) {
//           this.selectedCheckBoxIds = this.selectedCheckBoxIds.filter(
//             (el) => el !== 12
//           );
//         }
//         if (this.filtersOfChildLevels.includes(levelId)) {
//           this.filtersOfChildLevels = this.filtersOfChildLevels.filter(
//             (el) => el !== levelId
//           );
//         } else {
//           this.filtersOfChildLevels.push(levelId);
//           if (
//             this.juniorLevels.every((el) =>
//               this.filtersOfChildLevels.includes(el)
//             )
//           ) {
//             this.selectedCheckBoxIds.includes(1)
//               ? this.selectedCheckBoxIds
//               : this.selectedCheckBoxIds.push(1);
//           }
//           if (
//             this.middleLevels.every((el) =>
//               this.filtersOfChildLevels.includes(el)
//             )
//           ) {
//             this.selectedCheckBoxIds.includes(6)
//               ? this.selectedCheckBoxIds
//               : this.selectedCheckBoxIds.push(6);
//           }
//           if (
//             this.oldestLevels.every((el) =>
//               this.filtersOfChildLevels.includes(el)
//             )
//           ) {
//             this.selectedCheckBoxIds.includes(12)
//               ? this.selectedCheckBoxIds
//               : this.selectedCheckBoxIds.push(12);
//           }
//         }
//       }
//       this.$store.commit('clearCheckboxes', false);
//       this.$emit('select-level', this.filtersOfChildLevels);
//     },
//   },
// };
</script>

<style lang="sass" scoped>
// .level__select
//   display: flex
//   gap: 12px
//   align-items: center
//   margin-bottom: 16px
//   cursor: pointer

// .filter_main_levels__child_wrapper
//   display: flex
//   gap: 16px
//   margin-bottom: 24px

// .filter_main_levels__child
//   cursor: pointer
//   display: flex
//   align-items: center
//   justify-content: center
//   height: 40px
//   width: 40px
//   border: 1px solid var(--primary-font-color)
//   @media screen and (max-width: 1150px)
//     height: 36px
//     width: 36px
//     font-size: 14px

// .filter_main_levels__child:hover
//   border: 1px solid var(--color-orange)

// .filter_main_levels__child.selected
//   color: var(--color-orange)
//   border: 1px solid var(--color-orange)

// .filter_sidebar__list
//   display: flex
//   flex-direction: column

// .rotate
//   transform: rotate(180deg)
</style>
