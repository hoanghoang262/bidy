export enum HTTP_STATUS_CODES {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum APP_CONSTANTS {
  AUTH_COOKIE_NAME = "authCookie",
  USER_COOKIE_NAME = "userCookie",
}

export enum STATUS_AUCTIONS {
  INITIAL = "initial",
  HAPPENING = "happenning",
  ENDED = "ended",
}
