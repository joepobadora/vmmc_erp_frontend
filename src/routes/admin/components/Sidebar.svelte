<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    const links = [
        { href: '/admin/accounts', icon: 'bi-people', label: 'Accounts' },
        { href: '/admin/roles', icon: 'bi-shield-lock', label: 'Roles' },
        { href: '/admin/offices', icon: 'bi-geo-alt', label: 'Offices' },
        { href: '/admin/document-types', icon: 'bi-file-earmark-code', label: 'Document Types' },
        { href: '/admin/document-tags', icon: 'bi-tags', label: 'Document Tags' },
        { href: '/admin/audit-trail', icon: 'bi-clock-history', label: 'Audit Trail' },
    ];
</script>

<j.Card border noshadow p="0">
    <div class="list-group list-group-flush">
        {#each links as link}
            <span onclick={() => goto(link.href)} class="list-group-item list-group-item-action small cursor-pointer" class:active={page.url.pathname.startsWith(link.href)}>
                <i class={`bi ${link.icon} me-2`}></i>{link.label}
            </span>
        {/each}
    </div>
</j.Card>

<style>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
