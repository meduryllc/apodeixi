import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import HealthOrg from './views/HealthOrg'
import HealthWorker from './views/HealthWorker'
import ViewDID from './views/ViewImmPass'
import Home from './views/Home'
import FirstPage from './views/FirstPage'
import ImmPass from './views/requestImmPass'
import Validate from './views/validateImmPass'
import Issue from './views/issueImmPass'
import Reject from './views/rejectImmPass'
import WorkerView from './views/healthWorkerView'
import IndividualView from './views/individualView'
import Register from './views/Register'
import Pass from './views/ViewImmPass'
import ViewRequests from './views/viewPending'
import Pending from './views/PendingRequests'
import Present from './views/present'
import Verify from './views/verify'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'first',
      component: FirstPage
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    
    {
      path: '/request',
      name: 'request',
      component: ImmPass,  
    },
    {
      path: '/validate',
      name: 'validate',
      component: Validate
    },
    
    {
      path: '/workerview',
      name: 'workerview',
      component: WorkerView
    },
    {
      path: '/individual',
      name: 'individual',
      component: IndividualView
    },
    
    {
      path:'/pending',
      name: 'pending',
      component: ViewRequests
    },
    
    {
      path: '/present',
      name: 'present',
      component: Present
    },
    {
      path: '/verify',
      name: 'verify',
      component: Verify
    }
    
    
  ]
});
