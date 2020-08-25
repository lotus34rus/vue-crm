<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{'Amount' | localize}}</th>
        <th>{{'Date' | localize}}</th>
        <th>{{'Category' | localize}}</th>
        <th>{{'Type' | localize}}</th>
        <th>{{'Open' | localize}}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for='(rec, idx)  in records' :key ='rec.id'>
        <td>{{idx + 1}}</td>
        <td>{{rec.amount | currencyFilter}}</td>
        <td>{{rec.data | date('datetime') }}</td>
        <td>{{rec.categoryName}}</td>
        <td>
          <span class="white-text badge"  :class="[rec.typeClass]">{{rec.typeText}}</span>
        </td>
        <td>
          <button v-tooltip="'Открыть запись'" class="btn-small btn" @click="$router.push('/detail-record/'+rec.id)">
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script>
export default {
    props: {
        records: {
            required: true,
            type: Array
        }
    },

}
</script>