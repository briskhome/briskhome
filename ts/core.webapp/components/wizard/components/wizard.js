/** @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import WizardStepper from "./stepper";
import { Wizard as WizardStore, WizardInitAction, WizardPrevAction, WizardNextAction, WizardGotoAction } from "../../../app/types";
import { WizardProps, WizardState, WizardSlideState } from "../types";
import "../index.styl";
/**
 * This component represents a linear wizard that is able to cycle through
 * a set of predefined steps from the first one to the last one. In the future
 * it may be extended to support parallel or non-linear completion.
 */

export class Wizard extends React.Component<WizardProps, WizardState> {
  constructor(props: WizardProps) {
    super(props);
    this.props.init({
      currentSlide: props.intro ? -1 : 0,
      totalSlides: (props.slides || []).length,
      hasIntro: !!props.intro,
      hasOutro: !!props.outro,
      slides: {}
    });
  }

  renderIntro(): React.Node {
    const {
      intro: Intro,
      wizard: {
        currentSlide
      }
    } = this.props;
    if (currentSlide >= 0 || !Intro) return null;
    return <Intro next={this.props.next} />;
  }

  renderChildren(): React.Node {
    const {
      prev,
      next,
      goto,
      slides,
      wizard: {
        currentSlide
      }
    } = this.props;
    const nav = {
      prev,
      next,
      goto
    };
    return slides.map((Slide, idx) => idx === currentSlide ? <Slide {...nav} /> : null);
  }

  renderOutro(): React.Node {
    const {
      outro: Outro,
      wizard: {
        currentSlide,
        totalSlides
      }
    } = this.props;
    if (currentSlide < totalSlides || !Outro) return null;
    return <Outro prev={this.props.prev} />;
  }

  render() {
    const {
      className,
      slides = [],
      wizard: {
        currentSlide,
        totalSlides
      }
    } = this.props;
    if (!slides.length) return null;
    return <div className={cn('briskhome-wizard', className)}>
        <WizardStepper currentSlide={currentSlide} totalSlides={totalSlides} />
        <div className="briskhome-wizard__content">
          {this.renderIntro()}
          {this.renderChildren()}
          {this.renderOutro()}
        </div>
      </div>;
  }

}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    init: (state: WizardStore): void => {
      dispatch(({
        type: '@@WIZARD/INIT',
        value: {
          state
        }
      } as WizardInitAction));
    },
    prev: (state: WizardSlideState = {}): void => {
      dispatch(({
        type: '@@WIZARD/PREV',
        value: {
          state
        }
      } as WizardPrevAction));
    },
    next: (state: WizardSlideState = {}): void => {
      dispatch(({
        type: '@@WIZARD/NEXT',
        value: {
          state
        }
      } as WizardNextAction));
    },
    goto: (slide: number, state: WizardSlideState = {}): void => {
      dispatch(({
        type: '@@WIZARD/GOTO',
        value: {
          slide,
          state
        }
      } as WizardGotoAction));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wizard);