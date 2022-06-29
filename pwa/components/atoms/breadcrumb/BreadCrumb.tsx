import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const breadcrumbGlobalStyle = {
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '18px',
}

/*
 * separator by default is "/"
 * see: https://mui.com/material-ui/react-breadcrumbs/
 */

function BreadCrumb() {
  const [MocksBreadCrumd, setMocksBreadCrumd] = useState(null)
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (slug) {
      setMocksBreadCrumd(slug)
    }
  }, [slug])

  return (
    <div>
      {MocksBreadCrumd ? (
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ color: 'colors.neutral.500' }}
        >
          {MocksBreadCrumd.map((key, i, item) => {
            let hrefLink = '/admin'

            for (let index = 0; index <= i; index++) {
              hrefLink += '/' + MocksBreadCrumd[index]
            }

            item = (item[i][0].toUpperCase() + item[i].slice(1)).replace(
              '_',
              ' '
            )

            if (MocksBreadCrumd.length !== i + 1) {
              return (
                <Link
                  key={key}
                  underline="hover"
                  sx={{ color: 'colors.neutral.500', ...breadcrumbGlobalStyle }}
                  href={hrefLink}
                >
                  {item}
                </Link>
              )
            } else {
              return (
                <Typography
                  key={key}
                  sx={{ color: 'colors.neutral.800', ...breadcrumbGlobalStyle }}
                >
                  {item}
                </Typography>
              )
            }
          })}
        </Breadcrumbs>
      ) : null}
    </div>
  )
}

export default BreadCrumb
