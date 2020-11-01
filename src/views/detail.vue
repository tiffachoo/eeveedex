<template>
	<main 
		v-if="current.name"
		:key="current.name"
		:class="current.name"
		class="main"
	>
		<section
			class="container"
		>
			<header class="header">
				<ed-pokeball />
				<span class="header-number">
					{{ current.id }}
				</span>
				<span 
					v-if="current.species.names"
					class="header-name-ja"
				>
					{{ getLanguage(current.species.names, 'ja').name }}
				</span>
				<img 
					:src="require(`@/assets/dream/${current.id}.png`)" 
					:alt="current.name"
					class="header-image"
				>
				<div class="header-content">
					<h1 
						v-if="current.species.names"
						class="header-name"
					>
						{{ getLanguage(current.species.names).name }}
					</h1>
					<small 
						v-if="current.species.genera"
						class="header-subtext"
					>
						{{ getLanguage(current.species.genera).genus }}
					</small>
					<span 
						v-for="type in current.types"
						:key="type.type.name"
						:class="[`type-${type.type.name}`]"
						class="header-type type"
					>
						{{ type.type.name }}
					</span>
				</div>
			</header>
			<section class="content-main">
				<div class="content-attributes">
					<div class="content-attributes-item">
						<span class="content-attributes-title">
							Height
						</span>
						<span class="content-attributes-value">
							{{ heightMeters }}
						</span>
						<span class="content-attributes-unit">
							m
						</span>
					</div>
					<div class="content-attributes-item">
						<span class="content-attributes-title">
							Weight
						</span>
						<span class="content-attributes-value">
							{{ weightKilograms }}
						</span>
						<span class="content-attributes-unit">
							kg
						</span>
					</div>
				</div>
				<div 
					v-if="current.species.flavor_text_entries"
					class="well well-secondary content-descrpition"
				>
					{{ getLanguage(current.species.flavor_text_entries).flavor_text }}
				</div>
			</section>
			<aside class="content-aside">
				<div class="well content-aside-well">
					<h2>
						Abilities
					</h2>
					<ul class="list-styled">
						<li
							v-for="ability in current.abilities"
							:key="ability.ability.name"
						>
							{{ ability.ability.name | prettify }}
						</li>
					</ul>
				</div>
				<div class="content-aside-stats">
					<h2 class="content-aside-stats-title">Base stats total</h2>
					<span class="content-aside-stats-value">
						{{ baseStats }}
					</span>
				</div>
			</aside>
			<section class="content-stats">
				<div 
					v-for="stat in current.stats"
					:key="stat.stat.name"
					class="content-stat"
				>
					<div class="content-stat-label">
						{{ stat.stat.name | prettify }}
					</div>
					<div class="content-stat-bar">
						<span
							v-for="(circle, index) in 6"
							:key="stat.stat.name + index"
							:class="{ 'is-filled': calculateCircles(stat.base_stat) >= circle }" 
							class="content-stat-bar-item"
						/>
					</div>
				</div>
			</section>
			<footer 
				v-if="current.evolution && current.evolution.chain"
				class="footer"
			>
				<header class="well footer-well">
					<h2>
						Evolutions
					</h2>
				</header>
				<div class="footer-content">
					<div class="footer-item footer-item-first">
						<router-link 
							:to="`/pokemon/${current.evolution.chain.species.name}`"
							class="footer-link"
						>
							<div 
								class="footer-link-image"
								:style="{ backgroundImage: `url(${getIconImageUrl(current.evolution.chain.species.url)})` }"
							/>
							<span class="footer-link-text">
								{{ current.evolution.chain.species.name }}
							</span>
						</router-link>
					</div>
					<ul class="footer-items">
						<li 
							v-for="pokemon in current.evolution.chain.evolves_to"
							:key="pokemon.species.name"
							class="footer-item"
						>
							<router-link 
								:to="`/pokemon/${pokemon.species.name}`"
								class="footer-link"
							>
								<div 
									class="footer-link-image"
									:style="{ backgroundImage: `url(${getIconImageUrl(pokemon.species.url)})` }"
								/>
								<span class="footer-link-text">
									{{ pokemon.species.name }}
								</span>
							</router-link>
						</li>
					</ul>
				</div>
			</footer>
		</section>
		<div class="page-cover"></div>
	</main>
</template>

<script>
import EdPokeball from '../components/Pokeball';

const pokemon = 'eevee';
const url = 'https://pokeapi.co/api/v2/';
const maxStat = 255;

export default {
	name: 'Detail',
	components: {
		EdPokeball
	},
	filters: {
		prettify(val) {
			if (val === 'hp') {
				return val.toUpperCase();
			} else {
				return val.charAt(0).toUpperCase() + val.slice(1).replace('-', ' ');
			}
		}
	},
	data() {
		return {
			current: {
				species: []
			},
			evolutions: {}
		}
	},
	computed: {
		heightMeters() {
			return this.current.height / 10;
		},
		weightKilograms() {
			return this.current.weight / 10;
		},
		baseStats() {
			return this.current.stats.reduce((acc, val) => {
				return acc + val.base_stat;
			}, 0)
		}
	},
	beforeRouteUpdate(to, from, next) {
		this.getPokemonData(to.params.pokemonId)
			.then(response => {
				this.current = response;
					next();
				});
	},
	mounted() {
		this.getPokemonData(pokemon)
			.then(data => {
				this.current = data;
			});
	},
	methods: {
		getData(source) {
			return fetch(source)
				.then(res => res.json())
				.catch(err => console.log(err));
		},
		getPokemonData(id) {
			const pokemonId = id;
			const localName = `pokeData${pokemonId}`;
			const localData = localStorage.getItem(localName);
		
			if (localData) {
				return Promise.resolve(JSON.parse(localData));

			} else {
				return this.getData(`${url}pokemon/${pokemonId}`)
					.then(res => {
						const speciesData = this.getData(res.species.url);
						return Promise.all([res, speciesData])
					})
					.then(([res, speciesData]) => {
						const current = { 
							...res, 
							species: speciesData
						};
						const evolutionData = this.getData(speciesData.evolution_chain.url);
						return Promise.all([current, evolutionData])
					})
					.then(([res, evolutionData]) => {
						const current = { 
							...res, 
							evolution: evolutionData
						};
						localStorage.setItem(localName, JSON.stringify(current));
						return current;
					});
			}
		},
		getLanguage(arr, lang = 'en') {
			return arr.find(item => item.language.name === lang);
		},
		calculateCircles(val) {
			const numberOfCircles = 6
			return Math.round(val / maxStat * numberOfCircles);
		},
		getIconImageUrl(url) {
			const arr = url.split('/');
			const id = arr[arr.length - 2];
			return require(`@/assets/icon/${id}.png`);
		}
	}
}
</script>
