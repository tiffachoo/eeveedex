import Vue from 'vue';
import VueRouter from 'vue-router';
import Pokemon from './views/detail.vue';

Vue.use(VueRouter);

const pokemon = 'eevee';
const routes = [
	{ 
		name: 'home',
		path: '/', 
		component: Pokemon,
		redirect: `/pokemon/${pokemon}`
	},
	{ 
		name: 'pokemon',
		path: '/pokemon/:pokemonId', 
		component: Pokemon
	}
];

export default new VueRouter({
	routes,
	scrollBehavior () {
		return { x: 0, y: 0 }
	}
});

