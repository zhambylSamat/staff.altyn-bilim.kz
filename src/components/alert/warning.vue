<template>
  <v-container v-if="warn != null && Object.keys(warn).length > 0">
    <v-row>
      <v-col cols='12'>
        <div style='position: fixed; z-index:210; width: 80%;'>
          <v-alert dense border="left" type='warning'>
            <v-row>
              <v-col cols='12' sm='11' md='11'>
                <!-- <div v-for="(value, key) in warn" :key="key" class='caption'>{{ key+1 }}. {{ value }}</div> -->
                <div class='caption'>{{ warn }}</div>
              </v-col>
              <v-col cols='12' sm='1' md='1'>
                <v-btn color="white red--text text--lighten-1" fab small @click='removeWarnings'>
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

import { REMOVE_WARNINGS_ACTION } from '@/store/actions.type.js';

export default {
  props: {
    warn: {}
  },
  methods: {
    removeWarnings() {
      this.$store.dispatch(REMOVE_WARNINGS_ACTION);
    }
  }
}
</script>
