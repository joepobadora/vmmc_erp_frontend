import { writable } from 'svelte/store';

// used to allow or restrict draft creation
const draftHasSource = writable(false);

// used to store the draft file
const draftFile = writable(null);

// used to store the draft record
const draftRecord = writable(null);

// used to store the document source
const documentSource = writable(null);

export { draftHasSource, draftFile, draftRecord, documentSource };
