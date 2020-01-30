/** @flow */
import * as React from 'react';
import cn from 'classnames';
import "./input.styl";
type InputProps = {
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  caption?: string;
  label?: string;
  valid?: boolean;
  name?: string;
  type?: string;
  value?: string;
  onBlur?: Function;
  onFocus?: Function;
  onChange?: Function;
};
export default (({
  autoComplete,
  placeholder,
  className = '',
  disabled,
  caption,
  label,
  valid = true,
  name,
  type,
  value,
  onBlur,
  onFocus,
  onChange
}: InputProps) => {
  const inputClassNames = cn(className, 'briskhome-input', {
    'briskhome-input_disabled': disabled,
    'briskhome-input_invalid': !valid
  });
  const labelClassNames = cn('briskhome-label', 'briskhome-label__text', `${className}_label`);
  const captionClassNames = cn('anim_show_block', 'briskhome-label', 'briskhome-label_gray', 'briskhome-label_small', 'briskhome-label__caption', {
    'briskhome-label_red': !valid,
    [`${className}_caption`]: className
  });
  const props = {
    className: inputClassNames,
    autoComplete,
    placeholder,
    name,
    type,
    value,
    disabled,
    onBlur,
    onFocus,
    onChange
  };
  return <label className={cn(className, 'briskhome-label', 'briskhome-label_input', {
    'briskhome-label_invalid': !valid
  })}>
      {label && <span className={labelClassNames}>{label}</span>}
      <input {...props} />
      {caption && <span className={captionClassNames}>{caption}</span>}
    </label>;
});