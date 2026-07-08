import type { IToastOptions, IToast } from '../types/types';

import ReactDOM from 'react-dom';
import { createContext, useContext, useState, useCallback } from 'react';

import styles from '../styles/toast.module.scss';

const ToastContext = createContext<{
	showToast: (options: IToastOptions) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toasts, setToasts] = useState<IToast[]>([]);

	const removeToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const showToast = useCallback(
		(options: IToastOptions) => {
			const id = Date.now();

			const toast: IToast = {
				id,
				duration: options.duration || 10000,
				...options,
			};

			setToasts((prev) => [...prev, toast]);

			setTimeout(() => {
				removeToast(id);
			}, toast.duration);
		},
		[removeToast]
	);

	const modalRoot = document.getElementById('toast-root') || document.body;

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{ReactDOM.createPortal(
				<div className={styles.container}>
					{toasts.map((toast) => (
						<div
							key={toast.id}
							className={`${styles.toast} ${
								styles[`toast_type_${toast.type}`]
							}`}>
							<button
								className={styles.close}
								onClick={() => removeToast(toast.id)}
								type='button'
								aria-label='Close toast'
							/>
							<div className={styles.icon}></div>
							<div className={styles.content}>
								{toast.title && <p className={styles.title}>{toast.title}</p>}
								{toast.text && <p className={styles.text}>{toast.text}</p>}
								{toast.children}
							</div>
						</div>
					))}
				</div>,
				modalRoot
			)}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used inside ToastProvider');
	return ctx;
};
