import * as React from 'react';
import Title from "../../../ui/title";
import { Icon } from "../../../ui";
type DashboardCardProps = {
  icon?: string;
  title?: string;
  count?: number;
  status?: string;
};
export const DashboardCard = ({
  title,
  icon,
  count,
  status
}: DashboardCardProps) => {
  return <a href="#" className="dashboard-card">
      {!!icon && <Icon name={icon} className="dashboard-card__icon" />}
      {!!title && <Title small className="dashboard-card__title">
          {title}
        </Title>}
      {!!count && <p className="dashboard-card__caption">
          {count} accessories installed.
        </p>}
      {!!status && <p className="dashboard-card__status">{status}</p>}
    </a>;
};
export default DashboardCard;