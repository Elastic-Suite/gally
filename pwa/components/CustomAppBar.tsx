import React from 'react';
import { AppBar, useAuthProvider } from 'react-admin';
import type { WithStyles } from '@material-ui/core';
import { Typography, withStyles } from '@material-ui/core';

interface CustomAppBarProps extends WithStyles {
  userMenu?: boolean | JSX.Element;
}

const styles = {
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  spacer: {
    flex: 1,
  },
} as const;

function CustomAppBar({ classes, userMenu, ...props }: CustomAppBarProps) {
  const authProvider = useAuthProvider();

  return (
    <AppBar userMenu={userMenu ?? !!authProvider} {...props}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      />
      <span className={classes.spacer} />
      <Typography variant="h6" color="inherit">
        ElasticSuite
      </Typography>
    </AppBar>
  );
};

// eslint-disable-next-line tree-shaking/no-side-effects-in-initialization
export default withStyles(styles)(CustomAppBar);
