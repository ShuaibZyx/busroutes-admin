import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var sessionState = JSON.parse(window.sessionStorage.getItem("state"));

export default new Vuex.Store({
  state: sessionState
    ? sessionState
    : {
        iscollapse: false,
      },
  getters: {},
  mutations: {
    setIscollapse(state, value) {
      state.iscollapse = value;
    },
  },
  actions: {},
  modules: {},
});
