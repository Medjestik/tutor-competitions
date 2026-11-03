import { useEffect, useRef, useState } from 'react';
import Button from '../../../../../shared/components/Button/ui/Button';
import Popup from '../../../../../shared/components/Popup/ui/Popup';
import { downloadCertificateWithCoauthors } from '../../../../../shared/utils/api';

const CoauthorCertificate = () => {
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
    return () => trigger.current?.focus();
  }, [open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!names[0].trim()) { setError('Укажите Ф.И.О. первого соавтора.'); return; }
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');
      const blob = await downloadCertificateWithCoauthors(token, names.map((name) => name.trim()).filter(Boolean));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'participant-certificate.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch { setError('Не удалось скачать сертификат. Попробуйте ещё раз.'); }
    finally { setLoading(false); }
  };

  return <>
    <button ref={trigger} type='button' className='person-stage__coauthor-trigger' onClick={() => setOpen(true)}>Сертификат для соавторов</button>
    {open && <Popup isOpen onClose={() => setOpen(false)} popupWidth='medium' closeOutside>
      <div ref={dialog} role='dialog' aria-modal='true' aria-labelledby='coauthor-certificate-title' onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key === 'Tab') {
          const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('input:not(:disabled), button:not(:disabled)') ?? []);
          if (!items.length) return;
          if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
          else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
        }
      }}>
        <div className='person-stage__coauthor-header'><h2 id='coauthor-certificate-title'>Сертификат для соавторов</h2><button type='button' aria-label='Закрыть' onClick={() => setOpen(false)}>×</button></div>
        <form onSubmit={submit} className='person-stage__coauthor-form'>
          {names.map((name, index) => <label key={index}>Ф.И.О. соавтора {index + 1}{index > 0 && ' (необязательно)'}
            <input value={name} maxLength={255} required={index === 0} onChange={(event) => setNames((current) => current.map((item, i) => i === index ? event.target.value : item))} />
          </label>)}
          {error && <p role='alert'>{error}</p>}
          <Button type='submit' text={loading ? 'Загрузка...' : 'Скачать сертификат'} disabled={loading} />
        </form>
      </div>
    </Popup>}
  </>;
};

export default CoauthorCertificate;
