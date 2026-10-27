<!-- +page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';

    let badges = $state({
        '/dex/dts/incoming': 0,
    });

    let officeId = $state(0);

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
                { href: '/dex/dts/broadcast-inbox', icon: 'bi-megaphone', label: 'Broadcast Inbox' },
                { href: '/dex/dts/archive', icon: 'bi-archive', label: 'Archive' },
                { href: '/dex/dts/trash', icon: 'bi-trash', label: 'Trash' },
            ],
        },
    ];

    onMount(async () => {
        let officeId = null;

        // 1. Fetch initial badge count and current user/office in parallel
        try {
            const [incomingResult, meResult] = await Promise.all([App.API.get('/dex/dts/incoming/unread-count'), App.API.get('/me')]);

            badges['/dex/dts/incoming'] = incomingResult.data.data;
            officeId = meResult.data.data.account?.office_id;
        } catch (err) {
            console.error('Failed to initialize sidebar counts or office state:', err);
        }

        // 2. Guard clause: Ensure officeId exists and WebSocket client is ready
        if (!officeId || !App?.WebSocket) return;

        const channelName = `office.${officeId}`; // Correct string interpolation

        // 3. Subscribe to the public channel
        const channel = App.WebSocket.channel(channelName);

        // 4. Listen for real-time payload updates
        channel.listen('.dts.incoming', (payload) => {
            badges['/dex/dts/incoming'] = payload.count;

            console.clear();
            console.log(payload);
        });

        // 5. Cleanup on unmount (must pass the full private channel name)
        return () => {
            App.WebSocket.leave(channelName);
        };
    });
</script>

<j.Card border noshadow p="0">
    <div class="list-group list-group-flush">
        {#each sections as section}
            <div class="list-group-item small">
                <strong>{section.title}</strong>
            </div>
            {#each section.links as link}
                <div onclick={() => goto(link.href)} class="list-group-item list-group-item-action small cursor-pointer" class:active={page.url.pathname.startsWith(link.href)}>
                    <j.Row mb="0">
                        <j.Col>
                            <span>
                                <i class={`bi ${link.icon} me-2`}></i>{link.label}
                            </span>
                        </j.Col>
                        {#if link.href == '/dex/dts/incoming' && badges[link.href] > 0}
                            <j.Col span="auto">
                                <span class="badge bg-danger">{badges[link.href]}</span>
                            </j.Col>
                        {/if}
                    </j.Row>
                </div>
            {/each}
        {/each}
    </div>
</j.Card>

<style>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
