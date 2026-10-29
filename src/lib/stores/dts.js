import { writable } from 'svelte/store';

const tranTemplate = {
    doc_no: '',
    doc_name: '',
    doc_details: '',
};

const draft = writable(tranTemplate);

export { draft };
