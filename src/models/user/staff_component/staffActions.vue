<template>
  <div style='position: relative; z-index: 1;'>
    <v-btn
      fab
      dark
      outlined
      x-small
      class='mx-1'
      color='info'
      @click.native='editProfile(item)'>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-icon v-on='on'>mdi-account-edit</v-icon>
        </template>
        <span>Анкетаны өзгерту</span>
      </v-tooltip>
    </v-btn>
  </div>
</template>


<script>

export default {
  props: ['item', 'edit_staff'],
  methods: {
    archive(pk) {
      if (confirm('Архивке жіберілуы керекпа?')) {
        console.log('archive', pk);
      }
    },
    editProfile(item) {
      this.edit_staff(item);
    }
  }
}
</script>