export type MessageSeverity = 'error' | 'warning' | 'info' | 'success'

export interface IMessage {
  id: number
  message: string
  severity?: MessageSeverity
}

export type IMessages = IMessage[]
