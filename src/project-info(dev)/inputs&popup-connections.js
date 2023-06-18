// ------------------------Popup------------------------

// <button @click.native="openModal">Open modal</button>
// <Popup :dialog.sync="modal">
//   <p>
//     Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
//     amet iusto laboriosam quibusdam sint, quasi a obcaecati unde
//     expedita modi! Consequuntur dolore in accusamus ut illum deleniti
//     consectetur. Esse corrupti voluptate ea nemo aut repudiandae ullam
//     eos eligendi minima sunt ex deleniti eaque laboriosam soluta nulla,
//     culpa iure similique voluptatem.
//   </p>
// </Popup>

// import Popup from '@/elements/Popup/Popup.vue';

// components: {
//   Popup,
// },
// data() {
//   return {
//     modal: false,
//   }
// }

// methods: {
//   openModal() {
//     this.modal = true;
//   },
// },

// ------------------------SelectField------------------------

// <SelectField v-model="selected" :items="items" />

// import SelectField from '@/elements/Inputs/SelectField.vue';

// components: {
//   SelectField,
// },
// data() {
//   return {
//     selected: '',
//     items: [
//       {
//         text: 'Item 1',
//       },
//       {
//         text: 'Item 2',
//       },
//       {
//         text: 'Item 3',
//       },
//       {
//         text: 'Item 4',
//       },
//       {
//         text: 'Item 5',
//       },
//     ],
//   }
// }

// ------------------------CountField------------------------

// <CountField
//   v-model.number="passengersCount"
//   @decrement="passengersCount--"
//   @increment="passengersCount++"
// />

// import CountField from '@/elements/Inputs/CountField.vue';

// components: {
//   CountField,
// },
// data() {
//   return {
//     passengersCount: 1,
//   }
// }

// ------------------------MultipleField------------------------

// <MultipleField v-model="carNumber" :items="countries" />

// import MultipleField from '@/elements/Inputs/MultipleField.vue';

// components: {
//   MultipleField,
// },
// data() {
//   return {
//     countries: [
//       {
//         isoCode: 'ua',
//         name: 'Україна',
//       },
//       {
//         isoCode: 'ru',
//         name: 'Росія',
//       },
//       {
//         isoCode: 'de',
//         name: 'Німеччина',
//       },
//       {
//         isoCode: 'tur',
//         name: 'Туреччина ',
//       },
//       {
//         isoCode: 'pl',
//         name: 'Польша',
//       },
//     ],
//     carNumber: {
//       country: {
//         isoCode: 'ua',
//         name: 'Україна',
//       },
//       value: '',
//     },
//   }
// }

// computed: {
//   formattedCarNumber() {
//     return `${this.carNumber.country.isoCode.toUpperCase()}: ${
//       this.carNumber.value
//     }`;
//   },
// },
