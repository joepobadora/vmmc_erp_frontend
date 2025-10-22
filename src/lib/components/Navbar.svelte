<script>
    import { goto } from '$app/navigation';
    import { BootstrapClient } from '$lib/stores/bootstrapClient';
    import { onMount } from 'svelte';
    import App from '$lib/assets/js/bootstrap';

    let el;
    let logoutModal;
    let { title, titleRoute, showHome } = $props();

    $effect(() => {
        if ($BootstrapClient) {
            logoutModal = $BootstrapClient.Modal.getOrCreateInstance(el);
        }
    });

    onMount(() => {});

    function Logout() {
        App.API.removeToken();
        logoutModal.hide();
        goto('/login');
    }
</script>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow py-1 px-2">
    <div class="container-fluid">
        <a class="navbar-brand" href={titleRoute}>{title}</a>

        <div class="dropdown text-light">
            <a class="nav-link dropdown-toggle" href="/" data-bs-toggle="dropdown" aria-label="menu button">
                <i class="bi bi-three-dots-vertical"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-label="menu dropdown">
                <li class="px-4 py-2">
                    <p class="small text-secondary mb-1">Signed in as:</p>
                    <h6>Joe Louis</h6>
                </li>
                {#if showHome}
                    <li>
                        <a class="dropdown-item small" href="/">
                            <i class="bi bi-house me-2"></i> Home
                        </a>
                    </li>
                {/if}
                <li>
                    <a class="dropdown-item small" href="/settings">
                        <i class="bi bi-gear me-2"></i> Settings
                    </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                    <a class="dropdown-item small" href="/" data-bs-toggle="modal" data-bs-target="#logoutModal">
                        <i class="bi bi-box-arrow-left me-2"></i> Logout
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Logout Modal -->
<div bind:this={el} class="modal fade" id="logoutModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Logout</h5>
                <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="close logout modal"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to logout?</p>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-light border btn-sm px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger btn-sm px-3" onclick={Logout}><i class="bi bi-box-arrow-left me-2"></i>Logout</button>
            </div>
        </div>
    </div>
</div>
