<script>
    import { onMount } from 'svelte';
    import { Designer } from '@pdfme/ui';
    import { text, image, rectangle, barcodes } from '@pdfme/schemas';

    let container;
    let designerInstance;

    onMount(async () => {
        // 1. Fetch the real-world blank form from your static folder
        const response = await fetch('/document.pdf');
        const pdfBlob = await response.blob();

        // 2. Convert it to a Base64 Data URI (or ArrayBuffer) for pdfme
        const basePdf = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(pdfBlob);
        });

        // 3. Define the template using your real form as the background
        const template = {
            basePdf: basePdf, // Your actual form is now the background!
            schemas: [
                [
                    // You can start with empty schemas or placeholder inputs
                ],
            ],
        };

        // 4. Initialize the Designer
        designerInstance = new Designer({
            domContainer: container,
            template,
            plugins: {
                text,
                image,
                rect: rectangle,
                qrcode: barcodes.qrcode,
            },
        });
    });
</script>

<div bind:this={container} style="width: 100%; height: 100vh;"></div>
