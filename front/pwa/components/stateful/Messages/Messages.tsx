import { selectMessages, useAppSelector } from '~/store'

import Message from './Message'

function Messages(): JSX.Element {
  const messages = useAppSelector(selectMessages)

  return (
    <>
      {messages.map((messageData) => (
        <Message key={messageData.id} {...messageData} />
      ))}
    </>
  )
}

export default Messages
