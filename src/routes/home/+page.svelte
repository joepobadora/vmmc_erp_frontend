<!-- script -->
<script>
    import { Alert } from '$lib/stores/alert';

    const modules = [
        {
            abbr: 'DEx',
            name: 'Document Express (DMTS)',
            desc: 'A centralized platform for creating, organizing, securely storing, and tracking documents throughout their lifecycle.',
            icon: 'bi-diagram-3-fill',
            link: '/dex',
            mainte: false,
        },
        {
            abbr: 'SendIt',
            name: 'Send It',
            desc: 'A secure internal module for fast file sharing and controlled exchange of documents across offices.',
            icon: 'bi-send-fill',
            link: '/sendit',
            mainte: true,
        },
        {
            abbr: 'FormsHub',
            name: 'Forms Hub',
            desc: 'A centralized repository for downloading official forms and standardized templates approved for organizational use.',
            icon: 'bi-file-earmark-text-fill',
            link: '/formshub',
            mainte: true,
        },
        {
            abbr: 'Admin',
            name: 'Admin Console',
            desc: 'A centralized dashboard for system administrators, providing full control over system configuration, users, and access.',
            icon: 'bi-shield-lock-fill',
            link: '/admin',
            mainte: false,
        },
    ];
</script>

<!-- html -->
<div class="d-flex align-items-center justify-content-center">
    <div class="d-flex gap-4">
        {#each modules as config}
            {#if !config.mainte}
                <a href={config.link} class="text-decoration-none text-dark">
                    {@render ModuleCard(config)}
                </a>{:else}
                {@render ModuleCard(config)}
            {/if}
        {/each}
    </div>
</div>

<!-- card snippet -->
{#snippet ModuleCard({ abbr, name, desc, icon, link, mainte })}
    <div class={!mainte ? 'module-card bg-white shadow-sm d-flex flex-column' : 'bg-light border d-flex flex-column'} style:width="300px" style:height="275px">
        <div class="d-flex gap-4 px-4 pt-3 pb-0">
            <div class="d-flex align-items-center pb-3">
                <i class="bi {icon} {!mainte ? 'text-primary' : 'text-secondary'}"></i>
            </div>
            <div>
                <h6 class={!mainte ? 'text-dark' : 'text-secondary'}>{abbr}</h6>
                <p class="small text-secondary">{name}</p>
            </div>
        </div>
        <hr class="m-0 text-secondary" />
        <div class="h-100 d-flex flex-column px-4 py-3">
            <p class="flex-grow-1 {!mainte ? 'text-dark' : 'text-secondary'}">{desc}</p>
            {#if !mainte}
                <p class="module-link small text-primary mb-0">
                    Lauch app<i class="bi bi-box-arrow-up-right ms-2"></i>
                </p>
            {:else}
                <p class="small text-secondary mb-0">Under maintenance</p>
            {/if}
        </div>
    </div>
{/snippet}

<!-- style -->
<style>
    a .module-card:hover {
        box-shadow:
            0px 3px 6px rgba(0, 0, 0, 0.16),
            0px 3px 6px rgba(0, 0, 0, 0.23) !important;
    }

    a .module-card:hover .module-link {
        text-decoration: underline !important;
    }
</style>
