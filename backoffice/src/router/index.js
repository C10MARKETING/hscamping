import Vue from 'vue'
import Router from 'vue-router'
import Activities from '@/components/Activities'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:login/:key',
      name: 'Activities',
      component: Activities
    }
  ]
})
