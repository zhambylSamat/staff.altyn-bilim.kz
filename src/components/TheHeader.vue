<!-- eslint-disable -->
<template>
  <div id='header-content'>
    <div class='d-none d-md-block' id='header'>
      <nav class='navbar navbar-expand-lg navbar-dark' color="indigo400">
        <router-link :to="{ name: 'homePage' }">
          <a class='navbar-brand font-weight-bold ml-5' style='color:white;'>Altyn Bilim Academy</a>
        </router-link>
        <div class='navbar-collapse' style='display:flex; flex-basis: auto;'>
          <ul class='navbar-nav' style='flex-direction:row;'>
            <li v-for="(nav, index) in navigations"
                :key="index"
                class="nav-link p-1"
                :class="[nav.status, nav.type=='dropdown' ? 'dropdown' : '']">
                <router-link :to="{ name: nav.pathName }" 
                            v-if="nav.type=='link'"
                            class='nav-link'>
                  {{ nav.text }}
                </router-link>
                <a v-if="nav.type=='dropdown'" 
                  class='nav-link dropdown-toggle'
                  id='navbarDropdown'
                  role='button'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded="false">{{ nav.text }}</a>
                <div v-if="nav.type=='dropdown'"
                    class='dropdown-menu'
                    aria-labelledby='navbarDropdown'
                    style='position:absolute;'>
                  <span v-for="(item, i) in nav.items" :key="i">
                    <div v-if="item.type=='divider'" class='dropdown-divider'></div>
                    <div v-else>
                      <router-link :to="{ name: item.pathName }"
                                  v-if="item.type=='link'"
                                  class='dropdown-item'>
                        {{ item.text }}
                      </router-link>
                    </div >
                  </span>
                </div>
            </li>
          </ul>
          <div class='ml-auto my-2 my-lg-0'>
            <ul class='navbar-nav'>
              <li class='nav-item dropdown p-1'>
                <a class='nav-link dropdown-toggle' href='#' id='navbarUserDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  {{ currentUser.last_name }} {{ currentUser.first_name }}
                </a>
                <div class='dropdown-menu' aria-labelledby="navbarUserDropdown" style='position:absolute;'>
                  <!-- <router-link :to="{ name: 'profile' }"
                              class='dropdown-item'>
                    Cabinet
                  </router-link> -->
                  <div class='dropdown-divider'></div>
                  <a class='dropdown-item' @click="logOut">Logout</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <nav class='navbar navbar-expand-lg navbar-dark d-block d-md-none' id='header-mobile' color='indigo400'>
      <div class='row'>
        <div class='col'><div class='p-3' id='navbar-menu-btn' @click='show = !show'></div></div>
        <div class='col'><div class='p-2 d-flex justify-content-center h5' style='color: white;'>Altyn Bilim Academy</div></div>
        <div class='col'><div class='p-3 d-flex justify-content-end'></div></div>
      </div>
    </nav>

    <div :class='{ "fill-background-black-in": show, "fill-background-black-out": !show }' @click='show = false'></div>
    <!-- <mu-slide-left-transition>
      <div id='nav-left' v-if="show">
        <ul>
          <li>asdf</li>
          <li>asdf</li>
          <li>asdf</li>
          <li>asdf</li>
          <li>asdf</li>
          <li>asdf</li>
        </ul>
      </div>
    </mu-slide-left-transition> -->
  </div>
</template>
<!-- eslint-enable -->
<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/store/actions.type.js";

export default {
  name: "app-header",
  data() {
    return {
      show: false,
      navigations: [
        {
          type: "link",
          text: "Статистика",
          status: "active",
          pathName: "student" // homePage
        },
        {
          type: "dropdown",
          text: "Пайдаланушылар",
          status: "active",
          items: [
            {
              type: "link",
              text: "Оқушы",
              pathName: "student"
            },
            {
              type: "link",
              text: "Ата-ана",
              pathName: "parent"
            },
            {
              type: "divider"
            },
            {
              type: "link",
              text: "Мұғалім",
              pathName: "teacher"
            },
            {
              type: "link",
              text: "Администатор",
              pathName: "admin"
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    logOut() {
      this.$store.dispatch(LOGOUT);
    }
  }
};
</script>
<style>
#header-content {
  background-color: #718bca;
}
#navbar-menu-btn:after {
  content: "";
  background: url("../assets/img/content/utils/navbar.svg");
  background-size: cover;
  width: 16px;
  height: 12px;
  display: block;
}
#header-mobile {
  position: relative;
  z-index: 1000;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.4);
}
#nav-left {
  position: absolute;
  z-index: 900;
  height: 100%;
  width: 200px;
  background-color: #718bca;
}
.fill-background-black-in {
  position: absolute;
  z-index: 800;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;
}
.fill-background-black-out {
  background-color: rgba(0, 0, 0, 0);
  transition: 0.3s;
}
</style>
