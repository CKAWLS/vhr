import { createStore } from 'vuex'

export default createStore({
  state: {
    routes: []
  },
  mutations: {
    initRoutes(state, payload){
      state.routes = payload
    }
  },
  actions: {
    initRoutes({commit}, payload){
      commit('initRoutes', payload)
    }
  },
  modules: {
  }
})
