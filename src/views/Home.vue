<template>
  <div class="home">
    <spotify-login />
  </div>
</template>

<script>
// @ is an alias to /src
import SpotifyLogin from "@/components/SpotifyLogin.vue";

export default {
  name: "home",
  components: {
    "spotify-login": SpotifyLogin
  }
};
</script>
