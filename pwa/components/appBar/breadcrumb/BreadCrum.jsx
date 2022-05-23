import { makeStyles } from '@mui/styles'

const useStylesBreadCrumb = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
    },

    breadCrumClassic: {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '18px',
        color: theme.palette.colors.neutral['500'],
    },

    breadCrumLast: { color: theme.palette.colors.neutral['800'] },
}))

const BreadCrumb = () => {
    const breadcrumbstyle = useStylesBreadCrumb()
    const MocksBreadCrumd = ['Merchandize', 'Recommender', 'Configuration']

    return (
        <div className={breadcrumbstyle.root}>
            {Array.isArray(MocksBreadCrumd) ? (
                MocksBreadCrumd.map((key, i, item) => {
                    if (MocksBreadCrumd.length !== i + 1) {
                        return (
                            <div
                                key={key}
                                className={breadcrumbstyle.breadCrumClassic}
                            >
                                {item[i]}
                                <span style={{ padding: '0 8px' }}>/</span>
                            </div>
                        )
                    } else {
                        return (
                            <div
                                key={key}
                                className={
                                    breadcrumbstyle.breadCrumClassic +
                                    ' ' +
                                    breadcrumbstyle.breadCrumLast
                                }
                            >
                                {item[i]}
                            </div>
                        )
                    }
                })
            ) : (
                <div
                    className={
                        breadcrumbstyle.breadCrumClassic +
                        ' ' +
                        breadcrumbstyle.breadCrumLast
                    }
                >
                    {MocksBreadCrumd}
                </div>
            )}
        </div>
    )
}

export default BreadCrumb
