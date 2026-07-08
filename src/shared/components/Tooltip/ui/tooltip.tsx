import { FC, ReactNode, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from '../styles/tooltip.module.scss';

interface ITooltipProps {
	content: ReactNode;
	children: ReactNode;
}

export const Tooltip: FC<ITooltipProps> = ({ content, children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const triggerRef = useRef<HTMLDivElement | null>(null);
	const tooltipRoot = document.getElementById('tooltip-root');
	if (!tooltipRoot) return null;

	const showTooltip = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top + window.scrollY,
				left: rect.right + 8 + window.scrollX,
			});
		}

		setIsOpen(true);
	};

	const hideTooltip = () => setIsOpen(false);

	return (
		<div
			className={styles.trigger}
			ref={triggerRef}
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}>
			{children}

			{isOpen &&
				createPortal(
					<div
						className={styles.tooltip}
						style={{
							top: coords.top,
							left: coords.left,
						}}>
						{content}
					</div>,
					tooltipRoot
				)}
		</div>
	);
};
