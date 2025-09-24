// src/lib/stores/bootstrap.js
import { writable } from 'svelte/store';

function bootstrapClientStore() {
  const client = writable(null);

  return client;
}

export const BootstrapClient = bootstrapClientStore();
