import Vue from 'vue'
import Router from 'vue-router'
import Calendar from '@/components/Calendar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:lang?',
      name: 'Calendar',
      component: Calendar
    }
  ]
})
