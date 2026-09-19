import type { ContactMessage } from '../model/contact';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Web3Forms routes a submission to the address its key was registered with —
 * here the lab's inbound-requests Slack channel. The key is designed to ship
 * in client code (the free plan only accepts browser submissions), so it is
 * public by intent rather than a leaked secret. Regenerate it in the Web3Forms
 * dashboard if it is ever abused.
 */
const WEB3FORMS_ACCESS_KEY = '2c67bb8f-ec27-422c-b169-363f75aace8c';

interface Web3FormsResponse {
  readonly success?: boolean;
  readonly message?: string;
}

/** Sends one enquiry. Resolves once Web3Forms accepts it, rejects otherwise. */
export async function submitContact(contact: ContactMessage): Promise<void> {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Website enquiry: ${contact.topic}`,
      from_name: 'NEAR Lab website',
      botcheck: contact.botcheck,
      name: contact.name,
      email: contact.email,
      organisation: contact.organisation,
      topic: contact.topic,
      message: contact.message,
    }),
  });

  const result = (await response.json().catch(() => ({}))) as Web3FormsResponse;
  if (!response.ok || !result.success) {
    throw new Error(result.message ?? `Web3Forms responded ${response.status}`);
  }
}
