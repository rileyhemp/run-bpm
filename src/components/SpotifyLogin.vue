<template>
    <button @click="authorizeSpotify">log in</button>
</template>

<script>
export default {
    methods: {
        authorizeSpotify: function() {
            this.$http
                .get("http://192.168.38.143:3000/get-auth-url")
                .then(data => {
                    console.log(data);
                    window.location.href = data.data;
                });
            //   this.$router.push("redirect");
        }
    }
};
</script>
