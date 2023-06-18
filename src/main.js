import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import SvgIcon from '@/elements/SvgIcon';
import vClickOutside from 'v-click-outside';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';
import Heading from './elements/Heading/Heading.vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import ButtonBase from '@/elements/Buttons/ButtonBase';
import VueEllipseProgress from 'vue-ellipse-progress';
import TextField from '@/elements/Inputs/TextField.vue';
import VueMask from 'v-mask';
import VueSocialSharing from 'vue-social-sharing';
import VueGtag from 'vue-gtag';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';

// import VueScrollmagic from 'vue-scrollmagic'
Vue.config.productionTip = false;
Vue.use(VueMask);
Vue.use(Vuelidate);
Vue.use(VueAwesomeSwiper);
Vue.use(VueEllipseProgress);
Vue.use(VueSocialSharing);

Vue.component('svg-icon', SvgIcon);
Vue.component('Paginate', Paginate);
Vue.component('Heading', Heading);
Vue.component('ButtonBase', ButtonBase);
Vue.component('TextField', TextField);
// Vue.use(VueScrollmagic)
Vue.use(VueGtag, {
  config: { id: 'G-KSV9F1K6DY' },
});
Vue.use(vClickOutside);

Sentry.init({
  Vue,
  logError: true,
  release: 'ILM Online',
  environment: 'dev',
  // environment: 'production',
  dsn: 'https://c1adfb6c7e4e4c0d96a04c826e77f015@o1295931.ingest.sentry.io/6522122',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [
        'localhost',
        'ilm.devbazu.com',
        'api.ilm.devbazu.com',
        'pro.ilm.devbazu.com',
        'ilmonline.uz',
        'pro.ilmonline.uz',
        /^\//,
      ],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
