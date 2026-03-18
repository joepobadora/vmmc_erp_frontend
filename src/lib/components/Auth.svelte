<script>
    import { fade, fly } from 'svelte/transition';

    let { show = false, close = () => null } = $props();
</script>

<!-- Logout Modal -->
{#if show}
    <div class="modal fade show d-block" id="logoutModal" data-bs-backdrop="static" transition:fly={{ y: -200, duration: 450 }}>
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Logout</h5>
                    <button type="button" class="btn-close btn-sm" onclick={close}></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to logout?</p>
                </div>
                <div class="modal-footer border-top-0">
                    <button type="button" class="btn btn-light border btn-sm px-3" onclick={close}> Cancel </button>
                    <button type="button" class="btn btn-danger btn-sm px-3">
                        <i class="bi bi-box-arrow-left me-2"></i>Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show" transition:fade={{ duration: 150 }}></div>
{/if}
