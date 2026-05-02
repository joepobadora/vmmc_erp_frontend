<script>
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';

    let closeModalButton;

    let { title, titleRoute, showHome, hideSettings } = $props();

    let firstName = $state('');

    let loggingOut = $state(false);

    onMount(async () => {
        try {
            const result = await App.API.get('/me');

            const data = result.data.data;

            if (result.data.success) {
                firstName = data['user']['first_name'];
            } else {
                console.log(result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    });

    async function Logout() {
        try {
            // udpate button state
            loggingOut = true;

            const result = await App.API.get('/logout');

            if (result.data.success) {
                setTimeout(() => {
                    localStorage.removeItem('access_token');
                    closeModalButton.click();
                    goto('/login');
                }, 600);
            } else {
                console.log(result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loggingOut = false;
        }
    }
</script>

<!-- Navbar -->
<div class="custom-bg-color p-3 pb-2 shadow-sm">
    <j.Row mb="0">
        <j.Col auto>
            <a href={titleRoute} class="text-decoration-none d-flex gap-2">
                <img src="/vmmc_logo.png" alt="" height="24px" width="24px" />
                <h5 class="text-light fw-normal">{title}</h5>
            </a>
        </j.Col>
        <j.Col></j.Col>
        <j.Col auto>
            <div class="dropdown text-light">
                <a class="nav-link dropdown-toggle" href="/" data-bs-toggle="dropdown" aria-label="menu button">
                    <i class="bi bi-three-dots-vertical"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-label="menu dropdown">
                    <li class="px-4 py-2">
                        <p class="small text-secondary mb-1">Signed in as:</p>
                        <h6>{firstName}</h6>
                    </li>
                    {#if showHome}
                        <li>
                            <a class="dropdown-item small" href="/">
                                <i class="bi bi-house me-2"></i> Home
                            </a>
                        </li>
                    {/if}
                    {#if !hideSettings}
                        <li>
                            <a class="dropdown-item small" href="/settings">
                                <i class="bi bi-gear me-2"></i> Settings
                            </a>
                        </li>
                    {/if}
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                        <a class="dropdown-item small" href="/" data-bs-toggle="modal" data-bs-target="#logoutModal">
                            <i class="bi bi-box-arrow-left me-2"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </j.Col>
    </j.Row>
</div>

<!-- Logout Modal -->
<div class="modal fade" id="logoutModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Logout</h5>
                <button bind:this={closeModalButton} type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="close logout modal"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to logout?</p>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-light border btn-sm px-3 {loggingOut == true ? 'd-none' : ''}" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger btn-sm px-3" onclick={Logout} disabled={loggingOut}>
                    {#if loggingOut}
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Logging out...
                    {:else}
                        <i class="bi bi-box-arrow-left me-2"></i>Logout
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .custom-bg-color {
        /* Base teal background */
        background-color: #004d4d;

        background-image:
    /* Primary teal wash, but lighter and more diffuse */
            radial-gradient(circle at 0% 0%, rgba(0, 128, 128, 0.6) 0%, transparent 80%),
            /* Muted indigo accent, softer opacity */ radial-gradient(circle at 100% 0%, rgba(74, 86, 153, 0.08) 0%, transparent 70%),
            /* Cyan lift, more subtle */ radial-gradient(circle at 50% 150%, rgba(77, 182, 172, 0.5) 0%, transparent 90%),
            /* Dark ocean depth, softened */ radial-gradient(circle at 100% 100%, rgba(0, 51, 51, 0.4) 0%, transparent 80%);
    }
</style>
