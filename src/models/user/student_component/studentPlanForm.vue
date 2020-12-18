<!-- eslint-disable -->
<template>
  <v-row justify="center">
    <v-dialog v-model="studentPlanForm" :max-width="dialog_width">
      <v-card>
        <v-card-title>
          <span class='headline'>Оқушының жоспары | {{ dialog_title }}</span>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeStudentPlanFormDialog">X</v-btn>
        </v-card-title>
        <v-card-text v-if='choose=="subject"'>
          <template v-if="subject.items.length == 0">
            <v-progress-linear indeterminate color="indigo"></v-progress-linear>
          </template>
          <template v-else>
            <v-col cols='12' md='6' sm='6' xs='12' offset-md="3" offset-sm="3">
              <v-btn v-for="(item, key) in subject.items" :key="key" block color="info" dark class='my-1' @click="fetchChaptersAndTopics(item.pk, item.title)">{{ item.title }}</v-btn>
            </v-col>
          </template>
        </v-card-text>
        <v-card-text v-else-if="choose='topic'">
          <v-breadcrumbs :items="breadcrumb_items">
            <template v-slot:item="props">
              <v-breadcrumbs-item href="#" :disabled="props.item.disabled" @click="props.item.type=='subject' ? openStudentPlanFormDialog() : ''">
                {{ props.item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
          <!-- <template v-if="topic.student_plan_pk != null && topic.items.length == 0">
            <v-progress-linear indeterminate color="indigo"></v-progress-linear>
          </template> -->
          <template> <!-- v-else -->
            <v-row>
              <v-col cols='12' md='12' sm='12' xs='12'>
                <v-simple-table fixed-header>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class='text-center width-half'>Тақырыптар</th>
                        <th class='text-center width-quarter'>
                          <v-progress-linear v-if="subject.items.length == 0" indeterminate color="indigo"></v-progress-linear>
                          <v-select v-else
                            v-model="topic.first_subject"
                            :items="subject.items"
                            label="Пәннің жоспары"
                            @change="selectFirstSubject(topic.first_subject)"
                            dense
                            item-text="title"
                            item-value='pk'></v-select>
                        </th>
                        <th class='text-center width-quarter'>
                          <v-progress-linear v-if="subject.items.length == 0" indeterminate color="indigo"></v-progress-linear>
                          <v-select v-else
                            v-model="topic.second_subject"
                            :items="filteredSecondSubjectList"
                            @change="selectSecondSubject(topic.second_subject)"
                            label="2-ші пәннің жоспары"
                            :disabled="topic.first_subject == null || selected_plans_1.length == 0"
                            dense
                            item-text="title"
                            item-value='pk'></v-select>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class='pt-5 width-half'>
                          <p v-if="topic.plan_1.subject == undefined || topic.plan_1.subject == null" class='text-center title grey--text text--darken-1'>Жоспар енгізілмеген</p>
                          <template v-else>
                            <v-data-iterator
                              :items="getMergedPlans"
                              :items-per-page="-1"
                              :hide-default-footer='true'
                              style='width: 100% !important'
                              class='plan'>
                              <template v-slot:default="props">
                                <v-row style='width: 100%;'>
                                  <v-col
                                    v-for="chapter in props.items"
                                    :key="chapter.pk"
                                    cols="12"
                                    md="12"
                                    sm="12"
                                    xs="12">
                                    <v-card>
                                      <template v-if="chapter.topics.length > 0">
                                        <v-card-title class='subtitle-1'>{{ chapter.title }}</v-card-title>
                                        <v-divider></v-divider>
                                      </template>
                                      <v-list dense class='py-0' height="25px">
                                        <v-list-item>
                                          <v-list-item-content class="font-weight-medium grey--text text--lighten-1"></v-list-item-content>
                                          <v-list-item-content class='font-weight-medium grey--text text--lighten-1'>
                                            <v-row>
                                              <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Видео</v-col>
                                              <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Сынып ж.</v-col>
                                              <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Үй ж.</v-col>
                                            </v-row>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                      <template v-if="chapter.topics.length > 0">
                                        <v-list dense v-for="topic in chapter.topics" :key="topic.pk+'|'+chapter.pk" class='py-0'>
                                          <v-list-item :class="{'green accent-2' : (topic.tutorial == '1.0' && topic.class_work == '1.0' && topic.home_work == '1.0')}">
                                            <v-list-item-content class='py-0'>{{ topic.title }}</v-list-item-content>
                                            <v-list-item-content class='py-0'>
                                              <v-row>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': topic.tutorial == '1.0',
                                                          'orange lighten-3': topic.tutorial == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="topic.tutorial == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ topic.tutorial }}
                                                  </span>
                                                </v-col>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': topic.class_work == '1.0',
                                                          'orange lighten-3': topic.class_work == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="topic.class_work == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ topic.class_work }}
                                                  </span>
                                                </v-col>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': topic.home_work == '1.0',
                                                          'orange lighten-3': topic.home_work == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="topic.home_work == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ topic.home_work }}
                                                  </span>
                                                </v-col>
                                              </v-row>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list>
                                      </template>
                                      <template v-else>
                                        <v-list dense class='py-0'>
                                          <v-list-item :class="{'green accent-2' : (chapter.tutorial == '1.0' && chapter.class_work == '1.0' && chapter.home_work == '1.0')}">
                                            <v-list-item-content class='py-0'>{{ chapter.title }}</v-list-item-content>
                                            <v-list-item-content class='py-0'>
                                              <v-row>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': chapter.tutorial == '1.0',
                                                          'orange lighten-3': chapter.tutorial == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="chapter.tutorial == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ chapter.tutorial }}
                                                  </span>
                                                </v-col>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': chapter.class_work == '1.0',
                                                          'orange lighten-3': chapter.class_work == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="chapter.class_work == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ chapter.class_work }}
                                                  </span>
                                                </v-col>
                                                <v-col cols='12' md='4' sm='4' xs='4'
                                                  :class="{'green accent-2': chapter.home_work == '1.0',
                                                          'orange lighten-3': chapter.home_work == '0.5'}"
                                                  class='text-center'>
                                                  <v-icon v-if="chapter.home_work == '1.0'">
                                                    mdi-check-bold
                                                  </v-icon>
                                                  <span v-else>
                                                    {{ chapter.home_work }}
                                                  </span>
                                                </v-col>
                                              </v-row>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list>
                                      </template>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </template>
                            </v-data-iterator>
                          </template>
                        </td>
                        <td class='pt-5 width-quarter'>
                          <p v-if="topic.first_subject == null" class='text-center title grey--text text--darken-1'>Пәннің жоспарын таңда</p>
                          <div class='text-center' v-else-if="topic.subjects_1.length == 0">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                          </div>
                          <template v-else>
                            <v-checkbox
                              v-if="plan == null || plan.subject_plan[0] == undefined || plan.subject_plan[0].subject != topic.first_subject"
                              v-model="select_plans_1_toggle"
                              :label="select_plans_1_toggle ? 'Убрать все' : 'Выбрать все'"
                            ></v-checkbox>
                            <v-treeview
                              v-model='selected_plans_1'
                              selectable
                              transition
                              selected-color='green'
                              :items="topic.subjects_1"
                              item-key="pk"
                              item-text='title'
                              item-children="topics"
                              item-disabled="locked"
                              dense
                              open-all
                              open-on-click
                              class='plan'>
                            </v-treeview>
                          </template>
                        </td>
                        <td class='pt-5 width-quarter'>
                          <p v-if="topic.second_subject == null" class='text-center title grey--text text--darken-1'>2-ші пәннің жоспарын таңда</p>
                          <div class='text-center' v-else-if="topic.subjects_2.length == 0">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                          </div>
                          <template v-else>
                            <v-checkbox
                              v-if="plan == null || plan.subject_plan[1] == undefined || plan.subject_plan[1].subject != topic.second_subject"
                              v-model="select_plans_2_toggle"
                              :label="select_plans_2_toggle ? 'Убрать все' : 'Выбрать все'"
                            ></v-checkbox>
                            <v-treeview
                              v-model='selected_plans_2'
                              selectable
                              transition
                              selected-color='green'
                              :items="topic.subjects_2"
                              item-key="pk"
                              item-text='title'
                              item-children="topics"
                              item-disabled="locked"
                              dense
                              open-all
                              open-on-click
                              class='plan'>
                            </v-treeview>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </template>
          <v-btn color='success' outlined small :loading="submitLoading" @click="saveAndClose(plan_subject, topic.plan_1, topic.plan_2)">Сақтау</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import {
  GET_SUBJECTS,
  GET_CHAPTER_AND_TOPICS,
  SET_STUDENT_PLAN,
  EDIT_STUDENT_PLAN
} from "@/store/actions.type.js";

export default {
  data() {
    return {
      student_pk: null,
      studentPlanForm: false,
      dialog_title: "",
      plan_subject: null,
      choose: "",
      dialog_width: '50%',
      subject: null,
      topic: null,
      breadcrumb_items: [],
      selected_plans_1: [],
      selected_plans_2: [],
      select_plans_1_toggle: true,
      select_plans_2_toggle: true,
      submitLoading: false,
      plan: null
    }
  },
  methods: {
    closeStudentPlanFormDialog() {
      this.studentPlanForm = false;
    },
    openStudentPlanFormDialog(student_pk) {
      this.setDefaultTopic();
      this.student_pk = student_pk;
      this.choose = this.subject.choose;
      this.dialog_title = this.subject.dialog_title;
      this.dialog_width = '50%';
      this.studentPlanForm = true;
      this.plan = null;
    },
    editStudentPlanFormDialog(student_pk, student_plan_pk) {
      this.setDefaultTopic();
      this.student_pk = student_pk;
      this.plan = this.getStudentPlanByUserPkAndPlanPk(student_pk, student_plan_pk);
      this.fetchChaptersAndTopics(this.plan.subject, this.plan.subject_info.title, true);
      this.topic.student_plan_pk = this.plan.pk;
      this.topic.first_subject = (this.plan.subject_plan[0] != null) ? this.plan.subject_plan[0].subject : null;
      this.topic.second_subject = (this.plan.subject_plan[1] != null) ? this.plan.subject_plan[1].subject : null;
      this.selectFirstSubject(this.topic.first_subject);
      this.selectSecondSubject(this.topic.second_subject);
      this.studentPlanForm = true;
    },
    saveAndClose(plan_subject_pk, plan_1, plan_2) {
      var credentials = this.convertToRequestJson(this.topic.student_plan_pk, this.student_pk, plan_subject_pk, plan_1, plan_2);
      this.submitLoading = true;
      if (this.plan == null) {
        this.$store.dispatch(SET_STUDENT_PLAN, credentials)
          .then(() => {
            this.submitLoading = false;
            this.closeStudentPlanFormDialog();
          });
      } else {
        this.$store.dispatch(EDIT_STUDENT_PLAN, credentials)
          .then(() => {
            this.submitLoading = false;
            this.closeStudentPlanFormDialog();
          })
          .catch(() => { this.submitLoading = false; });
      }
    },
    convertToRequestJson(student_plan_pk, student_pk, plan_subject_pk, plan_1, plan_2){
      var result = {
        pk: student_plan_pk,
        student: student_pk,
        subject: plan_subject_pk,
        subject_plan: []
      };
      if (plan_1.subject != undefined && plan_1.subject != null ||
        plan_1.chapters != undefined && plan_1.chapters != null) {
        var tmp_plan = {
          pk: null,
          subject: null,
          topic_plan: []
        };
        tmp_plan.subject = plan_1.subject;
        tmp_plan.pk = plan_1.pk;
        tmp_plan.topic_plan = [];
        plan_1.chapters.forEach(chapter => {
          if (chapter.topics.length == 0) {
            tmp_plan.topic_plan.push({ topic: chapter.pk });
          } else {
            chapter.topics.forEach(topic => {
              tmp_plan.topic_plan.push({ topic: topic.pk });
            });
          }
        });
        if (tmp_plan.subject != null && tmp_plan.topic_plan.length > 0) {
          result.subject_plan.push(tmp_plan);
        }
      }
      if (plan_2.subject != undefined && plan_2.subject != null ||
        plan_2.chapters != undefined && plan_2.chapters != null) {
        tmp_plan = {
          pk: null,
          subject: null,
          topic_plan: []
        };
        tmp_plan.pk = plan_2.pk;
        tmp_plan.subject = plan_2.subject;
        tmp_plan.topic_plan = [];
        plan_2.chapters.forEach(chapter => {
          if (chapter.topics.length == 0) {
            tmp_plan.topic_plan.push({ topic: chapter.pk });
          } else {
            chapter.topics.forEach(topic => {
              tmp_plan.topic_plan.push({ topic: topic.pk });
            });
          }
        });
        if (tmp_plan.subject != null && tmp_plan.topic_plan.length > 0) {
          result.subject_plan.push(tmp_plan);
        }
      }
      return result;
    },
    fetchSubject() {
      if (this.subject.items.length == 0) {
        this.$store.dispatch(GET_SUBJECTS).then(() => this.subject.items = this.getSubjects);
      }
    },
    fetchChaptersAndTopics(subject_pk, subject_title, is_edit = false) {
      this.plan_subject = subject_pk;
      this.setDefaultTopic();
      this.choose = this.topic.choose;
      this.dialog_width = '100%';
      this.breadcrumb_items = [
        {text: subject_title, disabled: is_edit, type: 'subject'},
        {text: 'Тақырыптар', disabled: true, type: 'topic'}
      ];
      this.dialog_title = this.topic.dialog_title;
    },
    selectFirstSubject(subject_pk) {
      if (subject_pk != null) {
        var credentials = {
          subject_pk: subject_pk,
          index: 0
        };
        this.topic.subjects_1 = [];
        this.$store.dispatch(GET_CHAPTER_AND_TOPICS, credentials).then(() => {
          var topics_1 = this.getChaptersAndTopics(0);
          this.topic.subjects_1 = this.setTopicDisabling(subject_pk, topics_1);
        });
      }
    },
    selectSecondSubject(subject_pk) {
      this.topic.subjects_2 = [];
      if (subject_pk != null) {
        var credentials = {
          subject_pk: subject_pk,
          index: 1
        };
        this.$store.dispatch(GET_CHAPTER_AND_TOPICS, credentials).then(() => {
          var topics_2 = this.getChaptersAndTopics(1);
          this.topic.subjects_2 = this.setTopicDisabling(subject_pk, topics_2);
        });
      }
    },
    setTopicDisabling(subject_pk, chapters) {
      var student_topic_plans_pk = [];
      if (this.plan != null) {
        for (let i = 0; i < this.plan.subject_plan.length; i++) {
          if (this.plan.subject_plan[i].subject == subject_pk) {
            this.plan.subject_plan[i].topic_plan.forEach(elem => {
              if (elem.tutorial != '0.0' || elem.class_work != '0.0' || elem.home_work != '0.0') {
                student_topic_plans_pk.push(elem.topic);
              }
            });
            break;
          }
        }
      }
      for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].topics.length == 0 && student_topic_plans_pk.includes(chapters[i].pk)) {
          chapters[i]['locked'] = true;
        } else {
          for (let j = 0; j < chapters[i].topics.length; j++) {
            if (student_topic_plans_pk.includes(chapters[i].topics[j].pk)) {
              chapters[i].topics[j]['locked'] = true;
            }
          }
        }
      }
      return chapters;
    },
    fillSelectedPlans(items, selected_plan, index) {
      var full_subject_plan = [];
      items.forEach(elem => {
        if (elem.topics.length > 0) {
          elem.topics.forEach(val => {
            full_subject_plan.push(val.pk);
          });
        } else {
          full_subject_plan.push(elem.pk);
        }
      });
      if (this.plan != null && this.plan.subject_plan[index] != undefined 
          && ((index == 0 && this.plan.subject_plan[0].subject == this.topic.first_subject)
              || (index == 1 && this.plan.subject_plan[1].subject == this.topic.second_subject))) {
        this.plan.subject_plan.forEach(elem => {
          elem.topic_plan.forEach(topic => {
            if (full_subject_plan.includes(topic.topic)){
              selected_plan.push(topic.topic);
            }
          });
        });
      } else {
        if (index == 0) {
          this.select_plans_1_toggle = true;
        } else {
          this.select_plans_2_toggle = true;
        }
        selected_plan = full_subject_plan;
      }
      return selected_plan;
    },
    fillPlans(selected_plans, subject_pk, subject_plan, plan) {
      var subject_plan_pk = null;
      var subject_plan_index = null;
      if (this.plan != null) {
        for (let index = 0; index < this.plan.subject_plan.length; index++) {
          if (this.plan.subject_plan[index].subject == subject_pk) {
            subject_plan_pk = this.plan.subject_plan[index].pk;
            subject_plan_index = index;
            break;
          }
        }
      }
      plan = {
        pk: null,
        subject: null,
        chapters: []
      };
      subject_plan.forEach(chapter => {
        var chapter_tmp = {
          pk: chapter.pk,
          title: chapter.title,
          tutorial: 0.0,
          class_work: 0.0,
          home_work: 0.0,
          topics: []
        };
        if (chapter.topics.length > 0) {
          chapter.topics.forEach(topic => {
            var topic_tmp = {
              pk: topic.pk,
              title: topic.title,
              tutorial: 0.0,
              class_work: 0.0,
              home_work: 0.0
            };
            if (selected_plans.includes(topic.pk)) {
              if (subject_plan_pk != null) {
                var tmp = this.defineTopicProgress(subject_plan_index, topic.pk);
                topic_tmp.tutorial = tmp.tutorial;
                topic_tmp.class_work = tmp.class_work;
                topic_tmp.home_work = tmp.home_work;
              }
              chapter_tmp.topics.push(topic_tmp);
            }
          });
          if (chapter_tmp.topics.length > 0) {
            plan.chapters.push(chapter_tmp);
          }
        } else if (chapter.is_endpoint && selected_plans.includes(chapter.pk)) {
          if (subject_plan_pk != null) {
            var tmp = this.defineTopicProgress(subject_plan_index, chapter.pk);
            chapter_tmp.tutorial = tmp.tutorial;
            chapter_tmp.class_work = tmp.class_work;
            chapter_tmp.home_work = tmp.home_work;
          }
          plan.chapters.push(chapter_tmp);
        }
      });
      if (plan.chapters.length > 0) {
        plan.subject = subject_pk;
        plan.pk = subject_plan_pk;
      }
      return plan;
    },
    defineTopicProgress(subject_plan_index, topic_pk) {
      var result = {
        tutorial: 0.0,
        class_work: 0.0,
        home_work: 0.0
      }
      for (let i = 0; i < this.plan.subject_plan[subject_plan_index].topic_plan.length; i++) {
        if (this.plan.subject_plan[subject_plan_index].topic_plan[i].topic == topic_pk) {
          let tmp = this.plan.subject_plan[subject_plan_index].topic_plan[i];
          result.tutorial = tmp.tutorial;
          result.class_work = tmp.class_work;
          result.home_work = tmp.home_work;
        }
      }
      return result;
    },
    resetLockedTopics(selected_plans, subject_pk, index) {
      var result = [];
      if (this.plan != null
          && this.plan.subject_plan != undefined
          && this.plan.subject_plan[index] != undefined
          && this.plan.subject_plan[index].subject == subject_pk) {
        this.plan.subject_plan[index].topic_plan.forEach(elem => {
          if ((elem.tutorial != '0.0' || elem.class_work != '0.0' || elem.home_work != '0.0')
              && !selected_plans.includes(elem.topic)) {
                result.push(elem.topic);
          }
        });
      }
      return result;
    },
    setDefaultSubject() {
      this.subject = {
        choose: 'subject',
        dialog_title: "Курстың пәнін таңдау",
        items: []
      };
    },
    setDefaultTopic() {
      this.topic = {
        choose: 'topic',
        dialog_title: "Жоспар құрастыру",
        plan_1: {},
        plan_2: {},
        subjects_1: [],
        subjects_2: [],
        student_plan_pk: null,
        first_subject: null,
        second_subject: null
      };
    }
  },
  created: function() {
    this.setDefaultSubject();
    this.setDefaultTopic();
    this.fetchSubject();
  },
  computed: {
    ...mapGetters(["getSubjects", "getChaptersAndTopics", "getStudentPlanByUserPkAndPlanPk"]),
    filteredSecondSubjectList() {
      var result = [
        {
          pk: null,
          title: 'Пәнді таңда'
        }
      ];
      return result.concat(this.subject.items.filter(item => item.pk != this.topic.first_subject));
    },
    getMergedPlans() {
      if (this.topic.plan_1.chapters != undefined) {
        if (this.topic.plan_2.chapters != undefined) {
          return this.topic.plan_1.chapters.concat(this.topic.plan_2.chapters);
        }
        return this.topic.plan_1.chapters;
      }
      return [];
    }
  },
  watch: {
    'topic.subjects_1': function(item) {
      this.selected_plans_1 = this.fillSelectedPlans(item, this.selected_plans_1, 0);
    },
    'topic.subjects_2': function(item) {
      this.selected_plans_2 = this.fillSelectedPlans(item, this.selected_plans_2, 1);
    },
    selected_plans_1: function(item) {
      var push_to_plan = this.resetLockedTopics(item, this.topic.first_subject, 0);
      if (push_to_plan.length != 0) {
        this.selected_plans_1 = this.selected_plans_1.concat(push_to_plan);
      } else {
        if (item.length == 0) {
          this.selected_plans_2 = [];
          this.topic.subjects_2 = [];
          this.topic.second_subject = null;
        }
        this.topic.plan_1 = this.fillPlans(item, this.topic.first_subject, this.topic.subjects_1, this.topic.plan_1);
      }
    },
    selected_plans_2: function(item) {
      var push_to_plan = this.resetLockedTopics(item, this.topic.second_subject, 1);
      if (push_to_plan.length != 0) {
        this.selected_plans_2 = this.selected_plans_2.concat(push_to_plan);
      } else {
        this.topic.plan_2 = this.fillPlans(item, this.topic.second_subject, this.topic.subjects_2, this.topic.plan_2);
      }
    },
    select_plans_1_toggle: function(bool) {
      if (!bool) {
        this.selected_plans_1 = [];
      } else {
        this.selected_plans_1 = this.fillSelectedPlans(this.topic.subjects_1, this.selected_plans_1, 0);
      }
    },
    select_plans_2_toggle: function(bool) {
      if (!bool) {
        this.selected_plans_2 = [];
      } else {
        this.selected_plans_2 = this.fillSelectedPlans(this.topic.subjects_2, this.selected_plans_2, 1);
      }
    }
  }
}
</script>

<style scoped>
.width-half {
  width: 50%;
  height: 80px;
}
.width-quarter {
  width: 25%;
  height: 80px;
}
td {
  vertical-align: top;
  border-right: 1px solid lightgray;
}
td:last-child {
  border-right: none;
}
td {
  background-color: white;
}
td .plan {
  height: 60vh;
  width: 28vw !important;
  overflow-y: scroll;
}
</style>
