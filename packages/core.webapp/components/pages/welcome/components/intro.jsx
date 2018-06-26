/** @flow */
import * as React from 'react';
import Icon from '../../../ui/icon';
import Title from '../../../ui/title';
import { WizardControls } from '../../../wizard';
import type { WizardSlideProps } from '../../../wizard/types';

export class IntroSlide extends React.Component<WizardSlideProps, {}> {
  constructor(props: WizardSlideProps) {
    super(props);
  }

  next() {
    this.props.next();
  }

  render() {
    return (
      <React.Fragment>
        <Icon name="love" className="briskhome-welcome__image" />
        <Title medium>Nice to meet you!</Title>
        <p className="briskhome-welcome__text">
          We are thrilled to have you on board and looking forward to a great
          journey together!
        </p>
        <p className="briskhome-welcome__text">Shall we begin?</p>
        <WizardControls next={this.next.bind(this)} />
      </React.Fragment>
    );
  }
}

export default IntroSlide;
