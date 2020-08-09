import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
  state: {
    loggedIn: false,
    identity: ''
  },
  mutations: {
    loginStatus(state, status) {
      state.loggedIn = status;
    },
    Identity(state, status){
      state.identity = status;
    }
  },
  getters: {
    loggedIn: state => state.loggedIn,
    actor: state => state.identity
  },
  actions: {}
});
