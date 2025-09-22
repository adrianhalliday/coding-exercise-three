<template>
	<div class="nav">
		<div class="nav--container">
			<NuxtLink to="/" class="nav--link">
				<ClientOnly>
					<Icon name="material-symbols:search-rounded" />
				</ClientOnly>
			</NuxtLink>

			<NuxtLink to="/playlist" class="nav--link">
				<ClientOnly>
					<Icon name="material-symbols:playlist-play-rounded" />
				</ClientOnly>
			</NuxtLink>

			<NuxtLink to="/favourites" class="nav--link">
				<ClientOnly>
					<Icon name="material-symbols:favorite-rounded" />
				</ClientOnly>
			</NuxtLink>
		</div>
	</div>
</template>

<style scoped lang="scss">
.nav {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: calc(var(--d-notch-height) + 1rem);
	z-index: 800;
	
	&--container {
		position: relative;
		display: flex;
		flex-direction: row;
		padding: .6rem;
		gap: 1rem;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 4.2rem;
		background: transparent;
		backdrop-filter: blur(10px);
		overflow: hidden;
		// background-image: linear-gradient(60deg, #85858e34 1%, #c9dad34d 100%);

		&::after {
			display: block;
			content: "";
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(60deg, #1d1d205c 1%, #3e414062 100%);
		}
	}
	
	&--link {
		padding: .6rem 2rem;
		border-radius: 2.6rem;
		background-image: linear-gradient(60deg, #85858e2a 1%, #c9dad32e 100%);
	}
	
	.iconify {
		display: block;
		width: 1.6rem;
		height: 1.6rem;
		color: var(--c-white-20);
	}
}
</style>