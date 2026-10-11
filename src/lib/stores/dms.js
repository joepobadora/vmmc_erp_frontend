import { writable } from 'svelte/store';

const fileTemplate = {
    source: null,
    file: null,
    documentType: '',
    name: '',
    details: '',
    tags: [],
    reviewers: [],
    approvers: [],
    signatories: [],
};

const draft = writable(fileTemplate);
const draftEdit = writable(fileTemplate);

export { draft, draftEdit };
