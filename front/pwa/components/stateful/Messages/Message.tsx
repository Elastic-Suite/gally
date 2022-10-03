import { useCallback } from 'react'
import { removeMessage, useAppDispatch } from '~/store'

import Alert, { IAlertProps } from '~/components/atoms/Alert/Alert'

interface IProps extends Omit<IAlertProps, 'id'> {
  id: number
}
function Message(props: IProps): JSX.Element {
  const { id, ...alertProps } = props
  const dispatch = useAppDispatch()

  const close = useCallback((): void => {
    dispatch(removeMessage(id))
  }, [dispatch, id])

  return (
    <Alert {...alertProps} onClose={close} style={{ marginBottom: '16px' }} />
  )
}

Message.defaultProps = {
  delay: 5000,
}

export default Message
