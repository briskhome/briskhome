/** @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
import { createUser } from "../gql";
import Button from "../../../ui/button";
import Icon from "../../../ui/icon";
import Title from "../../../ui/title";
import { BriskhomeState } from "../../../../app/types";
import { WizardOutroProps } from "../../../wizard/types";
type OwnProps = {
  createUser: () => void;
  mutate: Function;
  history: any;
  loading: boolean;
  wizard: {
    slides: {
      firstName: string;
      lastName: string;
      password: string;
    };
  };
};
export class OutroSlide extends React.Component<WizardOutroProps & OwnProps, {}> {
  async componentDidMount() {
    const {
      wizard: {
        slides: {
          firstName,
          lastName,
          password
        }
      }
    } = this.props;
    await this.props.mutate({
      variables: {
        firstName,
        lastName,
        password,
        type: 'superuser'
      }
    });
  }

  render() {
    const {
      loading
    } = this.props;
    return <React.Fragment>
        <Icon name="party" className="briskhome-welcome__image" />
        <Title medium>Thank you!</Title>
        {loading && <p className="briskhome-welcome__text">
            Preparing Briskhome for its first visitor...
          </p>}
        {!loading && <React.Fragment>
            <p className="briskhome-welcome__text">
              Thank you, your Briskhome installation is now complete.
            </p>
            <Button caps link="" large yellow display="inline-block" className="briskhome-wizard__button-next" onClick={() => this.props.history.push('/')}>
              Begin your journey
            </Button>
          </React.Fragment>}
      </React.Fragment>;
  }

}
export default withRouter(compose(connect((state: BriskhomeState) => state, () => ({})), graphql(createUser))(OutroSlide));