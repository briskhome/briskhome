import React from 'react';
import InputMask from 'react-input-mask';
import cn from 'classnames';
import './input.styl';

type InputProps = {
  extraClassName?: string,
  placeholder?: string,
  disabled?: boolean,
  caption?: string,
  label?: string,
  valid?: boolean,
  mask?: string,
  name?: string,
  value?: string,
  onBlur?: Function,
  onFocus?: Function,
  onChange?: Function,
};

export default ({
  extraClassName,
  placeholder,
  disabled,
  caption,
  label,
  valid = true,
  mask,
  name,
  value,
  onBlur,
  onFocus,
  onChange,
}: InputProps) => {
  const inputClassNames = cn(extraClassName, 'briskhome-input', {
    'briskhome-input_disabled': disabled,
    'briskhome-input_invalid': !valid,
  });
  const labelClassNames = cn(
    'briskhome-label',
    'briskhome-label__text',
    `${extraClassName}_label`,
  );
  const captionClassNames = cn(
    'anim_show_block',
    'briskhome-label',
    'briskhome-label_gray',
    'briskhome-label_small',
    'briskhome-label__caption',
    {
      'briskhome-label_red': !valid,
      [`${extraClassName}_caption`]: extraClassName,
    },
  );
  const props = {
    className: inputClassNames,
    placeholder,
    name,
    value,
    disabled,
    onBlur,
    onFocus,
    onChange,
  };
  return (
    <label
      className={cn(extraClassName, 'briskhome-label', 'briskhome-label_input')}
    >
      {label &&
        <span className={labelClassNames}>
          {label}
        </span>}
      {mask ? <InputMask mask={mask} {...props} /> : <input {...props} />}
      {caption &&
        <span className={captionClassNames}>
          {caption}
        </span>}
    </label>
  );
};
