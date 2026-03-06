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

// ================== EVENT CATEGORIES ==================

/**
 * Lista de todas las categorías de eventos
 */
export const eventCategoriesQueryKey = ['event-categories'] as const;

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

// ================== ADMIN EVENTS ==================

/**
 * Lista de eventos admin filtrada por estado
 * @param filter - Estado del filtro: pending | active | finished | deleted
 */
export const adminEventsQueryKey = (filter: string) => ['events', 'admin', filter] as const;

/**
 * Detalle de un evento desde el endpoint admin (cualquier estado)
 * @param uuid - UUID del evento
 */
export const adminEventDetailQueryKey = (uuid: string) => ['events', 'admin', uuid] as const;

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

// ================== PARTNERS - CITIES ==================

export const citiesQueryKey = (status?: string) =>
  status ? (['cities', { status }] as const) : (['cities'] as const);

export const cityDetailQueryKey = (uuid: string) => ['cities', uuid] as const;

export const allActiveCitiesQueryKey = ['cities', 'all-active'] as const;

// ================== PARTNERS - ORGANIZERS ==================

export const organizersQueryKey = (status?: string) =>
  status ? (['organizers', { status }] as const) : (['organizers'] as const);

export const organizerDetailQueryKey = (uuid: string) => ['organizers', uuid] as const;

export const allActiveOrganizersQueryKey = ['organizers', 'all-active'] as const;

// ================== PARTNERS - SPONSORS ==================

export const sponsorsQueryKey = (status?: string) =>
  status ? (['sponsors', { status }] as const) : (['sponsors'] as const);

export const sponsorDetailQueryKey = (uuid: string) => ['sponsors', uuid] as const;

export const allActiveSponsorsQueryKey = ['sponsors', 'all-active'] as const;

