import type { ReactNode } from 'react';

export interface ICardProps {
	title?: string;
	titleSize?: 'default' | 'large';
	subtitle?: string;
	id?: string;
	width?: 'default' | 'content' | 'full';
	withBackground?: boolean;
	children?: ReactNode;
}

export interface ICardControlProps {
	children?: ReactNode;
}
