import Vue from 'vue'
import Router from 'vue-router'
import NewsAdd from '@/components/NewsAdd'
import NewsList from '@/components/NewsList'
import Chart from '@/components/Chart'
import UserList from '@/components/UserList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NewsList',
      component: NewsList
    },
    {
      path: '/NewsAdd',
      name: 'NewsAdd',
      component: NewsAdd
    },
    {
      path: '/Chart',
      name: 'Chart',
      component: Chart
    },
    {
      path: '/UserList',
      name: 'UserList',
      component: UserList
    }
  ]
})
