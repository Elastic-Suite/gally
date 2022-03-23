import { forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState, setSidebarVisibility } from 'ra-core';
import { MenuItem, ListItemIcon, Theme, Tooltip, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import NavLink from './NavLink';

const useStyles = makeStyles(
  theme => ({
      root: {
          color: theme.palette.text.secondary,
      },
      active: {
          color: theme.palette.text.primary,
      },
      icon: { minWidth: theme.spacing(5) },
  }),
  { name: 'RaMenuItemLink' }
);

const NavLinkRef = forwardRef((props, ref) => (
  <NavLink innerRef={ref} {...props} />
));

function CustomMenuItem(props, ref) {
  const { leftIcon, onClick, primaryText, to } = props;
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
  const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
  const handleMenuTap = useCallback(
    e => {
      if (isSmall) {
        dispatch(setSidebarVisibility(false));
      }
      onClick && onClick(e);
    },
    [dispatch, isSmall, onClick]
  );

  const menuItem = (
    <MenuItem
      className={classes.root}
      activeClassName={classes.active}
      component={NavLinkRef}
      href={to}
      ref={ref}
      tabIndex={0}
      onClick={handleMenuTap}
    >
      {leftIcon && (
        <ListItemIcon className={classes.icon}>
          {leftIcon}
        </ListItemIcon>
      )}
      {primaryText}
    </MenuItem>
  );

  return open ? (
    menuItem
  ) : (
    <Tooltip title={primaryText} placement="right">
      {menuItem}
    </Tooltip>
  );
}

export default forwardRef(CustomMenuItem);
