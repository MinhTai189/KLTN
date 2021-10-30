import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { AcUnit, Build, CallMerge, Group, HorizontalSplit, Hotel, Motorcycle, Toys, TrendingUp, Videocam, Wifi } from '@material-ui/icons'

interface Props {
    utilities: string[]
    handleSelectUtilities: (utility: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(1),

        '& .wrapper': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',

            '& .items': {
                height: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '0.5px solid #ddd',
                padding: theme.spacing(0.3),
                cursor: 'pointer',
                transition: '300ms',

                '&:hover': {
                    boxShadow: `0px 0px 1px 2px ${theme.palette.secondary.main} inset`,
                    transform: 'scale(0.99)'
                },

                '&.active': {
                    boxShadow: `0px 0px 1px 2px ${theme.palette.secondary.main} inset`,
                },

                '& .icons': {
                    height: 15,

                    '& .MuiSvgIcon-root': {
                        height: '100%',
                        width: 'auto',
                        fill: theme.palette.secondary.main
                    }
                },

                '& .MuiTypography-root': {
                    fontSize: '0.6em',
                    textAlign: 'center',
                }
            }
        }
    }
}))

const checkboxOptions: Array<any> = [
    {
        label: 'Wifi',
        value: 'wifi',
        icon: <Wifi />
    },
    {
        label: 'Máy lạnh',
        value: 'ml',
        icon: <AcUnit />
    },
    {
        label: 'Gác',
        value: 'gac',
        icon: <CallMerge />
    },
    {
        label: 'Nhà xe',
        value: 'nx',
        icon: <Motorcycle />
    },
    {
        label: 'Camera',
        value: 'camera',
        icon: <Videocam />
    },
    {
        label: 'Quạt',
        value: 'quat',
        icon: <Toys />
    },
    {
        label: 'Trên lầu',
        value: 'tl',
        icon: <TrendingUp />
    },
    {
        label: 'Giường',
        value: 'giuong',
        icon: <Hotel />
    },
    {
        label: 'Giường tầng',
        value: 'gt',
        icon: <HorizontalSplit />
    },
    {
        label: 'Chung chủ',
        value: 'cc',
        icon: <Group />
    },
    {
        label: 'Dụng cụ vệ sinh',
        value: 'dcvs',
        icon: <Build />
    }
]

export const Utilities = ({ utilities, handleSelectUtilities }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <ul className="wrapper">
                {checkboxOptions.map((option, index) => {
                    const active = utilities.includes(option.value) ? 'active' : ''

                    return (
                        <li
                            key={index}
                            className={`items ${active}`}
                            onClick={() => handleSelectUtilities(option.value)}
                        >
                            <span className="icons">
                                {option.icon}
                            </span>

                            <Typography component='small'>
                                {option.label}
                            </Typography>
                        </li>
                    )
                })}
            </ul>
        </Box>
    )
}
