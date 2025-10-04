<!-- +page.svelte -->
<script>
    import TreeView from './TreeView.svelte';
</script>

<div class="row">
    <div class="col">
        <div class="accordion accordion-flush shadow-sm" id="accordionFlushExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Library
                    </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item’s accordion body.
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                        My Documents
                    </button>
                </h2>
                <div id="flush-collapseTwo" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the second item’s accordion body. Let’s imagine this being
                        filled with some actual content.
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                        Archive
                    </button>
                </h2>
                <div id="flush-collapseThree" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the third item’s accordion body. Nothing more exciting
                        happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Make accordion headers smaller */
    .accordion-button {
        font-size: 0.875rem; /* same as btn-sm */
        padding: 0.5rem 0.75rem; /* same as btn-sm & form-control-sm */
    }
    /* Smaller accordion body */
    .accordion-body {
        font-size: 0.875rem;
        padding: 0.75rem 1.25rem;
    }
</style>
