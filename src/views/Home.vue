<!-- eslint-disable -->
<template>
  <div>
    <v-row align="center">
      <v-col class="text-center" cols="12" sm="12">
        <!-- <div v-if='!isAuthenticated'>
          <router-link :to="{ name: 'login' }">
            <v-btn color="primary">
              login / registartion
            </v-btn>
          </router-link>
        </div> -->
        <div> <!-- v-else -->
          here will be analytics
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<!-- eslint-enable -->

<script>
import { mapGetters } from "vuex";
// import { LOGOUT } from "@/store/actions.type.js";

export default {
  name: "home",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    // logout() {
    //   this.$store.dispatch(LOGOUT).then(() => {
    //     this.$router.push({ name: "login" });
    //   });
    // }
  }
};
</script>
