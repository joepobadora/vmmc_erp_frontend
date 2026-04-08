import { writable } from 'svelte/store';

const draftTemplate = {
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

const draft = writable(draftTemplate);

export { draft };
