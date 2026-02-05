<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    let data = $state({
        account: {
            username: '',
            password: '',
            confirm_password: '',
            status: true,
            office: '',
        },
        user: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: 'N/A',
            gender: '',
            birthdate: '',
        },
        permission: {
            role: '',
            admin: {
                access: false,
                accounts: {
                    access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },
                roles: {
                    access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },
                offices: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                document_types: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                document_tags: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                audit_trail: {
                    access: false,
                    view: false,
                },
            },
            dex: {
                access: false,
                dms: {
                    documents: {
                        access: false,
                        view: false,
                        delete: false,
                        download: false,
                        archive: false,
                        sign: false,
                        route: false,
                    },
                    reference_copies: {
                        access: false,
                        view: false,
                        delete: false,
                        download: false,
                        archive: false,
                    },
                    drafts: {
                        access: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        post: false,
                        review: false,
                        approve: false,
                    },
                    archive: {
                        access: false,
                        view: false,
                        delete: false,
                    },
                    trash: {
                        access: false,
                        view: false,
                        restore: false,
                        permanently_delete: false,
                    },
                },
                dts: {
                    incoming: {
                        access: false,
                        view: false,
                        reject: false,
                        acknowledge: false,
                    },
                    inbox: {
                        access: false,
                        view: false,
                        retrieve: false,
                        forward: false,
                        terminate: false,
                    },
                    outgoing: {
                        access: false,
                        view: false,
                        recall: false,
                    },
                    drafts: {
                        access: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        post: false,
                    },
                    broadcast_inbox: {
                        access: false,
                        view: false,
                        retrieve: false,
                    },
                    archive: {
                        access: false,
                        view: false,
                        retrieve: false,
                        delete: false,
                    },
                    trash: {
                        access: false,
                        view: false,
                        restore: false,
                        permanently_delete: false,
                    },
                },
            },
        },
    });

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

    $effect(() => {
        // If Admin Console is disabled, turn off all submodules' access
        if (!data.permission.admin.access) {
            for (const key in data.permission.admin) {
                if (key !== 'access') {
                    data.permission.admin[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.admin) {
            if (key !== 'access') {
                const submodule = data.permission.admin[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }

        // If DEx is disabled, turn off all submodules' access
        if (!data.permission.dex.access) {
            for (const key in data.permission.dex.dms) {
                if (key !== 'access') {
                    data.permission.dex.dms[key].access = false;
                }
            }
            for (const key in data.permission.dex.dts) {
                if (key !== 'access') {
                    data.permission.dex.dts[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.dex.dms) {
            if (key !== 'access') {
                const submodule = data.permission.dex.dms[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.dex.dts) {
            if (key !== 'access') {
                const submodule = data.permission.dex.dts[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }
    });

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
                        <li class="breadcrumb-item active">File Upload</li>
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
                            <h5>Upload a file</h5>
                            <p class="small text-muted">
                                Upload an existing file to create a document in the system. The file will be stored, tracked, and managed according to document control rules, with metadata captured
                                for easy retrieval.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <div class="row mb-3 justify-content-center pt-3">
                            <div class="col-12 col-md-6">
                                <div class="d-grid justify-content-center gap-3" id="panDropZone">
                                    <i class="bi bi-cloud-arrow-up align-self-end text-center fs-1"></i>
                                    <p class="align-self-start justify-self-center">
                                        Drag & Drop here or <a href="" id="btnBrowseFiles">Browse files</a>.
                                    </p>
                                    <input type="file" class="d-none" id="btnBrowse" multiple />
                                </div>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <p class="small">Upload reminders:</p>
                                <ul class="small">
                                    <li>Supported documents: PDF, DOC, DOCX, XLS, XLSX, CSV</li>
                                    <li>Max file size: 25MB</li>
                                </ul>
                            </div>
                        </div>

                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button onclick={save} type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-link-45deg me-2"></i>Attach File</button>
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
