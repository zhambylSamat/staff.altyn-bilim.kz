<!-- eslint-disable -->
<template>
  <v-row justify='center'>
    <v-dialog v-model="openStudentForm" persistent max-width='60%'>
      <v-card>
        <v-card-title>
          <span class='headline'>Оқушының анкетасы</span>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeStudentFormDialog">X</v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref='form' :model="form" @submit.prevent="onSubmit(form)">
            <v-container>
              <v-row>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.user.last_name" dense label='Тегі' :readonly="is_readonly" :rules="firstNameRules"></v-text-field>
                  <v-text-field v-model="form.user.first_name" dense label='Аты' :readonly="is_readonly" :rules="lastNameRules"></v-text-field>

                  <v-menu
                    ref='menu'
                    v-model='menu'
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="computedDateFormatted"
                        label='Туылған күні'
                        :rules="dobRules"
                        prepend-icon="mdi-calendar-month-outline"
                        hint="ДД.ММ.ГГГГ"
                        readonly
                        v-on="on"></v-text-field>
                    </template>
                    <v-date-picker
                      ref='picker'
                      v-model="form.student.dob"
                      :max="new Date().toISOString().substr(0,10)"
                      min="1980-01-01"
                      :first-day-of-week="1"
                      locale="ru"
                      :readonly="is_readonly"
                      @change="save"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm='6' md='6'>
                  <v-text-field v-model="form.user.username" dense label='Username' :readonly="is_readonly" :rules="usernameRules"></v-text-field>
                  <v-select
                    :items="certificates"
                    label='Аттестат'
                    item-text="title"
                    item-value="key"
                    :rules="certificateRules"
                    dense
                    :readonly="is_readonly"
                    v-model="form.student.certificate" requried></v-select>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.student.phone" dense label="Телефоны" prefix='+7' :readonly="is_readonly" v-mask="phone_mask" :rules="phoneRules"></v-text-field>
                  <v-text-field v-model="form.student.instagram" dense prefix="@" :readonly="is_readonly" label='Instagram'></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.student.school" dense label='Мектебі' :readonly="is_readonly" :rules="schoolRules"></v-text-field>
                  <v-text-field v-model="form.student.grade" dense label='Сыныбы' :readonly="is_readonly" :rules="classRules"></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.student.target_subject" dense :readonly="is_readonly" label="Қатысатын пән" :rules="targetSubjectRules"></v-text-field>
                </v-col>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.student.target_from" dense :readonly="is_readonly" label="АБ-ны қайдан білді"></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col cols='12' sm='6' md='6'>
                  <v-text-field v-model="form.student.home_phone" dense :readonly="is_readonly" type='number' label="Үй телефоны"></v-text-field>
                </v-col>
                <v-col cols='12' sm='12' md='12'>
                  <v-text-field v-model="form.student.address" dense :readonly="is_readonly" label="Мекен-жайы"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols='12' sm='12' md='12'>
                  <v-card width="100%" elevation='0' class='title font-weight-medium'>Ата-ана</v-card>
                </v-col>
                <v-col cols='12' sm='6' md='6' v-for="(value, index) in form.student.parents" :key="index">
                  <v-card class='mx-auto' outlined width="100%" elevation='1'>
                    <v-container>
                      <v-row>
                        <v-col cols='12' sm='12' md='12'>
                          <p v-if="value.parent.is_main" class='font-weight-light' style='color: #4CAF50;'>Поралға кіре алатын ата-ана</p>
                          <v-text-field v-model="value.user.last_name" :readonly="is_readonly" dense label='Ата-анасының тегі'></v-text-field>
                          <v-text-field v-model="value.user.first_name" :readonly="is_readonly" dense label='Ата-анасының аты'></v-text-field>
                          <v-text-field v-model="value.parent.phone" :readonly="is_readonly" dense label='Ата-анасының ұялы телефоны' prefix='+7' v-mask="phone_mask"></v-text-field>
                          <v-card-actions v-if='!value.parent.is_main'>
                            <v-spacer></v-spacer>
                            <v-btn color="error" x-small outlined @click="removeParentForm(index)">Өшіру</v-btn>
                          </v-card-actions>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
                <v-col cols='12' sm='6' md='6'>
                  <div
                    v-ripple="{ class: 'indigo--text' }"
                    class='text-center elevation-2 pa-12 headline'
                    style='cursor:pointer; user-select:none;'
                    @click='addParentForm()'>
                    <span style='color: #3F51B5;' class='display-1'>+</span>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey lighten-1" text @click="openStudentForm = false">Отмена</v-btn>
              <v-btn v-if="!is_readonly" color="blue darken-1" type='submit' outlined>Сақтау</v-btn>
            </v-card-actions>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="is_readonly" color="orange darken-1" outlined @click="accessToEdit()">Изменить</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!-- eslint-enable -->

