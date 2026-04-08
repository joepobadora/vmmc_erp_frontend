<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';
    import { modules } from '$lib/stores/access';

    const links = [
        { href: '/admin/accounts', icon: 'bi-people', label: 'Accounts', module: 'ADMIN1' },
        { href: '/admin/roles', icon: 'bi-shield-lock', label: 'Roles', module: 'ADMIN2' },
        { href: '/admin/offices', icon: 'bi-geo-alt', label: 'Offices', module: 'ADMIN3' },
        { href: '/admin/document-types', icon: 'bi-file-earmark-code', label: 'Document Types', module: 'ADMIN4' },
        { href: '/admin/document-tags', icon: 'bi-tags', label: 'Document Tags', module: 'ADMIN5' },
        { href: '/admin/audit-trail', icon: 'bi-clock-history', label: 'Audit Trail', module: 'ADMIN6' },
    ];

    const allowedLinks = links.filter((link) => $modules.includes(link.module));
</script>

<j.Card border noshadow p="0">
    <div class="list-group list-group-flush">
        <div class="list-group-item small">
            <strong>System</strong>
        </div>
        {#each allowedLinks as link}
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
