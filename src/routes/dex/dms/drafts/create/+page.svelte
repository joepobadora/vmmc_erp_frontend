<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { draftHasSource, draftFile, draftRecord } from '$lib/stores/dms';
    import j from '$lib/components/helper';
    import z from 'zod';

    let officeList = $state([]);

    onMount(() => {
        if (!$draftHasSource) {
            goto('/dex/dms/drafts/create/source');
        }
    });
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small active">Create</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Create a draft document</h5>
        <p class="small text-muted">
            Create a new draft to capture and organize information before finalizing the document. Drafts can be saved, edited, and updated as needed prior to review or approval.
        </p>
    </j.RowCol>
    {#if $draftFile}
        <hr class="text-muted" />
        <h5>File</h5>
        <j.Row>
            <j.Col>
                <label for="name" class="form-label small">Name</label>
                <input value={$draftFile.name} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
        </j.Row>
        <j.Row>
            <j.Col span="6">
                <label for="name" class="form-label small">Size</label>
                <input value={App.Format.number($draftFile.size).toFileSize()} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
            <j.Col span="6">
                <label for="name" class="form-label small">Type</label>
                <input value={$draftFile.type} type="text" class="form-control form-control-sm" id="name" disabled />
            </j.Col>
        </j.Row>
    {/if}
    <hr class="text-muted" />
    <h5>Details</h5>
    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Document Type<span class="ms-1 text-danger">*</span></label>
            <input list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." />
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col>
            <label for="password" class="form-label small">Name<span class="ms-1 text-danger">*</span></label>
            <input type="text" class="form-control form-control-sm" id="password" placeholder="Name" />
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col>
            <label for="exampleFormControlTextarea1" class="form-label small">Details</label>
            <textarea class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="5" placeholder="Details"></textarea>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Tags</label>
            <div class="input-group input-group-sm mb-3">
                <input list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." />
                <button class="btn btn-outline-primary" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Participants</h5>
    <j.Row>
        <j.Col span="4">
            <label for="office" class="form-label small">Reviewers<span class="ms-1 text-danger">*</span></label>
            <div class="input-group input-group-sm mb-3">
                <input list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." />
                <button class="btn btn-outline-primary" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office}></option>
                {/each}
            </datalist>
        </j.Col>
        <j.Col span="4">
            <label for="office" class="form-label small">Approvers<span class="ms-1 text-danger">*</span></label>
            <div class="input-group input-group-sm mb-3">
                <input list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." />
                <button class="btn btn-outline-primary" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office}></option>
                {/each}
            </datalist>
        </j.Col>
        <j.Col span="4">
            <label for="office" class="form-label small">Signatories</label>
            <div class="input-group input-group-sm mb-3">
                <input list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." />
                <button class="btn btn-outline-primary" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
            </div>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>

    <j.Row endx>
        <j.Col auto>
            <button onclick={save} type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-check2 me-2"></i>Save</button>
        </j.Col>
    </j.Row>
</j.Card>
