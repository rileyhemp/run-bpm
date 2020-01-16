import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Redirect from "../views/Redirect.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/dashboard",
        name: "dashboard",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/Dashboard.vue")
    },
    {
        path: "/redirect",
        name: "redirect",
        component: Redirect
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

export default router;
