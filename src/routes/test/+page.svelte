<script>
    import { onMount } from 'svelte';

    onMount(() => {
        const colorInput = document.getElementById('colorInput');
        colorInput.addEventListener('input', (e) => {
            console.log('Selected color:', e.target.value);
        });
    });
</script>

<div class="mb-3">
    <label for="colorInput" class="form-label badge bg-info">Pick a color</label>
    <input type="color" class="form-control form-control-color" id="colorInput" value="#563d7c" title="Choose your color" />
</div>
