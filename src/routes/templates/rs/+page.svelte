<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { Designer } from '@pdfme/ui';
    import { text, checkbox, table, list, image } from '@pdfme/schemas';
    import { BLANK_A4_PDF } from '@pdfme/common';
    import j from '$lib/components/helper';

    let { data } = $props();

    let file = $state(null);

    let container;
    let designerInstance;

    onMount(async () => {
        await initFile();

        if (file) {
            initDesigner();
        }
    });

    // Fetch PDF from backend
    async function initFile() {
        try {
            const result = await App.API.get('/templates/rs/file', {
                responseType: 'blob',
            });

            // blob -> arraybuffer -> uint8array
            const buf = await result.data.arrayBuffer();

            file = new Uint8Array(buf);
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        }
    }

    function initDesigner() {
        const templateFromDb = typeof data?.template === 'string' ? JSON.parse(data.template) : data?.template;

        let schemas = templateFromDb?.schemas ?? [[]];

        // Clean the schemas coming from the DB to prevent the 'slice' error
        schemas = cleanSchema(schemas);

        const template = {
            basePdf: file ?? BLANK_A4_PDF,
            schemas: schemas,
        };

        designerInstance = new Designer({
            domContainer: container,
            template,
            plugins: { text, checkbox, table, list, image },
        });
    }

    async function save() {
        try {
            const template = designerInstance.getTemplate();

            // Clean the schemas before saving
            template.schemas = cleanSchema(template.schemas);

            const result = await App.API.post('/templates/rs/store', {
                template,
            });

            if (result.data.success) {
                setTimeout(() => {
                    Alert.show('success', 'Saving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Saving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    }

    function cleanSchema(schemas) {
        return schemas.map((page) =>
            page.map((item) => {
                // Filter out any property that is strictly null
                return Object.fromEntries(Object.entries(item).filter(([_, value]) => value !== null));
            })
        );
    }
</script>

<j.RowCol centerx>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" onclick={save}><i class="bi bi-check-lg me-2"></i>Save Template</button>
    </div>
</j.RowCol>

<div bind:this={container} style="width: 100%; height: 100vh;"></div>
