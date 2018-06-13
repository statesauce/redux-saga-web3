import snakeCase from "lodash.snakecase";

function camelToUpperSnakeCase(str) {
  return snakeCase(str).toUpperCase();
}

export { camelToUpperSnakeCase as formatName };
