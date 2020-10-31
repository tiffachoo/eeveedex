<template>
	<div id="app">
		<transition name="page">
			<router-view/>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="scss">
@import '@/styles/reset';
@import '@/styles/styles';
</style>
