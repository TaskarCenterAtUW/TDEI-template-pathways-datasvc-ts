import { Response } from 'express';
/**
 * Returns a succeeded response with 200 status code.
 * @param response The http-response to be modified.
 * @param body An optional body that will be sent within the response' body.
 */
export function Ok(response: Response, body?: any): Response {
  return body ? response.send(body) : response.send();
}

/**
 * Returns a bad-request response with 200 status code.
 * @param response The http-response to be modified.
 * @param body An optional body that will be sent within the response' body.
 */
export function BadRequest(response: Response, body?: any): Response {
  return body ? response.status(400).send(body) : response.status(400).send();
}


/**
 * Returns a notfound response with 404 status code.
 * @param response The http-response to be modified.
 * @param body An optional body that will be sent within the response' body.
 */
export function NotFound(response: Response, body?: any): Response {
  return body ? response.status(404).send(body) : response.status(404).send();
}
