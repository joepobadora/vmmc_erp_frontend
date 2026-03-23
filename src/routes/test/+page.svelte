<script>
    let file = null;

    async function handleSubmit() {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost/api/test/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                console.log('Upload successful:');
                console.log('Path:', result.path);
                console.log('Text :', result.text);
                alert('File uploaded successfully!');
            } else {
                console.error('Upload failed:', result.message);
                alert('Upload failed.');
            }
        } catch (err) {
            console.error('Error uploading file:', err);
            alert('Error uploading file.');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="file" on:change={(e) => (file = e.target.files[0])} />
    <button type="submit">Upload</button>
</form>
