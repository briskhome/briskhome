/** @flow */

import * as React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import Title from '../../../ui/title';

const sessions = gql`
  query something {
    me {
      sessions {
        issued
        expires
        browser
        device
        os
      }
    }
  }
`;

type SessionType = {
  issued: Date,
  expires: Date,
  browser: string,
  device: string,
  os: string,
};

const Session = ({ browser, os }: SessionType): React.Node => (
  <div className="preferences__list-item">
    <Title small extraClassName="plugin__name">
      {browser}
    </Title>
    <p className="plugin__description">{os}</p>
  </div>
);

type PluginsPaneProps = {
  data: {
    me: {
      sessions: SessionType[],
    },
  },
};

type PluginsPaneState = {
  filter: {
    value: string,
  },
};
export class SecurityPane extends React.Component<
  PluginsPaneProps,
  PluginsPaneState,
> {
  displayName: 'Security';
  render() {
    return (
      <div className="preferences">
        <Title medium extraClassName="preferences-pane__title">
          Sessions
        </Title>
        <div className="preferences__content">
          {this.props.data.me &&
            this.props.data.me.sessions.map(session => (
              <Session {...session} />
            ))}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(sessions, { options: () => ({ fetchPolicy: 'network-only' }) }),
)(SecurityPane);
