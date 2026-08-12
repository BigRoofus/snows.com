<script>
	import RouterLink from '../../RouterLink.svelte'
	import HomeIcon from '../../HomeIcon.svelte'
	import Footer from '../../Footer.svelte'
</script>

<div class="filter"></div>
<div class="filter2"></div>

<div class="corner-div">
	<RouterLink to="/" className="NavFont">
		<HomeIcon size={20} />
	</RouterLink>
</div>

<div class="train-index" style="height: 100vh; text-align: center;">
	<RouterLink to="/train/abstract-tactics">Abstract Tactics</RouterLink>
	<div class="note">Stuck? Get 3rd party advice that might unstick you.</div>

	<RouterLink to="/train/rhythmic-transcription">Rythmic Transcription</RouterLink>
	<div class="note">Trying to learn music notation? Play this game to get better at notating rhythms.</div>

	<RouterLink to="/train/theory-tabs">Theory Tablature</RouterLink>
	<div class="note">Tired of trying to learn theory from scores, books, and videos? Master it on the most widely
		available instrument on the planet.</div>
</div>

<Footer />

<style>
	.train-index :global(a) {
		display: block;
	}
</style>
