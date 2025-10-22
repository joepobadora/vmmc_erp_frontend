<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item"><a href="/admin/accounts">Accounts</a></li>
                        <li class="breadcrumb-item active">Create</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <!-- account -->
                <div class="card shadow-sm border-0 p-2 mb-4">
                    <div class="card-body">
                        <div class="mb-4">
                            <h5>Create new user account</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Account</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="exampleFormControlInput1" class="form-label small">Username</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Username" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="exampleFormControlInput1" class="form-label small">Password</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Password" />
                            </div>
                            <div class="col-12 col-sm-6">
                                <label for="exampleFormControlInput1" class="form-label small">Confirm Password</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Confirm password" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="exampleFormControlInput1" class="form-label small">Office</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Office" />
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="exampleFormControlInput1" class="form-label small">Status</label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" checked />
                                    <label class="form-check-label small" for="switchCheckChecked">Active</label>
                                </div>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Personal Info</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">First Name</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="First name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Middle Name</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Middle name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Last Name</label>
                                <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Last name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="docmngtMyDocumentsStatusDropdown" class="form-label small">Status</label>
                                <select class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                                    <option value="All" selected>All</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-3">
                                <label for="docmngtMyDocumentsStatusDropdown" class="form-label small">Gender</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                                        <label class="form-check-label" for="inlineRadio1">Male</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                                        <label class="form-check-label" for="inlineRadio2">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Birthdate</label>
                                <input type="date" class="form-control form-control-sm" id="adminUsersCreateBirthdateDatePicker" />
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Modules</h5>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="exampleFormControlInput1" class="form-label small">Admin Console</label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" checked />
                                    <label class="form-check-label small" for="switchCheckChecked">Admin Console</label>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-check2 me-2"></i>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
