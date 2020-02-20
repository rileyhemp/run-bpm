import Vue from "vue";
import VueRouter from "vue-router";
import Authentication from "../views/Authentication.vue";
import Redirect from "../views/Redirect.vue";
import Connect from "../views/Connect.vue";
import Dashboard from "../views/Dashboard.vue";
import Import from "../components/Import.vue";
import Create from "../components/CreatePlaylist.vue"
import Home from '../components/Home.vue'

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "authentication",
		component: Authentication
	},
	{
		path: "/connect",
		name: "connect",
		component: Connect
	},
	{
		path: "/redirect",
		name: "redirect",
		component: Redirect
	},
	{
		path: "/dashboard",
		component: Dashboard,
		children: [
			{
				path: '',
				name: 'Dashboard',
				component: Home
			},
			{
				path: '/import',
				name: 'Import',
				component: Import
			},
			{
				path: '/create',
				name: 'Create',
				component: Create
			}
		]
	},
];

const router = new VueRouter({
	mode: "history",
	routes
});

export default router;


