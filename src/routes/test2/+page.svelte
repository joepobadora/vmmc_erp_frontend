<!-- src/routes/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import App from '$lib/assets/js/bootstrap';

    // Svelte 5 Rune State
    let badgeCount = $state(0);
    let latestMessage = $state('Waiting for events...');

    onMount(() => {
        // 1. Subscribe to the public channel (matches Channel("office.10") in Laravel)
        const channel = App.WebSocket.channel('office.10');

        // 2. Listen for the broadcastAs() name with a leading dot
        channel.listen('.document.sent', (payload) => {
            console.log('Received Payload:', payload);
            badgeCount = payload.badgeCount;
            latestMessage = payload.message;
        });

        // 3. Cleanup on unmount
        return () => {
            App.WebSocket.leave('office.10');
        };
    });
</script>

<div style="padding: 2rem; font-family: sans-serif;">
    <h2>Reverb Public Channel Test</h2>

    <div style="margin-top: 1rem; padding: 1rem; border: 1px solid #ccc; border-radius: 8px;">
        <p>Target Office: <strong>Office 10</strong></p>
        <p>Incoming Documents: <span style="background: red; color: white; padding: 4px 8px; border-radius: 12px; font-weight: bold;">{badgeCount}</span></p>
        <p>Latest Message: <em>{latestMessage}</em></p>
    </div>
</div>
