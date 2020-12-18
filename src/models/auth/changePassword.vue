<!-- eslint-disable -->
<template>
  <v-app id='login'>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card width='400' class='mx-auto mt-5'>
          <v-card-title>
            <h1 class='display-1'>Құпия сөзді өзгерту</h1>
          </v-card-title>
          <div>
            <v-alert dense text border="left" type='error' v-for="(value, key) in errs" :key="key"><div class='caption'>{{ key+1 }}. {{ value }}</div></v-alert>
          </div>
          <v-card-text>
            <v-form ref='form' :model="form" @submit.prevent="onSubmit(form)">
              <v-text-field v-model="form.old_password"
                            label='Бастапқы құпия сөз'
                            :type="visibility ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="visibility = !visibility"
                            ref = "old_password"
                            :rules="newPasswordRules"></v-text-field>
              <v-text-field v-model="form.new_password"
                            label='Жаңа құпия сөз'
                            :type="visibility ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="visibility = !visibility"
                            ref = "new_password"
                            :rules="oldPasswordRules"></v-text-field>
              <v-text-field v-model="form.confirm_password"
                            label='Жаңа құпия сөзді қайталап енгізу'
                            :type="visibility ? 'text' : 'password'"
                            prepend-icon="mdi-lock"
                            :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="visibility = !visibility"
                            ref = "confirm_password"
                            :rules="confirmPasswordRules"></v-text-field>
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
import { CHANGE_PASSWORD } from "@/store/actions.type.js";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      visibility: false,
      submitLoading: false,
      form: {
        old_password: "",
        new_password: "",
        confirm_password: "",
        user: null,
      },
      oldPasswordRules: [
        v => !!v || ""
      ],
      newPasswordRules: [
        v => !!v || ""
      ],
      confirmPasswordRules: [
        v => !!v || ""
      ]
    };
  },
  methods: {
    onSubmit(form) {
      if (this.validate()) {
        this.submitLoading = true;
        this.$store
          .dispatch(CHANGE_PASSWORD, form)
          .then(response => {
            if (response.status == 200) {
              this.$router.push({ name: "homePage" });
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
      errs: state => state.auth.errors
    }),
    ...mapGetters(["isChangePassword", "currentUser"])
  },
  created: function() {
    if (!this.isChangePassword) {
      this.$router.push({ name: "login" });
    }
    this.form.user = this.currentUser.pk;
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
