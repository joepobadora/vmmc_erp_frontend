<script>
    import { onMount } from 'svelte';

    let opened = false;
    let dotScale = 1;
    let sequence = '';

    const poems = [
        [
            'hi.',
            '',
            "i don't know you.",
            "and you don't know me.",
            '',
            'but somehow',
            'our timelines crossed here.',
            '',
            'so for a moment',
            'you are not alone on this page.',
            '',
            'i hope today was gentle with you.',
            "and if it wasn't",
            'i hope tomorrow apologizes softly.',
        ],

        [
            'you made it here.',
            '',
            'that means you survived today.',
            '',
            'people underestimate that word',
            'survived.',
            '',
            'sometimes it looks like courage.',
            'sometimes it looks like breathing.',
            '',
            'both count.',
        ],

        ['maybe today felt slow.', '', 'maybe the hours dragged', 'like heavy shoes through mud.', '', 'if that happened', '', 'thank you', 'for still being here anyway.'],

        [
            'someone out there',
            'once smiled because of you.',
            '',
            'you might not remember it.',
            'they might not remember your name.',
            '',
            'but it happened.',
            '',
            'small kindnesses echo',
            'longer than we think.',
        ],

        ['you do not have to win today.', '', 'you do not have to prove anything.', '', 'you can simply exist', 'like trees do.', '', 'quietly', 'steadily', '', 'still worthy of sunlight.'],

        ['rest is not failure.', '', 'rest is repair.', '', 'even the ocean', 'pulls back from the shore', '', 'before it returns.'],

        ['if your mind feels loud today', '', 'that is okay.', '', 'storms are noisy too.', '', 'and storms', 'still pass.'],

        ['maybe nobody asked', 'how you were today.', '', 'so let me ask instead.', '', 'how are you, really?', '', 'whatever the answer is', 'it is allowed.'],

        ['there are people', 'who have not met you yet', '', 'but their lives', 'will be brighter', '', 'because one day', 'you will walk into them.'],

        ['you are not late.', '', 'life is not a race', 'with a single clock.', '', 'some stories bloom early.', 'some bloom slowly.', '', 'both become gardens.'],

        ['if today felt pointless', '', 'remember this:', '', 'some seeds sit in the soil', 'for months', '', 'before anyone sees green.'],

        ['the world is loud.', '', 'but quiet things', 'are still powerful.', '', 'breathing.', 'kindness.', 'staying.'],

        ['someone once believed', 'you could exist.', '', 'that is why you are here.', '', 'so perhaps', 'believing in yourself', '', 'is not such a strange idea.'],

        ['there is a version of you', 'in the future', '', 'who is grateful', 'you did not give up today.'],

        ['thank you', 'for staying alive', 'in a world', 'that sometimes forgets', 'how heavy that can be.', '', 'your presence', 'still matters.'],
        [
            'hi.',
            'you found this tiny quiet place.',
            '',
            "i don't know what kind of day you had.",
            'maybe it was heavy.',
            'maybe it was just… long.',
            '',
            "but you're here.",
            'and that means something survived today.',
            '',
            'sometimes survival looks quiet.',
            'like breathing.',
            'like continuing.',
            'like opening a random page on the internet.',
            '',
            'so if no one told you today:',
            '',
            "i'm glad you exist.",
            '',
            'take one slow breath.',
            '',
            "you're allowed to rest here for a moment.",
        ],
    ];

    let poem = poems[Math.floor(Math.random() * poems.length)];

    let displayedLines = [];
    let currentLine = '';
    let lineIndex = 0;
    let charIndex = 0;

    function openEgg() {
        if (!opened) {
            opened = true;
            typeLine();
        }
    }

    function typeLine() {
        if (lineIndex >= poem.length) return;

        const line = poem[lineIndex];

        if (charIndex < line.length) {
            currentLine += line[charIndex];
            charIndex++;
            setTimeout(typeLine, 40);
        } else {
            displayedLines = [...displayedLines, currentLine];
            currentLine = '';
            charIndex = 0;
            lineIndex++;

            setTimeout(typeLine, 900);
        }
    }

    function breathe() {
        dotScale = 1.1;
        setTimeout(() => (dotScale = 1), 800);
    }

    function handleKey(e) {
        sequence += e.key.toLowerCase();

        if (sequence.includes('hi')) {
            displayedLines = [...displayedLines, '', 'oh.', 'someone curious enough to say hi.', 'i like that.'];
            sequence = '';
        }

        if (sequence.length > 10) sequence = '';
    }

    onMount(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });
</script>

<div class="page">
    <div class="dot" on:click={openEgg} on:mouseenter={breathe} style="transform: scale({dotScale})" />

    {#if opened}
        <div class="poem">
            {#each displayedLines as line}
                <p>{line}</p>
            {/each}

            <p class="typing">{currentLine}<span class="cursor">|</span></p>
        </div>
    {/if}
</div>

<style>
    .page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle, #ffffff, #f6f6f6);
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
        opacity: 0.7;
        transition: all 1s ease;
    }

    .dot:hover {
        opacity: 1;
    }

    .poem {
        margin-top: 32px;
        max-width: 360px;
        text-align: center;
        line-height: 1.9;
        font-size: 15px;
    }

    .poem p {
        margin: 6px 0;
        opacity: 0;
        animation: fadeIn 1.8s forwards;
    }

    .typing {
        opacity: 0.9;
    }

    .cursor {
        animation: blink 1s infinite;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(6px);
        }
        to {
            opacity: 0.9;
            transform: translateY(0);
        }
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }
</style>
