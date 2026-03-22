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

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);
                alert('File uploaded successfully!');
            } else {
                console.error('Upload failed:', response.statusText);
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
