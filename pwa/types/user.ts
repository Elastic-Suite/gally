export enum Role {
  ADMIN = 'ROLE_ADMIN',
  CONTRIBUTOR = 'ROLE_CONTRIBUTOR',
}

export interface IUser {
  exp: number
  iat: number
  roles: Role[]
  username: string
}
