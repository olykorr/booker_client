import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import EmpList from '@/components/EmpList'
import BookIt from '@/components/BookIt/'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/emplist',
      name: 'EmpList',
      component: EmpList
    },
    {
      path: '/bookit/:id/:time/:day/:month/:year',
      name: 'BookIt',
      component: BookIt
    }
  ]
})
