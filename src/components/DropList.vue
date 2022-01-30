<template>
  <div>
      <input type="search" v-model="filter" placeholder="Filter" style="margin-bottom: 10px"/> 
      <div>
             <div v-for="comp in dropsSelected" :key="comp.uniqueName"><span v-bind:style="{ backgroundColor: comp.color, width: '10px', display:'inline-block', marginRight:'5px' }">&nbsp;</span><a :href="`https://warframe.market/items/${comp.marketUrlName}`" target="_blank" rel="noopener">{{ comp.name }}</a>: {{ comp.plat.toFixed(2) }}</div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aera: null,
      filter: '',
      items: {}
    }
  },
  mounted() {
    let items = [];
    fetch('data.json?v=2').then(res => res.json()).then(data => {
      data.data.forEach(rel => {
          rel.comps.forEach(comp => {
           if (comp.rarity < 0.05) {
            comp.color = 'gold';
          } else if (comp.rarity < 0.15) {
            comp.color = 'silver';
          } else {
            comp.color = '#bf8970';
           }
           comp.name += ' - '+rel.name;
           comp.uniqueName += rel.name;
           items.push({
             item: comp,
             relic: rel.name
           });
          });
      });

      this.items = items.sort((a,b) => b.item.plat - a.item.plat);
    });
  },
  computed: {
    dropsSelected() {
      if (!this.filter) {return [];}
      let data = this.items;

      return data.filter(comp => comp.relic.toLowerCase().includes(this.filter.toLowerCase())).map(ea => ea.item);
    }
  }
}
</script>
