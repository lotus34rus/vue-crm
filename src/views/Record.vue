<template>
  <div>
    <div class="page-title">
      <h3>{{'Menu_NewRecord' | localize}}</h3>
    </div>


    <Loader v-if='loading' />

    <p class="center" v-else-if="!categories.length">Категорий нет</p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field">
       <select ref='select' v-model='current'>
            <option v-for='cat of categories' :key = "cat.id" :value="cat.id">{{cat.title}}</option>
       </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="income"  v-model='type' />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="outcome" v-model='type' />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input id="amount" type="number" v-model.number="amount"
          :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue)}"
         />
        <label for="amount">Сумма</label>
         <span class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          >Введите минимальную величину ( не менее  {{$v.amount.$params.minValue.min}} )</span>
      </div>

      <div class="input-field">
        <input id="description" type="text" v-model="description"
        :class="{invalid: ($v.description.$dirty && !$v.description.required)}"
         />
        <label for="description">Описание</label>
        <span class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >Укажите описание</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>


<script>

import {required,minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

export default {
  name: "record",
  data() {
    return {
      categories: [],
      loading : true,
      current: null,
      select: null,
      type: 'outcome',
      amount: 1,
      description: ''
    }
  },
  metaInfo() {
      return {
        title: this.$title('Menu_NewRecord')
      }
  },
  validations: {
      description: {required},
      amount: {minValue : minValue(1)}
  },
  async mounted() {
    this.categories =  await this.$store.dispatch('fetchCategories');    
    this.loading = false;

    setTimeout(()=>{
      this.select = M.FormSelect.init( this.$refs.select);
      M.updateTextFields(); 
    }, 0);

    if(this.categories){
      this.current = this.categories[0].id;
    }
    
  },

  destroyed() {
    if(this.select && this.select.destroy){
      this.select.destroy;
    }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord(){
      if(this.type === 'income'){
        return true;
      }

      return this.info.bill>=this.amount;

    }
  },

  methods: {
        async submitHandler(){
            if(this.$v.$invalid){
                this.$v.$touch();
                return;
            }
            if(this.canCreateRecord){
              try{
                  await this.$store.dispatch('createRecord', {
                    categoryId : this.current,
                    amount: this.amount,
                    description: this.description,
                    type: this.type,
                    data: new Date().toJSON()
                });
                const bill = this.type==='income' 
                          ? this.info.bill+this.amount 
                          : this.info.bill - this.amount;

                await this.$store.dispatch('updateInfo', {bill});
                this.$message('Запись добавлена');
                this.$v.$reset();
                this.amount = 1;
                this.description = '';
                
              }catch(e){}
              
            }else{
              this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`);
            }
                        
        }
  },
}
</script>
