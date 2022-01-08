<template>
  <input type="search" v-model="filter" placeholder="Filter" style="margin-bottom: 10px"/>
  <div class="cards">
    <div v-for="relic in relicsFiltered" :key="relic.uniqueName" class="card">
      <div>{{ relic.name }}</div>
      <details>
        <summary>Plat: {{ relic.plat.toFixed(1) }}</summary>
        <ul>
          <li v-for="comp in relic.comps.sort((a,b) => b.plat-a.plat)" :key="comp.uniqueName"><a :href="`https://warframe.market/items/${comp.marketUrlName}`" target="_blank" rel="noopener">{{ comp.name }}</a>: {{ comp.plat.toFixed(2) }}</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelicList',
  data() {
    return {
      filter: '',
      relics: []
    }
  },
  mounted() {
    fetch('data.json').then(res => res.json()).then(data => this.relics = data);
  },
  computed: {
    relicsFiltered() {
      if (!this.filter) return this.relics;

      return this.relics.filter(relic => relic.name.toLowerCase().includes(this.filter.toLowerCase()));
    }
  }
}
</script>

<style scoped>

.cards {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.card {
    display: inline-block;
    width: 200px;
    padding: 5px;
    border: 1px solid #333;
    margin-right: 5px;
    margin-bottom: 5px;
}

.card details {
  text-align: left;
}
.card details ul {
    padding: 0;
    list-style-type: none;
}
.card details li {
    border-bottom: 1px solid #ccc;
    margin-bottom: 3px;
}
</style>
