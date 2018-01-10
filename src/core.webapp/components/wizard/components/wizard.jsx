/** @flow */
import * as React from 'react';
import cn from 'classnames';
import WizardStepper from './stepper';
import type { WizardProps, WizardState } from '../types';
import '../index.styl';

/**
 * This component represents a linear wizard that is able to cycle through
 * a set of predefined steps from the first one to the last one. In the future
 * it may be extended to support parallel or non-linear completion.
 */
export class Wizard extends React.Component<WizardProps, WizardState> {
  constructor(props: WizardProps) {
    super(props);
    this.state = {
      currentStep: props.intro ? -1 : 0,
      totalSteps: props.slides ? props.slides.length : 0,
    };
  }

  /** prev() method changes slide to the previous one */
  prev(): void {
    const { intro } = this.props;
    const { currentStep } = this.state;
    if (currentStep - 1 >= 0 - Number(!!intro))
      this.setState({ currentStep: currentStep - 1 });
  }

  /** next() method changes slide to the next one */
  next(): void {
    const { outro } = this.props;
    const { currentStep, totalSteps } = this.state;
    if (currentStep + 1 < totalSteps + Number(!!outro))
      this.setState({ currentStep: currentStep + 1 });
  }

  /** goto() method changes slide to the slide with the passed in index */
  goto(slide: number): void {
    const { intro, outro } = this.props;
    const { totalSteps } = this.state;
    if (slide >= 0 - Number(!!intro) && slide < totalSteps + Number(!!outro))
      this.setState({ currentStep: slide });
  }

  renderIntro(): React.Node {
    const { intro: Intro } = this.props;
    const { currentStep } = this.state;
    if (currentStep >= 0 || !Intro) return null;
    return <Intro next={this.next.bind(this)} />;
  }

  renderChildren(): React.Node {
    const { slides } = this.props;
    const { currentStep } = this.state;
    return slides.map(
      (Slide, idx) =>
        idx === currentStep ? (
          <Slide prev={this.prev.bind(this)} next={this.next.bind(this)} />
        ) : null,
    );
  }

  renderOutro(): React.Node {
    const { outro: Outro } = this.props;
    const { currentStep, totalSteps } = this.state;
    if (currentStep < totalSteps || !Outro) return null;
    return <Outro prev={this.prev.bind(this)} />;
  }

  render() {
    const { className, slides = [] } = this.props;
    const { currentStep } = this.state;
    if (!slides.length) return null;
    return (
      <div className={cn('briskhome-wizard', className)}>
        <WizardStepper currentStep={currentStep} slides={slides} />
        <div className="briskhome-wizard__content">
          {this.renderIntro()}
          {this.renderChildren()}
          {this.renderOutro()}
        </div>
      </div>
    );
  }
}

export default Wizard;
