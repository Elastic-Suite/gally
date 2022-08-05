import jwtDecode from 'jwt-decode'

import { IUser } from '~/types'

export function useUser(): IUser {
  // Todo: manage token
  // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTk3MDYyMDUsImV4cCI6MTY1OTczNTAwNSwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfQ09OVFJJQlVUT1IiXSwidXNlcm5hbWUiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.lrPvrHW3YCY_xM7tXfF_5XVB-c3PUS9pX5b_pk6lJxi-Ztahs_1p5Kq3j9CDQqBWgNY1Qic51EupW-ggjxjnkVGTQV5W351nG-KWa0F1YTIDUjaYXF2znr-LW851Fc5u96oiHklS6SBq8syxy0m8aXx_FwcAqN1yqTYJhhRiskMufDte-8p4lIm8vAYrSXEdeOAuxT1mQEA1mVciOCBSEqK86hIqhNaiDPELzECfJj0vCFXl5PJ7074YYy7V1rrXj7KGiJaic4O7qIQhqXMbxMdrucxQfCENECU2eJzPPVIAgLcCs2cWUDsaeM7vnc5maO4dWFykJHv21-FF1sxAQg'
  const token = ''
  if (token) {
    return jwtDecode(token) as IUser
  }
}
