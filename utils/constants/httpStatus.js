module.exports = {
	OK: 200, //                          * Normal
	CREATED: 201, //                     * Create new entity
	UPDATED: 200, //                     * PUT/PATCH Requests
	DELETED: 200, //                     * DELETE requests
	BAD_REQUEST: 400, //                 * A bad request
	UNAUTHORIZED: 401, //                *
	FORBIDDEN: 403, //                   *
	NOT_FOUND: 404, //                   * Endpoint not found
	CONFLICT: 409,
	VALIDATION_ERROR: 422, //            * Un processable Entity
	INTERNAL_SERVER_ERROR: 500, //       * Server error
};
