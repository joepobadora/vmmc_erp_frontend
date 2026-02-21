<script>
    import { onMount } from 'svelte';

    let opened = false;
    let revealed = false;
    let message = '';
    let dotScale = 1;
    let sequence = '';

    const messages = [
        'you are allowed to exist without proving anything',
        'rest is not a failure state',
        'you survived 100% of your hardest days',
        'this moment does not need improvement',
        'you are not behind',
        'small progress is real progress',
        'you are still becoming',
        "it's okay to breathe slowly",
        'nothing is wrong with you for feeling tired',
        'you deserve gentleness too',
        "you don't need permission to rest",
        'existing is enough sometimes',
        'your presence has weight',
        'you matter even when quiet',
        'softness is not weakness',
        'curiosity is courage',
        'you are allowed to begin again',
        'there is no rush here',
        'you are not late to your life',
        'you can take up space',
        'peace is productive',
        'being here is meaningful',
        'you are not alone in feeling this way',
        'your nervous system deserves kindness',
        'you can move one inch at a time',
        'tiny steps still move mountains',
        'you are not a machine',
        "it's okay to pause",
        'you deserve good things without earning pain first',
        'you are allowed to be human',
        'you can exhale',
        'you are not broken',
        'your story is still unfolding',
        'this version of you is allowed',
        'you are worthy of calm',
        'there is nothing missing from you',
        'you are enough in quiet ways',
        'you can start small',
        'you are safe to slow down',
        'your existence is not a mistake',
    ];

    function openEgg() {
        if (!opened) {
            opened = true;
            message = randomMessage();
        } else {
            message = randomMessage();
        }
    }

    function randomMessage() {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function handleKey(e) {
        sequence += e.key.toLowerCase();

        // secret word: "hi"
        if (sequence.includes('hi')) {
            revealed = true;
            message = 'oh. hello there.';
            sequence = '';
        }

        if (sequence.length > 10) sequence = '';
    }

    function breathe() {
        dotScale = 1.08;
        setTimeout(() => (dotScale = 1), 600);
    }

    onMount(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });
</script>

<div class="page">
    <div class="dot" class:opened on:click={openEgg} on:mouseenter={breathe} style="transform: scale({dotScale})" />

    {#if opened}
        <p class="message">{message}</p>
    {/if}

    {#if revealed}
        <div class="secret">you were curious. i like that.</div>
    {/if}
</div>

<style>
    .page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
        color: #222;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #222;
        cursor: pointer;
        transition: all 0.6s ease;
        opacity: 0.6;
    }

    .dot:hover {
        opacity: 1;
    }

    .dot.opened {
        width: 14px;
        height: 14px;
    }

    .message {
        margin-top: 24px;
        font-size: 14px;
        opacity: 0;
        animation: fadeIn 2s forwards;
        text-align: center;
        max-width: 260px;
        line-height: 1.6;
    }

    .secret {
        position: absolute;
        bottom: 20px;
        font-size: 11px;
        opacity: 0.4;
        animation: fadeIn 3s forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(6px);
        }
        to {
            opacity: 0.8;
            transform: translateY(0);
        }
    }
</style>
