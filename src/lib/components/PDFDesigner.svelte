<script>
    import { onMount } from 'svelte';
    import { Designer } from '@pdfme/ui'; // Or 'Form' if you're ready to fill it
    import { text, image, signature } from '@pdfme/schemas'; // Import signature

    let container;
    let designerInstance;

    onMount(async () => {
        const response = await fetch('/document.pdf');
        const pdfBlob = await response.blob();
        const basePdf = await new Promise((r) => {
            const reader = new FileReader();
            reader.onloadend = () => r(reader.result);
            reader.readAsDataURL(pdfBlob);
        });

        const template = {
            basePdf: basePdf,
            schemas: [
                [
                    {
                        name: 'user_signature',
                        type: 'signature', // Use the signature type
                        position: { x: 120, y: 400 },
                        width: 200,
                        height: 80,
                        strokeWidth: 0.8, // Thinner, elegant line
                        color: '#008080', // Hex code for color
                    },
                ],
            ],
        };

        designerInstance = new Designer({
            domContainer: container,
            template,
            plugins: {
                text,
                image,
                // Add the signature plugin here
                signature,
            },
        });
    });
</script>

<div bind:this={container} style="width: 100%; height: 100vh;"></div>
