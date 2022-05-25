import { makeStyles } from '@mui/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useStylesBreadCrumb = makeStyles((theme) => ({
    breadCrumb: {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '18px',
    },

    breadCrumbColorClassique: {
        color: theme.palette.colors.neutral['500'],
    },

    breadCrumbColorLast: {
        color: theme.palette.colors.neutral['800'],
    },
}))

/*
 * separator by default is "/"
 * see: https://mui.com/material-ui/react-breadcrumbs/
 */

const BreadCrumb = () => {
    const breadcrumbstyle = useStylesBreadCrumb()
    const [MocksBreadCrumd, setMocksBreadCrumd] = useState(false)
    const router = useRouter()
    const { slug } = router.query

    useEffect(() => {
        if (slug) {
            setMocksBreadCrumd(slug)
        }
    }, [router.query])

    return (
        <div>
            {MocksBreadCrumd && (
                <Breadcrumbs
                    aria-label="breadcrumb"
                    className={breadcrumbstyle.breadCrumbColorClassique}
                >
                    {MocksBreadCrumd.map((key, i, item) => {
                        let hrefLink = '/admin'

                        for (let index = 0; index <= i; index++) {
                            hrefLink += '/' + MocksBreadCrumd[index]
                            console.log(MocksBreadCrumd)
                        }

                        item = (
                            item[i][0].toUpperCase() + item[i].slice(1)
                        ).replace('_', ' ')

                        if (MocksBreadCrumd.length !== i + 1) {
                            return (
                                <Link
                                    key={key}
                                    underline="hover"
                                    className={
                                        breadcrumbstyle.breadCrumbColorClassique +
                                        ' ' +
                                        breadcrumbstyle.breadCrumb
                                    }
                                    href={hrefLink}
                                >
                                    {item}
                                </Link>
                            )
                        } else {
                            return (
                                <Typography
                                    key={key}
                                    className={
                                        breadcrumbstyle.breadCrumbColorLast +
                                        ' ' +
                                        breadcrumbstyle.breadCrumb
                                    }
                                >
                                    {item}
                                </Typography>
                            )
                        }
                    })}
                </Breadcrumbs>
            )}
        </div>
    )
}

export default BreadCrumb
