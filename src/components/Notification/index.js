import React from 'react';
import PropTypes from 'prop-types';

import Store from '@Store';
import ButtonLink from '@Components/ButtonLink';
import Icon from '@Components/Icon';

import styles from './Notification.module.scss';

function Notification({ className = '', notification }) {
	async function onClose() {
		await Store.Notification.cancelCurrentNotification();
	}
	async function onCancel() {
		await Store.Notification.cancelCurrentNotification();
	}
	async function onAccept() {
		await Store.Notification.acceptCurrentNotification();
	}
	if (!notification) {
		return null;
	}
	return (
		<div className={`${styles['notification-container']} flex row justify-center ${className}`}>
			<div className={`${styles['notification-modal']} flex column gap-4 mt-2 p-2 shadow-2 br-1 h-fit col-fix-4 bg-white`}>
				<div className={`${styles['notification-header']} flex row justify-space-between`}>
					<span>Atención</span>
					<ButtonLink className={`${styles['close-button']} flex center`} onClick={onClose}>
						<Icon name="close" />
					</ButtonLink>
				</div>
				<div className={`${styles['notification-body']} flex row`}>
					{notification?.message}
				</div>
				<div className={`${styles['notification-footer']} flex row justify-end gap-2`}>
					<ButtonLink className={`${styles['cancel-button']} flex center`} style="button" onClick={onAccept}>
						<span>Aceptar</span>
					</ButtonLink>
					{notification?.type === 'confirm' && (
						<ButtonLink className={`${styles['cancel-button']} flex center`} style="button" onClick={onCancel}>
							<span>Cancelar</span>
						</ButtonLink>
					)}

				</div>
			</div>
		</div>
	);
}

Notification.propTypes = {
	className: PropTypes.string,
	notification: PropTypes.any,
};

export default Notification;
