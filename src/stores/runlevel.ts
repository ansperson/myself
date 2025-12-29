import { writable } from 'svelte/store';

export const runlevel = writable(3);
export const booting = writable(false);
