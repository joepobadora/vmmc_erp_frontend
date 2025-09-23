<div class="container-fluid h-100 pt-4">
	<div class="row justify-content-center">
		<div class="col-12 col-sm-6">
			<!-- account -->
			<div class="row card shadow-sm p-2 m-4">
				<div class="card-body">
					<div class="mb-4">
						<h5>Account</h5>
						<p class="small">
							Change your account password to help keep your access secure. Make sure to choose a
							strong password that only you know.
						</p>
					</div>
					<div class="mb-3">
						<label for="exampleFormControlInput1" class="form-label small">Username</label>
						<input
							type="email"
							class="form-control form-control-sm"
							id="exampleFormControlInput1"
							placeholder="Username"
						/>
					</div>
					<div class="row mb-4">
						<div class="col-12 col-sm-4 mb-3">
							<label for="exampleFormControlInput1" class="form-label small">Old Password</label>
							<input
								type="email"
								class="form-control form-control-sm"
								id="exampleFormControlInput1"
								placeholder="Old password"
							/>
						</div>
						<div class="col-12 col-sm-4 mb-3">
							<label for="exampleFormControlInput1" class="form-label small">New Password</label>
							<input
								type="email"
								class="form-control form-control-sm"
								id="exampleFormControlInput1"
								placeholder="New password"
							/>
						</div>
						<div class="col-12 col-sm-4">
							<label for="exampleFormControlInput1" class="form-label small"
								>Confirm New Password</label
							>
							<input
								type="email"
								class="form-control form-control-sm"
								id="exampleFormControlInput1"
								placeholder="Confirm new password"
							/>
						</div>
					</div>
					<div class="d-flex flex-column flex-sm-row justify-content-sm-end">
						<button type="button" class="btn btn-primary btn-sm px-3" onclick={Logout}
							><i class="bi bi-arrow-repeat me-2"></i>Update</button
						>
					</div>
				</div>
			</div>
			<!-- personal information -->
			<div class="row card shadow-sm p-2 m-4">
				<div class="card-body">
					<div class="mb-4">
						<h5>Personal Information</h5>
						<p class="small">
							Update your basic details such as your name, gender, and birthdate. This information
							is used within the system to keep your profile accurate.
						</p>
					</div>
					<div class="mb-3">
						<div class="row">
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">First Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="First name"
								/>
							</div>
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Middle Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="Middle name"
								/>
							</div>
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Last Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="Last name"
								/>
							</div>
							<div class="col-12 col-sm-3">
								<label for="exampleFormControlInput1" class="form-label small">Suffix</label>
								<select class="form-select form-select-sm" id="settingsSuffixDropdown">
									<option value="NA" selected>N/A</option>
									<option value="SR">SR.</option>
									<option value="JR">JR.</option>
									<option value="II">II.</option>
									<option value="III">III.</option>
								</select>
							</div>
						</div>
					</div>
					<div class="mb-4">
						<div class="row">
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Gender</label>
								<div>
									<div class="form-check form-check-inline">
										<input
											class="form-check-input"
											type="radio"
											name="inlineRadioOptions"
											id="inlineRadio1"
											value="option1"
										/>
										<label class="form-check-label" for="inlineRadio1">Male</label>
									</div>
									<div class="form-check form-check-inline">
										<input
											class="form-check-input"
											type="radio"
											name="inlineRadioOptions"
											id="inlineRadio2"
											value="option2"
										/>
										<label class="form-check-label" for="inlineRadio2">Female</label>
									</div>
								</div>
							</div>
							<div class="col-12 col-sm-3">
								<label for="exampleFormControlInput1" class="form-label small">Birthdate</label>
								<input
									type="date"
									class="form-control form-control-sm"
									id="settingsBirthdateDatePicker"
								/>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column flex-sm-row justify-content-sm-end">
						<button type="button" class="btn btn-primary btn-sm px-3" onclick={Logout}
							><i class="bi bi-arrow-repeat me-2"></i>Update</button
						>
					</div>
				</div>
			</div>
			<!-- personal information -->
			<div class="row card shadow-sm p-2 m-4">
				<div class="card-body">
					<div class="mb-4">
						<h5>Personal Information</h5>
						<p class="small">
							Update your basic details such as your name, gender, and birthdate. This information
							is used within the system to keep your profile accurate.
						</p>
					</div>
					<div class="mb-3">
						<div class="row">
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">First Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="First name"
								/>
							</div>
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Middle Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="Middle name"
								/>
							</div>
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Last Name</label>
								<input
									type="email"
									class="form-control form-control-sm"
									id="exampleFormControlInput1"
									placeholder="Last name"
								/>
							</div>
							<div class="col-12 col-sm-3">
								<label for="exampleFormControlInput1" class="form-label small">Suffix</label>
								<select class="form-select form-select-sm" id="settingsSuffixDropdown">
									<option value="NA" selected>N/A</option>
									<option value="SR">SR.</option>
									<option value="JR">JR.</option>
									<option value="II">II.</option>
									<option value="III">III.</option>
								</select>
							</div>
						</div>
					</div>
					<div class="mb-4">
						<div class="row">
							<div class="col-12 col-sm-3 mb-3">
								<label for="exampleFormControlInput1" class="form-label small">Gender</label>
								<div>
									<div class="form-check form-check-inline">
										<input
											class="form-check-input"
											type="radio"
											name="inlineRadioOptions"
											id="inlineRadio1"
											value="option1"
										/>
										<label class="form-check-label" for="inlineRadio1">Male</label>
									</div>
									<div class="form-check form-check-inline">
										<input
											class="form-check-input"
											type="radio"
											name="inlineRadioOptions"
											id="inlineRadio2"
											value="option2"
										/>
										<label class="form-check-label" for="inlineRadio2">Female</label>
									</div>
								</div>
							</div>
							<div class="col-12 col-sm-3">
								<label for="exampleFormControlInput1" class="form-label small">Birthdate</label>
								<input
									type="date"
									class="form-control form-control-sm"
									id="settingsBirthdateDatePicker"
								/>
							</div>
						</div>
					</div>
					<div class="d-flex flex-column flex-sm-row justify-content-sm-end">
						<button type="button" class="btn btn-primary btn-sm px-3" onclick={Logout}
							><i class="bi bi-arrow-repeat me-2"></i>Update</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
