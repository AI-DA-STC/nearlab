import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { cx } from '@/shared/lib';
import { submitContact } from '../api/submit-contact';
import { CONTACT_TOPICS, type ContactMessage } from '../model/contact';
import styles from './ContactForm.module.css';

type SendState = 'idle' | 'sending' | 'sent' | 'failed';

const STATUS_TEXT: Record<SendState, string> = {
  idle: '',
  // The button carries the in-flight state.
  sending: '',
  sent: 'Thanks, your message has been sent. We will reply to the email address you gave.',
  failed: 'Your message could not be sent. Please try again in a moment.',
};

function readContactForm(form: HTMLFormElement): ContactMessage {
  const data = new FormData(form);
  const text = (field: string) => String(data.get(field) ?? '').trim();
  return {
    name: text('name'),
    email: text('email'),
    organisation: text('organisation'),
    topic: text('topic'),
    message: text('message'),
    botcheck: data.has('botcheck'),
  };
}

function Field({
  id,
  label,
  optional = false,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx(styles.field, wide && styles.wide)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

/** The lab's enquiry form. Submissions go through Web3Forms to the team's
 *  Slack channel; the visitor's address becomes the reply-to. */
export function ContactForm() {
  const id = useId();
  const [state, setState] = useState<SendState>('idle');
  const sending = state === 'sending';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState('sending');
    try {
      await submitContact(readContactForm(form));
      form.reset();
      setState('sent');
    } catch {
      setState('failed');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field id={`${id}-name`} label="Name">
        <input
          id={`${id}-name`}
          name="name"
          className={styles.control}
          autoComplete="name"
          required
        />
      </Field>
      <Field id={`${id}-email`} label="Email">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          className={styles.control}
          autoComplete="email"
          required
        />
      </Field>
      <Field id={`${id}-organisation`} label="Organisation" optional>
        <input
          id={`${id}-organisation`}
          name="organisation"
          className={styles.control}
          autoComplete="organization"
        />
      </Field>
      <Field id={`${id}-topic`} label="About">
        <select
          id={`${id}-topic`}
          name="topic"
          className={styles.control}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Choose one
          </option>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}-message`} label="Message" wide>
        <textarea
          id={`${id}-message`}
          name="message"
          className={cx(styles.control, styles.message)}
          rows={6}
          maxLength={5000}
          required
        />
      </Field>

      {/* Honeypot: hidden from people and from assistive tech, so only a bot
          ticks it. */}
      <input
        type="checkbox"
        name="botcheck"
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" className={cx(styles.status, state === 'failed' && styles.failed)}>
          {STATUS_TEXT[state]}
        </p>
      </div>
    </form>
  );
}
