<template>
	<main 
		:key="current.name"
		:class="current.name"
		class="main"
	>
		<section
			class="container"
		>
			<header class="header">
				<svg class="header-svg" viewBox="0 0 288.26 293.35">
					<defs>
						<pattern x="-2076.87" y="-13.92" width="24" height="24" patternUnits="userSpaceOnUse" id="circlez" viewBox="12 -36 24 24" style="overflow:visible;">
							<rect x="12" y="-36" class="st0" width="24" height="24"/>
							<circle class="st1" cx="24" cy="-24" r="11.5"/>
							<circle class="st1" cx="36" cy="-12" r="11.5"/>
							<circle class="st1" cx="12" cy="-12" r="11.5"/>
							<circle class="st1" cx="36" cy="-36" r="11.5"/>
							<circle class="st1" cx="12" cy="-36" r="11.5"/>
						</pattern>
					</defs>
					<pattern  id="circlezAlt" xlink:href="#circlez" patternTransform="matrix(1.1594 0 0 1.1594 909.2112 1087.9282)">
					</pattern>
					<path class="st2" d="M1,163.03l287.25-50.58C270.62,37.65,197.42-11.26,120.77,2.24S-7.97,86.7,1,163.03z"/>
					<circle class="st0" cx="161.82" cy="168.71" r="31.81"/>
					<g>
						<circle class="st3" cx="161.25" cy="166.75" r="124.08"/>
						<circle class="st3" cx="161.25" cy="166.75" r="29.78"/>
						<circle class="st3" cx="161.25" cy="166.75" r="17.15"/>
						<g>
							<path class="st3" d="M131.92,171.91c-0.43-2.45-0.55-4.89-0.38-7.26L38,181.12c0.28,2.38,0.62,4.76,1.04,7.15
								c0.37,2.09,0.79,4.15,1.25,6.19l93.39-16.44C132.89,176.09,132.29,174.05,131.92,171.91z"/>
							<path class="st3" d="M281.99,138.16l-93.54,16.47c0.97,2.18,1.69,4.5,2.12,6.96c0.38,2.14,0.51,4.26,0.43,6.34l93.39-16.44
								c-0.26-2.08-0.57-4.16-0.94-6.25C283.03,142.85,282.54,140.49,281.99,138.16z"/>
						</g>
					</g>
				</svg>

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
					:src="`${imageUrl}dream/${current.id}.png`" 
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
const pokemon = 'eevee';
const url = 'https://pokeapi.co/api/v2/';
const maxStat = 255;

export default {
	name: 'Detail',
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
			evolutions: {},
			imageUrl: 'https://raw.githubusercontent.com/tiffachoo/pokesprites/master/pokemon/'
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
			return `${this.imageUrl}icon/${id}.png`;
		}
	}
}
</script>