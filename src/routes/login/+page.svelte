<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Alert } from '$lib/stores/alert';

	let user = $state('');
	let pass = $state('');
	let rememberMe = $state(false);
	let userInput;
	let passInput;

	onMount(() => {
		const stored = localStorage.getItem('username');
		if (stored) {
			user = stored;
			rememberMe = true;
			passInput.focus();
		} else {
			userInput.focus();
		}
	});

	function handleSubmit(e) {
		e.preventDefault();

		rememberMe && user
			? localStorage.setItem('username', user)
			: localStorage.removeItem('username');

		goto('/');
		Alert.show('success', 'Login Success', 'Now', 'You are successfully logged in!');
	}
</script>

<!-- html -->
<div class="h-100 d-flex justify-content-center align-items-center">
	<!-- wrapper -->

	<form onsubmit={handleSubmit}>
		<div class="card shadow-sm p-2" style:min-width="375px">
			<div class="card-body d-flex flex-column gap-3">
				<div class="d-flex flex-column align-items-center justify-content-center mt-3">
					<!-- icon -->
					<img class="mb-3" src="/vmmc_logo.png" alt="VMMC Logo" width="64px" height="64px" />
					<!-- title -->
					<h5>Sign in</h5>
					<!-- subtitle -->
					<p>
						Get access to you
						<abbr title="Veterans Memorial Medical Center" class="initialism">VMMC</abbr>-<abbr
							title="Enterprise Resource Planning"
							class="initialism">ERP</abbr
						>
						modules.
					</p>
				</div>
				<!-- username input -->
				<input
					type="text"
					class="form-control form-control-sm"
					placeholder="Username"
					name="usernameInput"
					bind:value={user}
					bind:this={userInput}
				/>
				<!-- password input -->
				<div class="input-group input-group-sm">
					<input
						type="password"
						class="form-control border border-end-0"
						placeholder="Password"
						name="passwordInput"
						bind:value={pass}
						bind:this={passInput}
					/>
					<button
						class="btn border border-start-0"
						type="button"
						id="button-addon2"
						aria-label="toggle password visibility"
					>
						<i class="bi bi-eye-slash-fill text-secondary"></i>
					</button>
				</div>
				<!-- remember me -->
				<div class="form-check small">
					<input
						class="form-check-input"
						type="checkbox"
						id="rememberMe"
						bind:checked={rememberMe}
					/>
					<label class="form-check-label text-primary" for="rememberMe">Remember me</label>
				</div>
				<!-- login button -->
				<div class="row">
					<div class="col-12 col-sm-auto ms-sm-auto">
						<button type="submit" class="btn btn-primary btn-sm px-3 w-100 w-sm-auto">Login</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
