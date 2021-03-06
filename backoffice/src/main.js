// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import Firebase from 'firebase'
import VueFlatpickr from 'vue-flatpickr'
import './assets/flatpickr.css'
import * as moment from 'moment'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(VueFlatpickr)

Vue.filter('localizeDate', function (date) {
    let d = moment(date);
    d.locale('da');

    let dayOfWeek = d.format('dddd');
    let stringDate = d.format('LL');

    return dayOfWeek + ", " + stringDate;
})
Vue.filter('localizeDateSimple', function (date) {
    let d = moment(date);
    d.locale('da');

    let stringDate = d.format('LL');

    return stringDate;
})
Vue.filter('minutesToTimeOfDay', function (minutes) {
    return moment.utc().startOf('day').add(minutes, 'minutes').format("HH:mm")
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})