<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import j from '$lib/components/helper';
    import z from 'zod';
    import { page } from '$app/state';
    import Auth from '$lib/components/Auth.svelte';
    import { de } from 'zod/v4/locales';

    let auth = $state();

    let { data } = $props();

    let docNo = $state('');
    let name = $state('');
    let details = $state('');
    let supportingDoc = $state(null);
    let supportingDocs = $state([]);

    let documentList = $state(data.docList ?? []);

    let saving = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    let routeListMap = {
        ROUTING1: {
            label: 'Broadcast',
            icon: 'bi-broadcast',
            description: 'Distribute the document to multiple recipients at once. Each recipient gets their own copy, while custody remains with the sender.',
        },
        ROUTING2: {
            label: 'Direct Forward',
            icon: 'bi-arrow-right-circle',
            description: 'Send the document directly to a single recipient. Custody is transferred point‑to‑point, ensuring only the chosen person receives it.',
        },
        ROUTING3: {
            label: 'Release to Pool',
            icon: 'bi-cloud-upload',
            description: 'Place the document into a shared pool where any authorized recipient can claim custody. Use this when the specific recipient is not known in advance.',
        },
    };

    let selectedRoute = $state('ROUTING3');
    let routeDesc = $state(routeListMap[selectedRoute].description);

    const schema = z.object({
        docNo: z
            .string()
            .nonempty('Required.')
            .refine((val) => documentList.map((d) => d.document_no).includes(val), {
                message: 'Invalid document selected.',
            }),
    });

    const supportingDocSchema = z.object({
        supportingDoc: z.refine((val) => documentList.map((d) => d.id).includes(val), {
            message: 'Invalid document selected.',
        }),
    });

    function chooseRoute(routeKey) {
        selectedRoute = routeKey;
        routeDesc = routeListMap[routeKey].description;
    }

    async function save() {
        const validate = schema.safeParse({
            docNo,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        console.log(docNo);
    }

    // debounce and react to document no change
    $effect(() => {
        docNo;

        return App.Async.debounce(populateDocumentDetails, 500);
    });

    async function populateDocumentDetails() {
        try {
            const result = await App.API.post('/dex/dts/drafts/create/document-details', {
                doc_no: docNo,
            });

            if (result.data.success) {
                name = result.data.data.latest_version.name;
                details = result.data.data.latest_version.details;
            } else {
                name = '';
                details = '';
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    }

    function handleSupportingDocSelect() {
        const opt = [...document.querySelectorAll('#documentList option')].find((o) => o.value === supportingDoc);

        if (opt) {
            supportingDoc = Number(opt.dataset.id);
        }

        const obj = documentList.find((a) => a.id === supportingDoc);

        const validate = supportingDocSchema.safeParse({
            supportingDoc,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        if (!supportingDocs.includes(obj)) {
            supportingDocs = [...supportingDocs, obj];
        }

        supportingDoc = null;
    }

    function handleSupportingDocRemove(supportingDoc) {
        supportingDocs = supportingDocs.filter((t) => t !== supportingDoc);
    }
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dts/drafts">(Tracker) Drafts</a></li>
            <li class="breadcrumb-item small active">Create</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Create a transaction</h5>
        <p class="small text-muted">Record a new transaction to track document movement and routing. Transactions can be saved, edited, and updated prior to completion.</p>
    </j.RowCol>

    <hr class="text-muted" />
    <h5>Route</h5>

    <j.RowCol span="6">
        <label for="docmngtMyDocumentsStatusDropdown" class="form-label small">Method</label>
        <div class="dropdown">
            <button class="btn btn-light border btn-sm px-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="{routeListMap[selectedRoute].icon} me-2"></i>
                {routeListMap[selectedRoute].label}
            </button>
            <ul class="dropdown-menu">
                {#each Object.entries(routeListMap) as [key, route]}
                    <li>
                        <button class="dropdown-item small" type="button" onclick={() => chooseRoute(key)}>
                            <i class="{route.icon} me-2"></i>{route.label}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
        <span class="small text-muted fst-italic">{routeDesc}</span>
    </j.RowCol>

    <hr class="text-muted" />
    <h5>Document</h5>
    <j.Row>
        <j.Col span="6">
            <label class="form-label small">Document No<span class="ms-1 text-danger">*</span></label>
            <input
                bind:value={docNo}
                oninput={(e) => (docNo = e.target.value.toUpperCase())}
                type="text"
                class="form-control form-control-sm {errors.docNo ? 'is-invalid' : ''}"
                placeholder="DOC-XXXX-XXXX"
            />
            <p class="text-danger small mb-auto {errors.docNo ? '' : 'd-none'}">{errors.docNo?.[0]}</p>
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col>
            <label class="form-label small">Name</label>
            <input bind:value={name} type="text" class="form-control form-control-sm" placeholder="Name" readonly />
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col>
            <label class="form-label small">Details</label>
            <textarea bind:value={details} class="form-control form-control-sm" rows="4" placeholder="Details" readonly></textarea>
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Supporting Document No</label>
            <div class="input-group input-group-sm">
                <input
                    bind:value={supportingDoc}
                    list="documentList"
                    type="text"
                    class="form-control form-control-sm {errors.supportingDoc || errors.supportingDoc ? 'is-invalid' : ''}"
                    id="office"
                    placeholder="Type and choose..."
                />
                <button onclick={handleSupportingDocSelect} class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <p class="text-danger small mb-auto {errors.supportingDoc ? '' : 'd-none'}">{errors.supportingDoc?.[0]}</p>
            <div class="d-flex flex-row flex-wrap gap-2 my-3">
                {#each supportingDocs as doc}
                    <j.Tag name={doc.document_no} onRemove={() => handleSupportingDocRemove(doc)} border />
                {/each}
            </div>
        </j.Col>
        <datalist id="documentList">
            {#each documentList as doc}
                <option data-id={doc.id} value={doc.document_no}></option>
            {/each}
        </datalist>
    </j.Row>

    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-light border btn-sm px-3" onclick={() => goto('/dex/dts/transactions')}>Cancel</button>
            <j.Button label="Save as draft" loadinglabel="Saving as draft" onClick={save} />
            <j.Button label="Post" loadinglabel="Posting" icon="bi-check-lg" />
        </div>
    </j.RowCol>
</j.Card>
