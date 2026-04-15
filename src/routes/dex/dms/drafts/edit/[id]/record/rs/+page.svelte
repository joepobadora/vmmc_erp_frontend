<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import j from '$lib/components/helper';
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts/create">Create</a></li>
            <li class="breadcrumb-item small active">(Record) Reference Slip</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <h5>Reference Slip</h5>
    <j.Row>
        <j.Col span="6">
            <label for="password" class="form-label small">To</label>
            <input type="text" class="form-control form-control-sm" id="password" placeholder="To" />
        </j.Col>

        <j.Col span="6">
            <label for="confirmPassword" class="form-label small">From</label>
            <input type="text" class="form-control form-control-sm" id="confirmPassword" placeholder="From" />
        </j.Col>
    </j.Row>

    <j.RowCol>
        <label for="exampleFormControlTextarea1" class="form-label small">Body</label>
        <textarea class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="10" placeholder="Body"></textarea>
    </j.RowCol>

    <j.Row endx>
        <j.Col auto>
            <button onclick={save} type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-link-45deg me-2"></i>Attach Record</button>
        </j.Col>
    </j.Row>
</j.Card>
