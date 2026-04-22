<script>
    import { onMount } from 'svelte';
    import j from '$lib/components/helper';

    let year = $state('');

    onMount(() => {
        const date = new Date();
        year = date.getFullYear();
    });
</script>

<div class="border-top pt-3 my-5 text-muted small">
    <div class="container">
        <j.Row>
            <j.Col>
                ©&nbsp<span bind:innerText={year} contenteditable=""></span>&nbspVeterans Memorial Medical Center • Developed by IMISS
            </j.Col>
            <j.Col auto>
                <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" class="custom-link me-3"><i class="bi bi-shield-lock me-1"></i>Data Privacy</a>
                <a href="https://vmmc.gov.ph/" target="_blank" class="custom-link me-3"><i class="bi bi-globe me-1"></i>Website</a>
                <a href="https://www.facebook.com/vmmc.miso/" target="_blank" class="custom-link me-3"><i class="bi bi-facebook me-1"></i>Facebook - @IMISS</a>
            </j.Col>
        </j.Row>
    </div>
</div>
