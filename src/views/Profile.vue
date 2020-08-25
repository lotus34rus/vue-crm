<template>
  <div>
    <div class="page-title">
      <h3>{{'ProfileTitle' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input id="description" type="text" v-model="name" 
        :class="{invalid: ($v.name.$dirty && !$v.name.required) }"
        />
        <label for="description">{{'Name' | localize}}</label>
        <span class="helper-text invalid"
         v-if='$v.name.$dirty && !$v.name.required'
        >{{'NameError' | localize}}</span>
      </div>

      <!-- Switch -->
      <div class="switch">
        <label>
          EN
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          RU
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>


<style lang="css" scoped>
    .switch{
      margin-bottom: 2rem;
    }
</style>

<script>
import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'
import localizeFilter from "@/filters/localize.filter"

export default {
  name: 'profile',
  
  metaInfo() {
      return {
        title: this.$title('ProfileTitle')
      }
  },

  computed: {
      ...mapGetters(['info'])
  },

  validations: {
    name: {required},    
  },

  data() {
    return {
      name: '',
      isRuLocale: true

    }
  },

  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === 'ru-RU' ? true : false;
    setTimeout(()=>{
      M.updateTextFields()
    }, 0); 
  },

  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler(){  
        if(this.$v.$invalid){
            this.$v.$touch();
            return;
        } 

        try{
          await this.updateInfo({
            name: this.name,
            locale: this.isRuLocale === true ? 'ru-RU' : 'en-US'
          });
          this.$message('Настройки профиля обновлены');
        }catch(e){}
    },

  },

};
</script>