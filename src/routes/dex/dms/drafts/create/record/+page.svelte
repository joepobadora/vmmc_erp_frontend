<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    let officeList = $state([]);

    onMount(() => {
        initOfficeDropdown();
    });

    async function initOfficeDropdown() {
        const result = await App.API.post('http://127.0.0.1:8000/api/offices', { keyword: '', status: 'Active' }, false);

        if (result.success) {
            officeList = result.data.map((o) => o.short_name);
        }
    }

    async function save(event) {
        // const button = event.currentTarget;
        // App.Button.el(button).setLoading('Saving...');

        const result = await App.API.post('http://127.0.0.1:8000/api/accounts', { data }, false);

        if (result.success) {
            console.log(result.data);
        } else {
            console.log(result);
        }

        // setTimeout(() => {
        //     goto('/admin/accounts');
        //     Alert.show('success', 'Success', 'Successfully created an account.');
        // }, 2000);
    }
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
                        <li class="breadcrumb-item"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
                        <li class="breadcrumb-item"><a href="/dex/dms/drafts/create">Create</a></li>
                        <li class="breadcrumb-item active">Record</li>
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
                            <h5>Select a record</h5>
                            <p class="small text-muted">Select a system record that will serve as the source of data for this document.</p>
                        </div>
                        <hr class="text-muted" />
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <a href="/dex/dms/drafts/create/record/rs">
                                            <div class="d-flex align-items-center">
                                                <h5>Reference Slip</h5>
                                                <i class="bi bi-chevron-compact-right ms-auto"></i>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #panDropZone {
        height: 250px;
        border: 1px dashed gray;
    }

    .dragover {
        background-color: whitesmoke;
    }
</style>
