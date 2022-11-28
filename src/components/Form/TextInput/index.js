import React from 'react';
import PropTypes from 'prop-types';

import styles from './TextInput.module.scss';

function TextInput({ type, value, placeholder, name, onChange, onBlur, className = '', children }, ref) {
	return <div className={`${styles['text-input-container']} flex row br-1 gap-1 ${className}`}>
		{children?.icon ? <div className={`${styles['icon-container']} flex center ml-1`}>{children.icon}</div> : null}
		<input className={`${styles['text-input']} grow-1 py-1 pr-1 br-1 font-3 font-marengo`} type={type} value={value} placeholder={placeholder} name={name} onChange={onChange} onBlur={onBlur} ref={ref} />
	</div>;
}

TextInput.displayName = 'TextInput';
TextInput.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(['text', 'password']),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	name: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	children: PropTypes.any,
};

export default React.forwardRef(TextInput);
