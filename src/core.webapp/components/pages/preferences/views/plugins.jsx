/** @flow */

import * as React from 'react';
import { gql, graphql, compose } from 'react-apollo';

import Input from '../../../ui/input';
import Title from '../../../ui/title';
import Toggle from '../../../ui/toggle';

const plugins = gql`
  {
    plugins {
      name
      description
      version
      author
      disabled
      consumes
      provides
    }
  }
`;

type PluginType = {
  name: string,
  description: ?string,
  disabled: boolean,
  consumes: string[],
  provides: string[],
};

const Plugin = ({
  name,
  description,
  disabled = false,
  consumes = [],
  provides = [],
}: // version,
// author,
PluginType): React.Node => (
  <div className="preferences__list-item">
    <Title small extraClassName="plugin__name">
      {name}
    </Title>
    <Toggle extraClassName="plugin__disabled" checked={!disabled} disabled />
    <p className="plugin__description">{description}</p>
    {provides.length ? (
      <div className="plugin__provides">
        <span className="plugin__provides-title">Provides:</span>
        {provides.map(service => (
          <span className="plugin__provides-item">{service}</span>
        ))}
      </div>
    ) : null}
    {consumes.length ? (
      <div className="plugin__consumes">
        <span className="plugin__consumes-title">Consumes:</span>
        {consumes.map(service => (
          <span className="plugin__consumes-item">{service}</span>
        ))}
      </div>
    ) : null}
  </div>
);

type PluginsPaneProps = {
  data: {
    plugins: PluginType[],
  },
};

type PluginsPaneState = {
  filter: {
    value: string,
  },
};
export class PluginsPane extends React.Component<
  PluginsPaneProps,
  PluginsPaneState,
> {
  displayName: 'Plugins';
  constructor() {
    super();
    this.state = {
      filter: {
        value: '',
      },
    };
  }

  render() {
    return (
      <div className="preferences">
        <Title medium extraClassName="preferences-pane__title">
          Installed Plugins
        </Title>
        <div className="preferences__search">
          <Input
            placeholder="Type to search plugins..."
            onChange={e => this.setState({ filter: { value: e.target.value } })}
          />
        </div>
        <div className="preferences__content">
          {this.props.data.plugins &&
            this.props.data.plugins
              .filter(
                plugin =>
                  this.state.filter.value
                    ? plugin.name.indexOf(this.state.filter.value) > -1
                    : true,
              )
              .map(plugin => <Plugin {...plugin} />)}
        </div>
      </div>
    );
  }
}

export default compose(graphql(plugins))(PluginsPane);
