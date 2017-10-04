import React from 'react';
import cn from 'classnames';

export const HouseIcon = ({ extraClassNames }): React.Element<*> => {
  const classNames = cn('icon-house', extraClassNames);
  return (
    <svg
      className={classNames}
      width="118px"
      height="113px"
      viewBox="0 0 118 113"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g
        id="Symbols"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="modal/sidebar/welcome"
          transform="translate(-137.000000, -73.000000)"
        >
          <g id="Container">
            <g id="Icon" transform="translate(139.000000, 75.000000)">
              <path
                d="M7,61 L57,11 L107,61 L107,111 L7,111 L7,61 Z M45,61 L45,111 L70,111 L70,61 L45,61 Z"
                id="Combined-Shape"
                fill="#FFFFFF"
              />
              <polygon
                id="Shape"
                fill="#2766A8"
                points="52.4215754 51 56.0346346 41.0060437 49 39.1812633 61.642416 26 56.9938486 36.08162 64.028184 37.9066995"
              />
              <path
                d="M57.9410826,0.944732491 L57,0 L55.1178348,1.88946498 L1.88216515,55.3316051 L0,57.22107 L3.7643303,61 L5.64649546,59.110535 L57,7.55785993 L108.353505,59.110535 L110.23567,61 L114,57.22107 L112.117835,55.3316051 L58.8821652,1.88946498 L57.9410826,0.944732491 Z"
                id="Roof"
                stroke="#CF4B5D"
                strokeWidth="2"
                fill="#CF4B5D"
                strokeLinecap="square"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default HouseIcon;
