<script>
    import { page } from '$app/stores';
</script>

<div class="card border-0 shadow-sm">
    <div class="card-body">
        <div class="list-group list-group-flush">
            <a href="/admin/accounts" class="list-group-item list-group-item-action small" class:active={$page.url.pathname.startsWith('/admin/accounts')}>
                <i class="bi bi-people me-2"></i>Accounts
            </a>

            <a href="/admin/offices" class="list-group-item list-group-item-action small" class:active={$page.url.pathname.startsWith('/admin/offices')}>
                <i class="bi bi-geo-alt me-2"></i>Offices
            </a>

            <a href="/admin/document-types" class="list-group-item list-group-item-action small" class:active={$page.url.pathname.startsWith('/admin/document-types')}>
                <i class="bi bi-file-earmark-code me-2"></i>Document Types
            </a>

            <a href="/admin/document-tags" class="list-group-item list-group-item-action small" class:active={$page.url.pathname.startsWith('/admin/document-tags')}>
                <i class="bi bi-tags me-2"></i>Document Tags
            </a>

            <a href="/admin/audit-trail" class="list-group-item list-group-item-action small" class:active={$page.url.pathname.startsWith('/admin/audit-trail')}>
                <i class="bi bi-clock-history me-2"></i>Audit Trail
            </a>
        </div>
    </div>
</div>
