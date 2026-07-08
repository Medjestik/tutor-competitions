import type { ReactNode } from 'react';

export interface IToastOptions {
	title?: string;
	text?: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
	children?: ReactNode;
}

export interface IToast extends IToastOptions {
	id: number;
}
