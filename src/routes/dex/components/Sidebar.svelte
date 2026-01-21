<!-- +page.svelte -->
<script>
    import TreeView from './TreeView.svelte';
    import { page } from '$app/stores';
</script>

<div class="row">
    <div class="col">
        <div class="accordion accordion-flush shadow-sm" id="accordionFlushExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Document Manager
                    </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse show">
                    <div class="accordion-body">
                        <div class="list-group list-group-flush">
                            <a href="/dex/dms/documents" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dms/documents')}>
                                <i class="bi bi-folder me-2"></i>Documents
                            </a>

                            <a href="/dex/dms/drafts" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dms/drafts')}>
                                <i class="bi bi-pencil-square me-2"></i>Drafts
                            </a>

                            <a href="/dex/dms/archive" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dms/archive')}>
                                <i class="bi bi-archive me-2"></i>Archive
                            </a>

                            <a href="/dex/dms/trash" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dms/trash')}>
                                <i class="bi bi-trash me-2"></i>Trash
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                        Tracker
                    </button>
                </h2>
                <div id="flush-collapseTwo" class="accordion-collapse collapse show">
                    <div class="accordion-body">
                        <div class="list-group list-group-flush">
                            <a href="/dex/dts/incoming" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/incoming')}>
                                <i class="bi bi-box-arrow-in-down me-2"></i>Incoming
                            </a>

                            <a href="/dex/dts/inbox" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/inbox')}>
                                <i class="bi bi-inbox me-2"></i>Inbox
                            </a>

                            <a href="/dex/dts/outgoing" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/outgoing')}>
                                <i class="bi bi-send me-2"></i>Outgoing
                            </a>

                            <a href="/dex/dts/drafts" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/drafts')}>
                                <i class="bi bi-file-earmark-text me-2"></i>Drafts
                            </a>

                            <a href="/dex/dts/broadcast-inbox" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/broadcast-inbox')}>
                                <i class="bi bi-megaphone me-2"></i>Broadcast Inbox
                            </a>

                            <a href="/dex/dts/archive" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/archive')}>
                                <i class="bi bi-archive me-2"></i>Archive
                            </a>

                            <a href="/dex/dts/trash" class="list-group-item list-group-item-action" class:active={$page.url.pathname.startsWith('/dex/dts/trash')}>
                                <i class="bi bi-trash me-2"></i>Trash
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Make accordion headers smaller */
    .accordion-button {
        font-size: 0.875rem; /* same as btn-sm */
        padding: 0.5rem 0.75rem; /* same as btn-sm & form-control-sm */
    }
    /* Smaller accordion body */
    .accordion-body {
        font-size: 0.875rem;
        padding: 0.75rem 1.25rem;
    }
</style>
