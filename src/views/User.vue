<!-- eslint-disable -->
<template>
  <v-app>
    <alert-error :errs="errs" />
    <alert-warning :warn="warns" />
    <alert-success :success="success"/>
    <router-view></router-view>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "user",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    ...mapState({
      errs: state => state.user.errors,
      warns: state => state.user.warnings,
      success: state => state.user.success,
    }),
    ...mapState({
      errs: state => state.materials.errors,
      warns: state => state.materials.warnings,
      success: state => state.materials.success,
    }),
    ...mapState({
      errs: state => state.groupLesson.errors,
      warns: state => state.groupLesson.warnings,
      success: state => state.groupLesson.success,
    })
  }
}
</script>
