import {
  removeMessage,
  selectMessages,
  useAppDispatch,
  useAppSelector,
} from '~/store'

import Alert from '~/components/atoms/Alert/Alert'

function Messages(): JSX.Element {
  const dispatch = useAppDispatch()
  const messages = useAppSelector(selectMessages)

  return (
    <>
      {messages.map(({ id, ...props }) => (
        <Alert
          key={id}
          {...props}
          onClose={(): void => void dispatch(removeMessage(id))}
          style={{ marginBottom: '16px' }}
        />
      ))}
    </>
  )
}

export default Messages
