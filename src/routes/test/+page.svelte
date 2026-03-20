<script>
    let options = ['Apple', 'Banana', 'Orange'];
    let selected = [];

    function addItem(event) {
        const value = event.target.value;
        if (value && !selected.includes(value)) {
            selected = [...selected, value];
        }
        event.target.value = '';
    }

    function removeItem(item) {
        selected = selected.filter((v) => v !== item);
    }
</script>

<select class="form-select w-auto" on:change={addItem}>
    <option value="">Choose a fruit</option>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>

<div class="mt-3 d-flex flex-wrap gap-2">
    {#each selected as item}
        <span class="badge bg-secondary d-flex align-items-center gap-1">
            {item}
            <i class="bi bi-x ms-1" style="cursor:pointer" on:click={() => removeItem(item)}></i>
        </span>
    {/each}
</div>
