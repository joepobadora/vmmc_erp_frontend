<script>
	let user = $state('');
	let pass = $state('');

	$effect(() => {
		console.log(user);
	});
</script>

<div class="w-25 bg-white shadow border-bottom" style="height: 48px;"></div>
<div class="container-fluid bg-light h-100 d-flex justify-content-center align-items-center">
	<div class="card shadow-sm" style="min-width: 375px;">
		<div class="card-body d-flex flex-column gap-3">
			<h5>Login</h5>
			<input
				type="text"
				class="form-control form-control-sm"
				id="exampleFormControlInput1"
				placeholder="Username"
				bind:value={user}
			/>
			<input
				type="password"
				class="form-control form-control-sm"
				id="exampleFormControlInput1"
				placeholder="Password"
				bind:value={pass}
			/>
		</div>
		<div class="card-footer">
			<div class="row">
				<div class="col-12 col-sm-auto ms-sm-auto">
					<button class="btn btn-primary btn-sm px-3 w-100 w-sm-auto">Login</button>
				</div>
			</div>
		</div>
	</div>
	<div class="card shadow-sm ms-4" style="min-width: 375px;">
		<div class="card-body d-flex flex-column gap-3">
			<h5>Register</h5>
			<input
				type="text"
				class="form-control form-control-sm"
				id="exampleFormControlInput1"
				placeholder="Username"
				bind:value={user}
			/>
			<input
				type="password"
				class="form-control form-control-sm"
				id="exampleFormControlInput1"
				placeholder="Password"
				bind:value={pass}
			/>
			<input
				type="password"
				class="form-control form-control-sm"
				id="exampleFormControlInput1"
				placeholder="Confirm Password"
				bind:value={pass}
			/>
		</div>
		<div class="card-footer">
			<div class="row">
				<div class="col-12 col-sm-auto ms-sm-auto">
					<button class="btn btn-primary btn-sm px-3 w-100 w-sm-auto">Login</button>
				</div>
			</div>
		</div>
	</div>
</div>
