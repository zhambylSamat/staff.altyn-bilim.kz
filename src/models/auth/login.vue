<!-- eslint-disable -->
<template>
  <v-app id='login'>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card width='400' class='mx-auto mt-5'>
          <v-card-title>
            <h1 class='display-1'>Порталға кіру</h1>
          </v-card-title>
          <div>
            <v-alert dense text border="left" type='error' v-for="(value, key) in warns" :key="key"><div class='caption'>{{ key+1 }}. {{ value }}</div></v-alert>
            <!-- <v-alert dense text border='left' type='error'><div class='caption'></div></v-alert> -->
          </div>
          <v-card-text>
            <v-form ref='form' :model="form" @submit.prevent="onSubmit(form.username, form.password)">
              <v-text-field autocomplete="off"
                            autofocus
                            v-model="form.username"
                            label='Пайдаланушының аты (Username)'
                            prepend-icon="mdi-account-circle"
                            :rules="usernameRules"
                            ref="username"></v-text-field>
              <v-text-field v-model="form.password"
                            label='Құпия сөз'
                            :type="visibility ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="visibility = !visibility"
                            ref = "password"
                            :rules="passwordRules"></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="info" type='submit' :loading="submitLoading" :disabled="submitLoading">
                    Кіру
                  </v-btn>
                </v-card-actions>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import { LOGIN, SET_DEFAULT_ACTION } from "@/store/actions.type.js";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      visibility: false,
      submitLoading: false,
      form: {
        username: "",
        password: ""
      },
      usernameRules: [
        v => !!v || "Username өрісі міндетті!"
      ],
      passwordRules: [
        v => !!v || "Құпия сөз өрісі міндетті!"
      ]
    };
  },
  methods: {
    onSubmit(username, password) {
      this.$store.dispatch(SET_DEFAULT_ACTION)
      var credentials = {
        username: username,
        password: password
      };
      if (this.validate() || false) {
        this.submitLoading = true;
        this.$store.dispatch(LOGIN, credentials)
          .then(response => {
            if (response.status == 200) {
              this.$router.push({ name: "homePage" });
            } else if (response.status == 202) {
              this.$router.push({ name: "changePassword" });
            }
            this.submitLoading = false;
          });
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    }
  },
  computed: {
    ...mapState({
      warns: state => state.auth.warnings
    }),
    ...mapGetters(["currentUser"])
  }
};
</script>
<style>
.mu-demo-form {
  width: 100%;
}
.login-form-input {
  width: 100% !important;
}
</style>
