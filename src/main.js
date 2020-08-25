import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import Loader from './components/app/Loader'
import './registerServiceWorker'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import localizeFilter from '@/filters/localize.filter'

import messagePlugin from '@/utils/message.plugin'
import titlePlugin from '@/utils/title.plugin'

import router from './router'
import store from './store'
import 'materialize-css/dist/js/materialize.min.js'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'

import tooltipDirective from '@/directives/tooltip.directive'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.component('Paginate', Paginate);
Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(titlePlugin);

Vue.filter('date', dateFilter);
Vue.filter('localize', localizeFilter);

Vue.filter('currencyFilter', currencyFilter);

Vue.directive('tooltip', tooltipDirective); 

Vue.component("Loader", Loader);

Vue.use(VueMeta);


const firebaseConfig = {
  apiKey: "AIzaSyCYfBdeiutgdn8PjYkxOGSKRgtjH9G1gHc",
  authDomain: "vue---crm.firebaseapp.com",
  databaseURL: "https://vue---crm.firebaseio.com",
  projectId: "vue---crm",
  storageBucket: "vue---crm.appspot.com",
  messagingSenderId: "127747514731",
  appId: "1:127747514731:web:a287943a91014363f66c2e"
};

firebase.initializeApp(firebaseConfig);

let app;

firebase.auth().onAuthStateChanged(()=>{
  if(!app){
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});


