<script>
    import { onMount } from 'svelte';

    let year = $state('');

    onMount(() => {
        const date = new Date();
        year = date.getFullYear();
    });
</script>

<div class="border-top pt-3 my-5 text-muted small">
    <div class="container">
        <div class="row">
            <div class="col-md-6 d-flex align-items-center">©&nbsp<span bind:innerText={year} contenteditable=""></span>&nbspVeterans Memorial Medical Center · Developed by IMISS</div>
            <div class="col-md-6 d-flex justify-content-md-end mt-2 mt-md-0">
                <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" class="custom-link me-3"><i class="bi bi-shield-lock"></i> Data Privacy</a>
                <a href="https://vmmc.gov.ph/" target="_blank" class="custom-link me-3"><i class="bi bi-globe"></i> Website</a>
                <a href="https://www.facebook.com/vmmc.miso/" target="_blank" class="custom-link me-3"><i class="bi bi-facebook"></i> Facebook - @IMISS</a>
            </div>
        </div>
    </div>
</div>
