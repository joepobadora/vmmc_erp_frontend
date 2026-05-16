<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { Designer } from '@pdfme/ui';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { text, checkbox, table, list, image } from '@pdfme/schemas';
    import { BLANK_A4_PDF } from '@pdfme/common';
    import { generate } from '@pdfme/generator';
    import j from '$lib/components/helper';
    import { draft } from '$lib/stores/dms';

    let { data } = $props();

    let attaching = $state(false);

    let file = $state(null);

    let container;
    let designerInstance;

    const p = new App.ParamBuilder(page.url.searchParams);

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

    async function attach() {
        if (!designerInstance) return;

        attaching = true;
        try {
            // 1. Grab the template structure (layout, fonts, base PDF)
            const template = designerInstance.getTemplate();

            // 2. Direct helper to grab exactly what the user input/typed into the canvas
            const inputs = template.schemas.map((pageSchema) => {
                const pageInput = {};
                pageSchema.forEach((item) => {
                    // Map the unique 'name' of the field to whatever content ('data') the user typed
                    pageInput[item.name] = item.content ?? '';
                });
                return pageInput;
            });

            // console.log('Captured user inputs:', inputs);

            // 3. Generate the PDF combining the layout and the captured inputs
            const pdfUint8Array = await generate({
                template,
                inputs,
                plugins: { text, checkbox, table, list, image },
            });

            // 4. Convert the generated buffer into a standard File object
            const pdfBlob = new Blob([pdfUint8Array.buffer], { type: 'application/pdf' });
            const syntheticUploadFile = new File([pdfBlob], 'reference_slip_upload.pdf', {
                type: 'application/pdf',
                lastModified: Date.now(),
            });

            $draft.file = syntheticUploadFile;

            if ($draft.file) {
                setTimeout(() => {
                    $draft.source = 'DOCSRC1'; // source code for file
                    goto(`/dex/dms/drafts/create${p.toString()}`);
                    attaching = false;
                }, 600);
            }
        } catch (err) {
            console.error('PDF Generation/Attachment Error:', err);
            Alert.show('error', 'Generation failed.', err.message);
        } finally {
            attaching = false;
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

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts/create">Create</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts/create/template">Template</a></li>
            <li class="breadcrumb-item small active">Reference Slip</li>
        </ol>
    </nav>
</j.RowCol>

<div bind:this={container} style="width: 100%; height: 100vh;"></div>

<j.RowCol endx>
    <div class="d-flex gap-2">
        <j.Button label="Attach File" loadinglabel="Attaching" icon="bi-link-45deg" loading={attaching} onClick={attach} />
    </div>
</j.RowCol>
