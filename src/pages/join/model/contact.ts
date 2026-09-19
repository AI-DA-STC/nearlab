import { COLLABORATION_ROUTES } from './collaboration';

/** The contact section's heading id, which the route cards scroll to. */
export const CONTACT_ANCHOR_ID = 'contact';

/** What an enquiry is about: one of the collaboration routes, or anything else. */
export const CONTACT_TOPICS: readonly string[] = [
  ...COLLABORATION_ROUTES.map((route) => route.title),
  'Something else',
];

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
  readonly topic: string;
  readonly message: string;
  /** The honeypot. People never see the field, so only a bot fills it, and
   *  Web3Forms drops any submission that arrives with it set. */
  readonly botcheck: boolean;
}
