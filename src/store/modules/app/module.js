import { set, toggle } from '@/utils/vuex'

const mutations = {
  setDrawer: set('drawer'),
  toggleDrawer: toggle('drawer')
};

const state = {
  drawer: true
};

export default {
  state,
  mutations
}