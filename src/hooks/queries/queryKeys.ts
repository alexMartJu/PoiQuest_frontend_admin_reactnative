/**
 * Query Keys centralizadas para React Query
 * 
 * Las queryKeys identifican de forma única cada conjunto de datos en caché.
 * Cuando dos queries usan la misma key, comparten automáticamente el caché.
 */

// ================== EVENTS ==================

/**
 * Lista de eventos con paginación
 * @param cursor - Cursor de paginación opcional
 */
export const eventsQueryKey = (cursor?: string | null) =>
  cursor ? (['events', { cursor }] as const) : (['events'] as const);

/**
 * Detalle de un evento específico
 * @param uuid - UUID del evento
 */
export const eventDetailQueryKey = (uuid: string) => ['events', uuid] as const;

/**
 * Eventos filtrados por categoría
 * @param categoryUuid - UUID de la categoría
 * @param cursor - Cursor de paginación opcional
 */
export const eventsByCategoryQueryKey = (categoryUuid: string, cursor?: string | null) =>
  cursor
    ? (['events', 'category', categoryUuid, { cursor }] as const)
    : (['events', 'category', categoryUuid] as const);

// ================== FINISHED EVENTS ==================

/**
 * Lista de eventos finalizados (solo admin)
 */
export const finishedEventsQueryKey = ['events', 'finished'] as const;

/**
 * Detalle de un evento finalizado (solo admin)
 * @param uuid - UUID del evento
 */
export const finishedEventDetailQueryKey = (uuid: string) =>
  ['events', 'finished', uuid] as const;

// ================== USERS ==================

/**
 * Lista de usuarios filtrada por estado
 * @param status - 'active' | 'disabled'
 */
export const usersQueryKey = (status: 'active' | 'disabled') =>
  ['users', status] as const;

// ================== POINTS OF INTEREST ==================

/**
 * POIs de un evento por UUID del evento
 * @param eventUuid - UUID del evento
 */
export const poisByEventQueryKey = (eventUuid: string) =>
  ['pois', 'event', eventUuid] as const;

/**
 * Detalle de un POI específico
 * @param uuid - UUID del POI
 */
export const poiDetailQueryKey = (uuid: string) => ['pois', uuid] as const;
