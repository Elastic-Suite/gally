import IonIcon from '~/components/atoms/IonIcon'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    zIndex: 99999,
    background: 'rgba(21, 26, 71, 0.6)',
    animation: '$opacity 1000ms forwards',
    opacity: 0,
  },
  '@keyframes opacity': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },

  popIn: {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    width: '600px',
    minHeight: '268px',
    position: 'relative',
  },

  close: {
    position: 'absolute',
    display: 'flex',
    top: theme.spacing(3),
    right: theme.spacing(3),
    cursor: 'pointer',
  },

  title: {
    marginTop: theme.spacing(9),
    textAlign: 'center',
    fontWeight: '400',
    color: theme.palette.colors.neutral[900],
    fontSize: '18px',
    lineHeight: '28px',
  },

  action: {
    marginTop: theme.spacing(7),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '500',
  },
}))

const PopIn = ({ title, func, btnCancel, btnConfirm, close }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.popIn}>
        <div className={classes.close} onClick={() => close()}>
          <TertiaryButton size="small" style={{ padding: '4px' }}>
            <IonIcon name="close" style={{ fontSize: 12 }} />
          </TertiaryButton>
        </div>
        <div className={classes.title}>{title}</div>
        <div className={classes.action}>
          <div onClick={() => close()}>
            <TertiaryButton size="large">{btnCancel}</TertiaryButton>
          </div>
          <div onClick={() => (close(), func())}>
            <PrimaryButton size="large">{btnConfirm}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

PopIn.propTypes = {
  title: PropTypes.string,
  func: PropTypes.func,
  btnCancel: PropTypes.string,
  btnConfirm: PropTypes.string,
  close: PropTypes.func,
}

PopIn.defaultProps = {
  title: '',
  btnCancel: 'Annuler',
  btnConfirm: 'Confirmer',
}

export default PopIn
