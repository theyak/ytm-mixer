import { writable } from 'svelte/store';

/**
 * Set to true to enable the login modal.
 * It seems like there would be a better way to do this.
 */
export const login = writable(false);

/**
 * Flag indicating if user is successfully signed in to YouTube Music
 */
export const isLoggedIn = writable(false);

/**
 * Progress bar for various things. Negative value to hide.
 */
export const progress = writable(-1);

/**
 * Show the left side navigation drawer
 */
export const hideDrawer = writable(true);

/**
 * Playlists. Generally loaded on page load or on login.
 */
export const playlists = writable([]);

/**
 * Songs queued up for playing
 */
export const queue = writable([]);

/**
 * Currently played track
 */
export const currentTrack = writable(null);