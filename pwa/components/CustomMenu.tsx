import { DashboardMenuItem, Menu, MenuItemLink } from 'react-admin';
import { shallowEqual, useSelector } from 'react-redux';
import ViewListIcon from '@material-ui/icons/ViewList';
import { getResources, useGetResourceLabel } from 'ra-core';

import CustomMenuItem from './CustomMenuItem';


export default function CustomMenu(props) {
  const { dense, hasDashboard } = props;
  const resources = useSelector(getResources, shallowEqual) as Array<any>;
  const getResourceLabel = useGetResourceLabel();

  return (
    <>
      <Menu {...props}>
        {hasDashboard && <DashboardMenuItem dense={dense} />}
        {resources
          .filter(r => r.hasList)
          .map(resource => (
            <MenuItemLink
              key={resource.name}
              to={{
                pathname: `/${resource.name}`,
                state: { _scrollToTop: true },
              }}
              primaryText={getResourceLabel(resource.name, 2)}
              leftIcon={
                resource.icon ? (
                  <resource.icon />
                ) : (
                  <ViewListIcon />
                )
              }
              dense={dense}
            />
          ))}
          <MenuItemLink to="/test" primaryText="Test" leftIcon={<ViewListIcon/>}/>
          <CustomMenuItem to="/test" primaryText="Test" leftIcon={<ViewListIcon/>}/>
      </Menu>
    </>
  );
}
