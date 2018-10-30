import * as React from 'react';
import cn from 'classnames';
import './index.styl';

type CheckboxProps = {
  name?: string,
  checked: boolean,
  disabled?: boolean,
  display?: 'inline' | 'inline-block' | 'block',
  className?: string,
  onChange: () => void,
  children: React.Node,
};

export const Checkbox = ({
  name = '',
  checked,
  display = 'inline-block',
  disabled = false,
  className,
  onChange,
  children,
}: CheckboxProps) => {
  return (
    <label
      className={cn(
        'briskhome-checkbox',
        `briskhome-checkbox_${display}`,
        className,
        {
          'briskhome-checkbox_checked': checked,
          'briskhome-checkbox_disabled': disabled,
        },
      )}
    >
      <input
        className={cn('briskhome-checkbox__input', {
          [`${className}__input`]: className,
        })}
        name={name}
        type="checkbox"
        onChange={onChange}
      />
      <span className="briskhome-checkbox__content">{children}</span>
    </label>
  );
};

export default Checkbox;
