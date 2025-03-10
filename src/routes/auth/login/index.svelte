<script context="module">
	export function load({ session, props }) {
		if (session.user) {
			return {
				status: 302,
				redirect: "/"
			};
		}

		return { props };
	}
</script>

<script>
	import { send } from "$lib/api";
	import { wordList } from "$lib/stores.js";
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";
	import { session } from "$app/stores";

	let emailInput = "";
	let passwordInput = "";
	let showPassword = false;

	export let error;

	$: {
		if (error === "Invalid login credentials") {
			error = get(wordList).error.wrongCredentials;
		}
	}

	async function login(event) {
		const formEl = event.target;
		const response = await send(formEl);

		if (response.error) {
			error = response.error;
		} else {
			$session.user = response.user;
		}

		formEl.reset();
	}
</script>

<svelte:head>
	<title>Schoppy - {$wordList.login.registered.title}</title>
</svelte:head>

<body>
	<h1>{$wordList.login.registered.title}</h1>
	<form on:submit|preventDefault={login} method="post" autocomplete="off">
		<label for="email">E-mail: </label><br />
		<input type="email" id="email" name="email" placeholder="email@email.com" bind:value={emailInput} /><br />
		<label for="password">{$wordList.login.password}:</label><br />
		<div class="password">
			<input type="password" id="password" name="password" placeholder={$wordList.login.password} bind:value={passwordInput} />
			<input
				type="checkbox"
				id="togglePassword"
				class:show={showPassword}
				bind:checked={showPassword}
				on:change={() => {
					document.querySelector("#password").type = showPassword ? "text" : "password";
				}}
			/>
			<label class="viewPasswordLabel" for="togglePassword"><img src="/showPassword.svg" alt="show" /></label><br />
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<button type="submit">{$wordList.login.registered.title}</button>
		<p
			class="link"
			on:click={() => {
				goto("/auth/signup");
			}}
		>
			{$wordList.login.registered.switch}
		</p>
	</form>
</body>

<style>
	h1 {
		margin: 0;
		cursor: pointer;
	}

	form {
		margin-top: 1rem;
		font-weight: 600;
	}

	input {
		outline: none;
		border: 2px solid transparent;
		transition: all 0.1s ease-in-out;
		border-radius: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		padding: 0 0.5rem;
		margin: 0.5rem 0;
		height: 2rem;
	}

	input:hover,
	input:focus {
		border-color: var(--accent);
	}

	input[type="email"] {
		width: 300px;
	}

	input[type="password"] {
		width: 268px;
	}

	input::placeholder {
		font-size: 1rem;
	}

	.password {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type="checkbox"] {
		display: none;
	}

	.viewPasswordLabel {
		filter: opacity(50%);
		border-radius: 100%;
	}

	input[type="checkbox"]:checked + .viewPasswordLabel {
		filter: opacity(100%);
	}

	img {
		width: 2rem;
		cursor: pointer;
	}

	button {
		font-size: 1rem;
		outline: none;
		border: 3px solid transparent;
		transition: all 0.1s ease-in-out;
		padding: 0.3rem 0.7rem;
		margin-top: 0.5rem;
		background-color: var(--accent);
		font-weight: 600;
		border-radius: 1rem;
	}

	button:hover,
	button:focus {
		border-color: var(--minor);
	}

	.link {
		margin-top: 0.7rem;
		cursor: pointer;
		text-decoration: underline;
		font-weight: 400;
	}

	.error {
		color: tomato;
	}
</style>
