import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "@/store/auth.module.js";
import app from '@/store/modules/app/module.js';
import user from "@/store/user.module.js";
import materials from "@/store/materials.module.js";
import groupLesson from "@/store/group_lesson.module.js";
import configuration from "@/store/configuration.module.js";
// import groupLesson from "@/store/group_lesson.module.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    user,
    materials,
    groupLesson,
    configuration
  },
  plugins: [createPersistedState()]
});
