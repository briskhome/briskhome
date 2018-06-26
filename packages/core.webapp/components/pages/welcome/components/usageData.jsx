/** @flow */
import * as React from 'react';
import Checkbox from '../../../ui/checkbox';
import Title from '../../../ui/title';
import { WizardControls } from '../../../wizard';
import type { WizardSlideProps } from '../../../wizard/types';

type UsageDataSlideState = {
  data: {
    checked: boolean,
  },
};
export class UsageDataSlide extends React.Component<
  WizardSlideProps,
  UsageDataSlideState,
> {
  constructor(props: WizardSlideProps) {
    super(props);

    this.state = {
      data: {
        checked: true,
      },
    };
  }

  prev() {
    this.props.prev(this.state.data);
  }

  next() {
    this.props.next(this.state.data);
  }

  render() {
    const { data: { checked } } = this.state;
    return (
      <React.Fragment>
        <img
          src="/static/assets/img/bigcc1f7840d4786edfdb97196e7aa8fd5e.png"
          alt="Briskhome"
          className="briskhome-welcome__image"
        />
        <Title medium>One last thing</Title>
        <p className="briskhome-welcome__text">
          Do you mind sharing anonymous statistics about the way you use
          Briskhome?
        </p>
        <Checkbox
          checked={checked}
          onChange={() => this.setState({ data: { checked: !checked } })}
        >
          Sharing is caring, sign me up
        </Checkbox>
        <WizardControls
          prev={this.prev.bind(this)}
          next={this.next.bind(this)}
        />
      </React.Fragment>
    );
  }
}

export default UsageDataSlide;
