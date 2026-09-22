import { CheckCircle2, Mail, Send, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { siteConfig } from '../config/siteConfig';
import { usePortfolio } from '../context/ThemeLanguageContext';
import type { ContactFormErrors, ContactFormValues, SubmissionStatus } from '../types';
import { SectionHeading } from './ui/SectionHeading';

const freshForm = (): ContactFormValues => ({
  name: '', email: '', organization: '', subject: '', message: '', website: '', startedAt: Date.now(),
});

export function ContactSection() {
  const { language, copy } = usePortfolio();
  const [values, setValues] = useState<ContactFormValues>(freshForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const submitting = useRef(false);
  const submissionId = useRef(crypto.randomUUID());

  const validate = (): ContactFormErrors => {
    const next: ContactFormErrors = {};
    if (!values.name.trim()) next.name = copy.contact.validation.required;
    else if (values.name.trim().length < 2) next.name = copy.contact.validation.nameLength;
    if (!values.email.trim()) next.email = copy.contact.validation.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = copy.contact.validation.email;
    if (!values.subject.trim()) next.subject = copy.contact.validation.required;
    else if (values.subject.trim().length < 3) next.subject = copy.contact.validation.subjectLength;
    if (!values.message.trim()) next.message = copy.contact.validation.required;
    else if (values.message.trim().length < 20) next.message = copy.contact.validation.messageLength;
    return next;
  };

  const updateValue = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== 'idle' && status !== 'loading') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (['name', 'email', 'subject', 'message'] as const).find((field) => nextErrors[field]);
      window.requestAnimationFrame(() => firstInvalid && document.getElementById(firstInvalid)?.focus());
      return;
    }

    submitting.current = true;
    setStatus('loading');
    try {
      const response = await fetch(siteConfig.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(), email: values.email.trim(), organization: values.organization.trim(),
          subject: values.subject.trim(), message: values.message.trim(), website: values.website,
          startedAt: values.startedAt, locale: language, submissionId: submissionId.current,
        }),
      });
      if (response.status === 429) {
        setStatus('rate-limited');
      } else if (!response.ok) {
        setStatus('error');
      } else {
        const result = await response.json() as { confirmationSent?: boolean };
        setStatus(result.confirmationSent ? 'success' : 'success-stored');
        setValues(freshForm());
        submissionId.current = crypto.randomUUID();
      }
    } catch {
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  };

  const inputProps = (field: keyof ContactFormValues) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title" data-reveal>
      <div className="container">
        <SectionHeading titleId="contact-title" eyebrow={copy.contact.eyebrow} title={copy.contact.title} intro={copy.contact.intro} icon={<Mail size={14} />} />
        <div className="contact-layout">
          <aside className="contact-card" aria-label={copy.a11y.contactDetails} data-reveal-item>
            <div className="contact-card__icon" aria-hidden="true"><UserRoundCheck size={25} /></div>
            <p className="contact-card__kicker">GloDi MPUTU</p>
            <h3>{copy.contact.asideTitle}</h3>
            <p className="contact-card__body">{copy.contact.asideBody}</p>
            {(siteConfig.owner.location || siteConfig.owner.email || siteConfig.owner.phone) && (
              <>
                <div className="contact-card__rule" />
                <ul>
                  {siteConfig.owner.location && <li>{siteConfig.owner.location}</li>}
                  {siteConfig.owner.email && <li><a href={`mailto:${siteConfig.owner.email}`}>{siteConfig.owner.email}</a></li>}
                  {siteConfig.owner.phone && <li>{siteConfig.owner.phone}</li>}
                </ul>
              </>
            )}
            <p className="contact-card__security">{copy.contact.privacy}</p> 
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={status === 'loading'} data-reveal-item>
            <div className="contact-form__heading"><div><p>GloDi MPUTU</p><h3>{copy.contact.formTitle}</h3></div><Mail size={20} aria-hidden="true" /></div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">{copy.contact.name} <span aria-hidden="true">*</span><span className="sr-only"> — {copy.contact.required}</span></label>
                <input id="name" name="name" autoComplete="name" maxLength={80} required value={values.name} onChange={(event) => updateValue('name', event.target.value)} {...inputProps('name')} placeholder="votre nom" />
                {errors.name && <p id="name-error" className="field__error">{errors.name}</p>}
              </div>
              <div className="field">
                <label htmlFor="email">{copy.contact.email} <span aria-hidden="true">*</span><span className="sr-only"> — {copy.contact.required}</span></label>
                <input id="email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required value={values.email} onChange={(event) => updateValue('email', event.target.value)} {...inputProps('email')} placeholder="glodymputu@243@gmail.com" />
                {errors.email && <p id="email-error" className="field__error">{errors.email}</p>}
              </div>
              <div className="field">
                <label htmlFor="organization">{copy.contact.organization} <small>({copy.contact.optional})</small></label>
                <input id="organization" name="organization" autoComplete="organization" maxLength={120} value={values.organization} onChange={(event) => updateValue('organization', event.target.value)} placeholder="Vodacom, Airtel...."/>
              </div>
              <div className="field">
                <label htmlFor="subject">{copy.contact.subject} <span aria-hidden="true">*</span><span className="sr-only"> — {copy.contact.required}</span></label>
                <input id="subject" name="subject" maxLength={140} required value={values.subject} onChange={(event) => updateValue('subject', event.target.value)} {...inputProps('subject')} placeholder="objet de votre message" />
                {errors.subject && <p id="subject-error" className="field__error">{errors.subject}</p>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="message">{copy.contact.message} <span aria-hidden="true">*</span><span className="sr-only"> — {copy.contact.required}</span></label>
              <textarea id="message" name="message" rows={6} minLength={20} maxLength={2000} required value={values.message} onChange={(event) => updateValue('message', event.target.value)} {...inputProps('message')} placeholder="votre message" />
              <div className="field__meta">{errors.message ? <p id="message-error" className="field__error">{errors.message}</p> : <span />}<span>{values.message.length}/2000</span></div>
            </div>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => updateValue('website', event.target.value)} />
            </div>
            <div className="contact-form__footer">
              <p aria-live="polite" role="status" className={`form-status form-status--${status}`}>
                {status === 'success' && <><CheckCircle2 size={16} />{copy.contact.success}</>}
                {status === 'success-stored' && <><CheckCircle2 size={16} />{copy.contact.stored}</>}
                {status === 'error' && <><ShieldCheck size={16} />{copy.contact.error}</>}
                {status === 'rate-limited' && <><ShieldCheck size={16} />{copy.contact.rateLimited}</>}
              </p>
              <button className="button button--primary button--large" type="submit" disabled={status === 'loading'} aria-disabled={status === 'loading'}>
                {status === 'loading' ? copy.contact.loading : copy.contact.submit}<Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
