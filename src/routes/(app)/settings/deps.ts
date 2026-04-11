/**
 * invalidate() key for refreshing the active sessions list after revoking a session.
 * The +page.server.ts load uses `depends(SETTINGS_SESSIONS_DEP)`, and the client
 * calls `invalidate(SETTINGS_SESSIONS_DEP)` to re-run the server load.
 */
export const SETTINGS_SESSIONS_DEP = 'settings:sessions';
