import { writable } from 'svelte/store';

const draftHasSource = writable(false);
const draftFile = writable(null);
const draftRecord = writable(null);

export { draftHasSource, draftFile, draftRecord };