<script>

import { mask } from 'vue-the-mask'
import { CREATE_STUDENT, UPDATE_STUDENT } from "@/store/actions.type.js";

export default {
  data() {
    return {
      openStudentForm: false,
      form: {},
      certificates: [
        {
          key: 'B',
          title: "Көк аттестат"
        },
        {
          key: 'R',
          title: "Қызыл аттестат"
        },
        {
          key: 'G',
          title: "Алтын белгі"
        }
      ],
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      phone_mask: " (###) ###-##-##",
      firstNameRules: [
        v => !!v || ""
      ],
      lastNameRules: [
        v => !!v || ""
      ],
      dobRules: [
        v => !!v || ""
      ],
      usernameRules: [
        v => !!v || ""
      ],
      certificateRules: [
        v => !!v || ""
      ],
      phoneRules: [
        v => !!v || ""
      ],
      schoolRules: [
        v => !!v || ""
      ],
      classRules: [
        v => !!v || ""
      ],
      targetSubjectRules: [
        v => !!v || ""
      ],
      is_readonly: false,
      is_edit: false
    }
  },
  directives: {
    mask
  },
  methods: {
    openStudentFormDialog() {
      this.is_readonly = false;
      this.is_edit = false;
      this.openStudentForm = true;
      this.setDefaultForm();
    },
    editStudentFormDialog(student) {
      this.form = student;
      this.is_readonly = true;
      this.is_edit = true;
      this.openStudentForm = true;
    },
    accessToEdit() {
      this.is_readonly = false;
    },
    closeStudentFormDialog () {
      this.openStudentForm = false;
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    onSubmit (form) {
      if (this.validate()) {
        form.student.phone = form.student.phone.replace(/\(/g, '').replace(/ /g, '').replace(/\)/g, '').replace(/-/g, '');
        form.student.parents.forEach(element => {
          element.parent.phone = element.parent.phone.replace(/\(/g, '').replace(/ /g, '').replace(/\)/g, '').replace(/-/g, '');
        });
        if (this.is_edit) {
          this.$store.dispatch(UPDATE_STUDENT, form)
            .then(() => {
              this.closeStudentFormDialog();
            });
        } else {
          this.$store.dispatch(CREATE_STUDENT, form)
            .then(() => {
              this.closeStudentFormDialog();
            });
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    addParentForm () {
      var newParentForm = {
        user: {
          pk: '',
          first_name: '',
          last_name: '',
          username: '',
        },
        parent: {
          pk: '',
          user: '',
          student: '',
          phone: '',
          is_main: false
        }
      }
      this.form.student.parents.push(newParentForm);
    },
    removeParentForm (index) {
      if (!this.form.student.parents[index].is_main) {
        this.form.student.parents.splice(index, 1);
      }
    },
    setDefaultForm() {
      this.form = {
                  user: {
                    pk: '',
                    first_name: '',
                    last_name: '',
                    username: '',
                  },
                  student: {
                    pk: '',
                    dob: '',
                    user: '',
                    certificate: 'B',
                    phone: '',
                    instagram: '',
                    school: '',
                    grade: '',
                    target_subject: '',
                    target_from: '',
                    home_phone: '',
                    address: '',
                    parents: [
                      {
                        user: {
                          pk: '',
                          first_name: '',
                          last_name: '',
                          username: ''
                        },
                        parent: {
                          pk: '',
                          user: '',
                          student: '',
                          phone: '',
                          is_main: true
                        }
                      }
                    ]
                  }
                }; 
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    date () {
      this.form.student.dob = this.formatDate(this.date);
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.form.student.dob)
    }
  },
  created() {
    this.setDefaultForm();
  }
}
</script>

<style>
.select-control-row{
  padding: 8px 0;
}
</style>
