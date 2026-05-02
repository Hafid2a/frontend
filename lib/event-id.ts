import { v4 as uuidv4 } from "uuid";

export function generateEventId(eventName: string): string {
  return `${eventName}_${uuidv4()}`;
}
