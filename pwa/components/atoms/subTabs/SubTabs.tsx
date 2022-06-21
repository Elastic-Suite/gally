import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStylesCatalog = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    gap: theme.spacing(4),
  },

  rootSubTabs: {
    border: '1px solid #E2E6F3',
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    width: '232px',
  },

  subTabs: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '500',
    color: theme.palette.colors.neutral[600],
    transition: 'all 500ms',
    cursor: 'pointer',

    '&:nth-child(1)': {
      marginTop: theme.spacing(2),
    },

    '&:nth-last-child(1)': {
      marginBottom: theme.spacing(2),
    },
    '&:hover': {
      backgroundColor: theme.palette.colors.secondary[100],
    },
  },

  subTabsActive: {
    color: theme.palette.colors.secondary[600],
    position: 'relative',
    '&::after': {
      content: "''",
      position: 'absolute',
      right: '-16px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '32px',
      width: 3,
      opacity: 0,
      background: theme.palette.menu.active,
      boxShadow: '-2px 0px 4px rgba(63, 50, 230, 0.2)',
      borderRadius: '5px 0px 0px 5px',
      animation: '$opacity 1500ms forwards',
    },
  },

  '@keyframes opacity': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}))

interface IProps {
  labels: Array<string>
  contents: any
}

const SubTabs = ({ labels, contents }: IProps) => {
  const stylecatalog = useStylesCatalog()
  const [active, setActive] = useState(0)

  return (
    <div className={stylecatalog.root}>
      <div className={stylecatalog.rootSubTabs}>
        {labels.map((item: any, key: number) => (
          <div
            key={key}
            className={
              (key === active && stylecatalog.subTabsActive) +
              ' ' +
              stylecatalog.subTabs
            }
            onClick={() => setActive(key)}
          >
            {item}
          </div>
        ))}
      </div>
      {contents.map((item: any, key: number) => key === active && item)}
    </div>
  )
}

export default SubTabs
