<!-- eslint-disable -->
<template>
  <div>
    <alert-error :errs="errs" />
    <alert-warning :warn="warns" />
    <alert-success :success="success"/>
    <router-view></router-view>
  </div>
</template>
<!-- eslint-enable -->

<script>
import { mapState } from "vuex";

export default {
  name: "configuration",
  computed: {
    ...mapState({
      errs: state => state.configuration.errors,
      warns: state => state.configuration.warnings,
      success: state => state.configuration.success,
    })
  }
}
</script>
