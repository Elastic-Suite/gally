import {
  Button,
  Fade,
  IconButton,
  Paper,
  Popper,
  TextField,
  styled,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import React, {
  FormEvent,
  MouseEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { settingsContext } from 'src/contexts'

function Settings(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const open = useMemo(() => Boolean(anchorEl), [anchorEl])
  const popperRef = useRef<HTMLDivElement>(null)
  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const { longitude, latitude, setLatitude, setLongitude } =
    useContext(settingsContext)

  const id = open ? 'simple-popper' : undefined

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const { latitude, longitude } = Object.fromEntries(
      new FormData(formRef.current).entries()
    )
    setLatitude(latitude.toString())
    setLongitude(longitude.toString())
    if (latitude && longitude) {
      setAnchorEl(null)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent): void {
      if (
        popperRef.current &&
        !popperRef.current.contains(event.target as Node) &&
        !anchorEl?.contains(event.target as Node)
      ) {
        setAnchorEl(null)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, anchorEl])

  const CutomForm = styled('form')(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  }))

  const Row = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  }))

  return (
    <>
      <IconButton onClick={handleClick} sx={{ marginLeft: '20px' }}>
        <SettingsIcon htmlColor="#fff" />
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        ref={popperRef}
        sx={{
          zIndex: 1200,
        }}
        transition
      >
        {({ TransitionProps }): JSX.Element => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <CutomForm ref={formRef} onSubmit={handleSubmit}>
                <Row>
                  <TextField
                    id="outlined-basic"
                    label="Latitude"
                    variant="outlined"
                    name="latitude"
                    type="number"
                    defaultValue={latitude}
                    inputProps={{
                      step: '0.000001',
                      min: -90,
                      max: 90,
                    }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Longitude"
                    variant="outlined"
                    type="number"
                    name="longitude"
                    defaultValue={longitude}
                    inputProps={{
                      step: '0.000001',
                      min: -180,
                      max: 180,
                    }}
                  />
                </Row>

                <Button type="submit" variant="outlined">
                  Appliquer
                </Button>
              </CutomForm>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default Settings
