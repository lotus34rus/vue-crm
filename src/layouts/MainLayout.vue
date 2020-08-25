<template>
  <div>
    <Loader v-if='loading' />
    <div class="app-main-layout" v-else>
      <Navbar @click="isOpen = !isOpen" ></Navbar>

      <Sidebar v-model="isOpen" :key='locale'></Sidebar>

      <main class="app-content" v-bind:class="{full : !isOpen}">
        <div class="app-page">
          <router-view></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link v-tooltip = "'Создать новую запись'" to="/record" class="btn-floating btn-large blue">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import messages from "@/utils/messages"



export default {
  name: "main-layout",
  components: {
    Navbar,
    Sidebar
  },
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch("fetchInfo");
    }
    this.loading = false;
  },
  data: () => {
    return {
      isOpen: true,
      loading: true
    };
  },

   computed:{
        error(){
           return  this.$store.getters.error;
        },
        locale(){
          return this.$store.getters.info.locale;
        }
    },
    watch: {
        error(fbError){
            console.log(fbError);
            this.$error(messages[fbError.code] || 'Что-то пошло не так!');
        },
    },
};
</script>