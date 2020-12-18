import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  base: '/staff',
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
      meta: {
        title: 'Бастапқы бет'
      },
      children:[
        {
          path: "",
          name: "homePage",
          meta: {
            title: 'Бастапқы бет'
          },
          component: () => import("@/views/Home.vue")
        },
        {
          path: "diagram/",
          meta: {
            title: 'Бастапқы бет'
          },
          component: () => import("@/views/Home.vue")
        }
      ]
    },
    {
      path: "/login",
      meta: {
        title: 'Порталға кіру'
      },
      component: () => import("@/views/Auth.vue"),
      children: [
        {
          path: "",
          name: "login",
          meta: {
            title: 'Порталға кіру'
          },
          component: () => import("@/models/auth/login.vue")
        },
        {
          path: "change/password/",
          name: "changePassword",
          metha: {
            title: "Парольді ауыстыру"
          },
          component: () => import("@/models/auth/changePassword.vue")
        }
        // {
        //   path: "activate/",
        //   name: "activateAccount",
        //   component: () => import("@/views/auth/activateAccount.vue")
        // },
        // {
        //   path: "activate/:key",
        //   name: "activateAccountWKey",
        //   component: () => import("@/views/auth/activateAccount.vue")
        // },
        // {
        //   path: "set-password/",
        //   name: "setPassword",
        //   component: () => import("@/views/auth/setPassword.vue")
        // }
      ]
    },
    {
      path: "/user",
      component: () => import("@/views/User.vue"),
      children: [
        {
          path: "",
          meta: {
            title: 'Оқушылар'
          },
          component: () => import("@/models/user/student.vue")
        },
        {
          path: "student/",
          name: "student",
          meta: {
            title: 'Оқушылар'
          },
          component: () => import("@/models/user/student.vue")
        },
        {
          path: "teacher/",
          name: "teacher",
          meta: {
            title: 'Мұғалімдер'
          },
          component: () => import("@/models/user/teacher.vue")
        },
        {
          path: "staff/",
          name: "staff",
          meta: {
            title: 'Администраторлар мен Менеджерлер'
          },
          component: () => import("@/models/user/staff.vue")
        }
      ]
    },
    {
      path: "/lesson/process/",
      component: () => import("@/views/LessonProcess.vue"),
      children: [
        {
          path: "",
          meta: {
            title: "Группалар"
          },
          component: () => import("@/models/lesson_process/group.vue")
        },
        {
          path: "group/",
          meta: {
            title: "Группалар"
          },
          component: () => import("@/models/lesson_process/group.vue")
        },
        {
          path: "calendar/",
          meta: {
            title: "Календарь"
          },
          component: () => import("@/models/lesson_process/calendar.vue")
        }
      ]
    },
    {
      path: "/config/",
      component: () => import("@/views/Config.vue"),
      children: [
        {
          path: "",
          meta: {
            title: "Бақылаулыра және тесттердің конфигурациясы"
          },
          component: () => import('@/models/configuration/config.vue')
        },
        {
          path: "quiz/test/",
          meta: {
            title: "Бақылаулыра және тесттердің конфигурациясы"
          },
          component: () => import('@/models/configuration/config.vue')
        }
      ]
    },
    {
      path: "/salary/",
      component: () => import('@/views/Salary.vue'),
      children: [
        {
          path: "",
          meta: {
            title: "Зарплата"
          },
          component: () => import('@/models/salary/gphSalary.vue')
        }
      ]
    },
    {
      path: "/permission/denied/",
      component: () => import("@/views/PermissionDenied.vue"),
      children: [
        {
          path: "",
          metha: {
            title: "Рұқсат жоқ"
          },
          component: () => import('@/models/errors/permissionDenied.vue')
        }
      ]
    },
    {
      path: "/*",
      component: () => import("@/views/PageNotFound.vue")
    }
  ]
});
