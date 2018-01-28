/* @flow */
import * as React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { DashboardHeader } from '../';
import '../dashboard.styl';

const originalLayouts = {};

const ResponsiveReactGridLayout = WidthProvider(Responsive);
export class Dashboard extends React.Component<*, *> {
  constructor(props: any) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      isEditable: false,
    };
  }

  onLayoutChange = (layout: any, layouts: any) => {
    this.setState({ layouts });
  };

  onToggleEditing = () => {
    this.setState({ isEditable: !this.state.isEditable });
  };

  render() {
    return (
      <div className="dashboard">
        <DashboardHeader />
        <div className="dashboard-content">
          <a
            className="dashboard-content__edit-button"
            onClick={this.onToggleEditing}
          >
            {this.state.isEditable ? 'Save' : 'Edit'}
          </a>
          <ResponsiveReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 12, sm: 6, xs: 6, xxs: 4 }}
            rowHeight={30}
            isDraggable={this.state.isEditable}
            isResizable={this.state.isEditable}
            layouts={this.state.layouts}
            onLayoutChange={(layout, layouts) =>
              this.onLayoutChange(layout, layouts)
            }
            measureBeforeMount
            containerPadding={[40, 20]}
            margin={[20, 20]}
          >
            <div
              className="dashboard-widget__wrapper"
              data-grid={{ w: 3, h: 6, x: 0, y: 0, minW: 2, minH: 3 }}
              key="1"
            />
          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

export default Dashboard;
