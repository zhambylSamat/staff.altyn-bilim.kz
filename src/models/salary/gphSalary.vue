<template>
  <div>ok</div>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  beforeCreate() {
    console.log('currentUser', this.currentUser);
  }
}
</script>
