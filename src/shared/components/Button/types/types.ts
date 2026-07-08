import type { CSSProperties, MouseEvent } from 'react';

export interface IButtonProps {
	text: string;
	type?: 'button' | 'submit' | 'link';
	form?: string;
	href?: string;
	style?: CSSProperties;
	color?:
		| 'default'
		| 'primary'
		| 'inherit'
		| 'gradient'
		| 'white';
	withIcon?: {
		type:
			| 'add'
			| 'confirm'
			| 'next'
			| 'prev'
			| 'send'
			| 'check'
			| 'back'
			| 'return'
			| 'cancel'
			| 'info';
		position?: 'left' | 'right';
		color?: 'black' | 'white' | 'blue' | 'grey';
	};
	width?: 'default' | 'full' | 'auto';
	isBlock?: boolean;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
