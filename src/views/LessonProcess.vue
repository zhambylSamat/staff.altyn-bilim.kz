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
  name: "lessonProcess",
  computed: {
    ...mapState({
      errs: state => state.groupLesson.errors,
      warns: state => state.groupLesson.warnings,
      success: state => state.groupLesson.success,
    })
  }
}
</script>
