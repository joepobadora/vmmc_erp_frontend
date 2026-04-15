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
            <li class="breadcrumb-item small active">Record</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Select a record</h5>
        <p class="small text-muted">Select a system record that will serve as the source of data for this document.</p>
    </j.RowCol>
    <j.Row>
        <j.Col span="6">
            <a href="/dex/dms/drafts/create/record/rs" class="text-decoration-none module-link">
                <j.Card borderonly mb="1" p="0">
                    <j.Row mb="0" centery>
                        <j.Col>
                            <h5 class="text-primary">Reference Slip</h5>
                        </j.Col>
                        <j.Col auto>
                            <i class="bi bi-chevron-compact-right"></i>
                        </j.Col>
                    </j.Row>
                </j.Card>
            </a>
        </j.Col>
    </j.Row>
</j.Card>

<style>
    .module-link:hover {
        text-decoration: underline !important;
    }
</style>
