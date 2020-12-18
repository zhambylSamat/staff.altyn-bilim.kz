<template>
  <v-container v-if="success != null && Object.keys(success).length > 0">
    <v-row>
      <v-col cols='12'>
        <div style='position: fixed; z-index:210; width: 80%;'>
          <v-alert dense border="left" type='success'>
            <v-row>
              <v-col cols='12' sm='11' md='11'>
                <div class='caption'>{{ success }}</div>
              </v-col>
              <v-col cols='12' sm='1' md='1'>
                <v-btn color="white green--text text--lighten-1" fab small @click='removeSuccess'>
                  OK
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { REMOVE_SUCCESS_ACTION } from '@/store/actions.type.js';

export default {
  props: {
    success: {}
  },
  methods: {
    removeSuccess() {
      this.$store.dispatch(REMOVE_SUCCESS_ACTION);
    }
  }
}
</script>
