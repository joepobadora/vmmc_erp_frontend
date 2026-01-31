<div class="row justify-content-center">
    <div class="col-12 col-sm-8">
        <!-- signature -->
        <div class="row mb-4">
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '<';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active"></li>
                        <li class="breadcrumb-item"><a href="/settings">Settings</a></li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="card border-0 shadow-sm p-2 mb-4">
            <div class="card-body">
                <div class="mb-4">
                    <h5>Signature</h5>
                    <p class="small">Please sign inside the designated area.</p>
                </div>
                <div class="mb-4">
                    <div class="row justify-content-center">
                        <div class="col-auto mb-3">
                            <div style="position: relative;">
                                <div style="position: absolute; top:100px ; pointer-events: none; width: 300px; height: 200px;">
                                    <hr class="mb-0 mx-auto" width="80%;" />
                                    <p class="text-center text-secondary small">( sign here )</p>
                                </div>
                            </div>
                            <canvas id="myCanvas" width="300" height="200" class="border border-secondary-subtle"> </canvas>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                    <button type="button" class="btn btn-light border btn-sm px-3 me-3"><i class="bi bi-x-lg me-2"></i>Clear</button>
                    <button type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-check-lg me-2"></i>Save</button>
                </div>
            </div>
        </div>
    </div>
</div>
