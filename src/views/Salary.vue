<!-- eslint-disable -->
<template>
  <v-app>
    <alert-error :errs="errs" />
    <alert-warning :warn="warns" />
    <alert-success :success="success"/>
    <router-view v-if='isAuthenticated'></router-view>
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
  }
}
</script>
