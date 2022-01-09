<template>
  <input type="search" v-model="filter" placeholder="Filter" style="margin-bottom: 10px"/> <label><input type="checkbox" v-model="rarest">Sort by Rarest</label>
  <div class="cards">
    <div v-for="relic in relicsFiltered" :key="relic.uniqueName" class="card">
      <div>{{ relic.name.replace(' Relic', '') }}</div>
      <details>
        <summary>Plat: {{ relic.plat.toFixed(1) }} | <span v-bind:style="{ color:relic.comps[0].color }">R</span>: {{ relic.comps[0].plat.toFixed(1) }}</summary>
        <ul>
          <li v-for="comp in relic.comps" :key="comp.uniqueName"><span v-bind:style="{ backgroundColor: comp.color, width: '5px', display:'inline-block' }">&nbsp;</span><a :href="`https://warframe.market/items/${comp.marketUrlName}`" target="_blank" rel="noopener">{{ comp.name }}</a>: {{ comp.plat.toFixed(2) }}</li>
        </ul>
      </details>
    </div>
    <div>Updated: {{ this.updated }}</div>
  </div>
</template>

<script>
export default {
  name: 'RelicList',
  data() {
    return {
      filter: '',
      updated: '',
      rarest: false,
      relics: []
    }
  },
  mounted() {
    fetch('data.json?v=2').then(res => res.json()).then(data => {
      this.relics = data.data.filter(rel => rel.comps.length);
      this.relics.forEach(rel => {
        rel.comps.forEach(comp => {
          if (comp.rarity < 0.05) {
            comp.color = 'gold';
          } else if (comp.rarity < 0.15) {
            comp.color = 'silver';
          } else {
            comp.color = '#bf8970';
          }
        });
      })
      this.updated = new Date(data.date);
    });
  },
  computed: {
    relicsFiltered() {
      let data = this.relics;

      if (this.rarest) {
        data = [...data].sort((a,b) => b.comps[0].plat - a.comps[0].plat);
      }

      if (!this.filter) return data;

      return data.filter(relic => relic.name.toLowerCase().includes(this.filter.toLowerCase()));
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

@media (prefers-color-scheme: dark) {
  .card {
    border-color: white;
  }
}
</style>
