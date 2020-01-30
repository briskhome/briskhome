/** @flow */
import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { welcomeQuery } from "./gql";
import { Wizard } from "../../wizard";
import IntroSlide from "./components/intro";
import OutroSlide from "./components/outro";
import CreateAccountSlide from "./components/createAccount";
import CreatePasswordSlide from "./components/createPassword";
import UsageDataSlide from "./components/usageData";
import { BriskhomeState } from "../../../app/types";
import "./index.styl";
type WelcomeProps = {
  history: any;
  data: {
    welcome: boolean;
  };
};
export class Welcome extends React.Component<WelcomeProps, {}> {
  constructor(props: WelcomeProps) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.data.welcome) this.props.history.replace('/login');
  }

  render() {
    return <Wizard intro={IntroSlide} outro={OutroSlide} slides={[CreateAccountSlide, CreatePasswordSlide, UsageDataSlide]} className="briskhome-welcome" />;
  }

}
export default compose(connect((state: BriskhomeState) => state, () => ({})), graphql(welcomeQuery))(Welcome);