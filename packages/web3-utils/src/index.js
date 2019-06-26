import snakeCase from "lodash.snakecase";

function camelToUpperSnakeCase(str) {
  return snakeCase(str).toUpperCase();
}

function createAction(type, payload) {
  return payload ? {
    type,
    payload
  } : { type }
}

export { camelToUpperSnakeCase as formatName, createAction };
