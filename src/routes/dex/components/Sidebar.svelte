<!-- +page.svelte -->
<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    const sections = [
        {
            title: 'Document Manager',
            links: [
                { href: '/dex/dms/documents', icon: 'bi-folder', label: 'Documents' },
                { href: '/dex/dms/reference-copies', icon: 'bi-folder', label: 'Reference Copies' },
                { href: '/dex/dms/drafts', icon: 'bi-pencil-square', label: 'Drafts' },
                { href: '/dex/dms/archive', icon: 'bi-archive', label: 'Archive' },
                { href: '/dex/dms/trash', icon: 'bi-trash', label: 'Trash' },
            ],
        },
        {
            title: 'Tracker',
            links: [
                { href: '/dex/dts/incoming', icon: 'bi-box-arrow-in-down', label: 'Incoming' },
                { href: '/dex/dts/inbox', icon: 'bi-inbox', label: 'Inbox' },
                { href: '/dex/dts/outgoing', icon: 'bi-send', label: 'Outgoing' },
                { href: '/dex/dts/drafts', icon: 'bi-file-earmark-text', label: 'Drafts' },
                { href: '/dex/dts/broadcast-inbox', icon: 'bi-megaphone', label: 'Broadcast Inbox' },
                { href: '/dex/dts/archive', icon: 'bi-archive', label: 'Archive' },
                { href: '/dex/dts/trash', icon: 'bi-trash', label: 'Trash' },
            ],
        },
    ];
</script>

<j.Card border noshadow p="0">
    <div class="list-group list-group-flush">
        {#each sections as section}
            <div class="list-group-item small">
                <strong>{section.title}</strong>
            </div>
            {#each section.links as link}
                <span onclick={() => goto(link.href)} class="list-group-item list-group-item-action small cursor-pointer" class:active={page.url.pathname.startsWith(link.href)}>
                    <i class={`bi ${link.icon} me-2`}></i>{link.label}
                </span>
            {/each}
        {/each}
    </div>
</j.Card>

<style>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
