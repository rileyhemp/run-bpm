import Vue from "vue";
import VueRouter from "vue-router";
import Authentication from "../components/auth/Authentication.vue";
import Redirect from "../components/auth/Redirect.vue";
import Connect from "../components/containers/Connect.vue";
import Dashboard from "../components/containers/Dashboard.vue";
import Import from "../components/views/Import.vue";
import Create from "../components/views/Create.vue"
import Home from '../components/views/Home.vue'

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


