<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import j from '$lib/components/helper';
    import z from 'zod';
    import { page } from '$app/state';
    import Auth from '$lib/components/Auth.svelte';

    let { data } = $props();

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

    function chooseRoute(routeKey) {
        selectedRoute = routeKey;
        routeDesc = routeListMap[routeKey].description;
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
            <input type="text" class="form-control form-control-sm" placeholder="DOC-XXXX-XXXX" />
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col>
            <label class="form-label small">Title<span class="ms-1 text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" placeholder="Title" />
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col>
            <label class="form-label small">Description</label>
            <textarea class="form-control form-control-sm" rows="4" placeholder="Details"></textarea>
        </j.Col>
    </j.Row>

    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Supporting Document No<span class="ms-1 text-danger">*</span></label>
            <div class="input-group input-group-sm">
                <input list="accountList" type="text" class="form-control form-control-sm" id="office" placeholder="DOC-XXXX-XXXX" />
                <button class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <div class="d-flex flex-row flex-wrap gap-2 my-3"></div>
        </j.Col>
    </j.Row>

    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-light border btn-sm px-3" onclick={() => goto('/dex/dts/transactions')}>Cancel</button>
            <j.Button label="Save as draft" loadinglabel="Saving" />
            <j.Button label="Post" loadinglabel="Saving" icon="bi-check-lg" />
        </div>
    </j.RowCol>
</j.Card>
