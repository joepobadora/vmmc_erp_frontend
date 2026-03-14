<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const links = [
        { href: '/admin/accounts', icon: 'bi-people', label: 'Accounts' },
        { href: '/admin/roles', icon: 'bi-shield-lock', label: 'Roles' },
        { href: '/admin/offices', icon: 'bi-geo-alt', label: 'Offices' },
        { href: '/admin/document-types', icon: 'bi-file-earmark-code', label: 'Document Types' },
        { href: '/admin/document-tags', icon: 'bi-tags', label: 'Document Tags' },
        { href: '/admin/audit-trail', icon: 'bi-clock-history', label: 'Audit Trail' },
    ];

    function handleClick(linkHref) {
        if ($page.url.pathname.startsWith(linkHref)) {
            // Clicked current page → full reload
            window.location.href = linkHref;
        } else {
            // Navigate SPA style
            goto(linkHref);
        }
    }
</script>

<div class="p-3 bg-white border">
    <div class="row">
        <div class="col">
            <div class="list-group list-group-flush">
                {#each links as link}
                    <span onclick={() => handleClick(link.href)} class="list-group-item list-group-item-action small cursor-pointer" class:active={$page.url.pathname.startsWith(link.href)}>
                        <i class={`bi ${link.icon} me-2`}></i>{link.label}
                    </span>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
