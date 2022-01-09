<template>

    <p>
        This tool helps you check the best Relics by plat sale value (data from warframe.market) of the Prime parts they contain.
    </p>

  <main>
     <RelicList />
  </main>

    <footer style="margin-top: 25px;">
      <a href="https://github.com/kronthto/warframe-relic-value">Source on GitHub</a>
    </footer>
 
</template>

<script>
import RelicList from './components/RelicList.vue'

export default {
  name: 'App',
  components: {
    RelicList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 35px;
}
a:link, a:visited, a:hover {
    font-weight: normal;
    text-decoration: underline;
    color: #333;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #444;
  }
  #app {
  color: rgb(216, 230, 241);
  }
  a:link, a:visited, a:hover {
    color: #ddd;
  }
}
</style>
