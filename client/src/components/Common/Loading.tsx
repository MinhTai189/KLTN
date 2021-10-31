import { Box, Typography, makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    root: {
        height: 95,
        width: 95,
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'space-between',

        '& .pl': {
            display: 'block',
            width: 63,
            height: 63,
        },
        '& .pl__ring, & .pl__ball': {
            animation: '$ring 2s ease-out infinite',
        },
        '& .pl__ball': {
            animationName: '$ball',
        },

        '& .MuiTypography-root': {
            fontWeight: 500,
            fontSize: 16,
            opacity: 0.3,
            animation: '$opacity 2s ease-out infinite',
            paddingLeft: 8,
        }
    },
    '@keyframes ring': {
        'from': {
            strokeDasharray: '0 257 0 0 1 0 0 258',
        },
        '25%': {
            'strokeDasharray': '0 0 0 0 257 0 258 0',
        },
        '50%, to': {
            strokeDasharray: '0 0 0 0 0 515 0 0',
        }
    },
    '@keyframes ball': {
        'from, 50%': {
            animationTimingFunction: 'ease-in',
            strokeDashoffset: 1,
        },
        '64%': {
            animationTimingFunction: 'ease-in',
            strokeDashoffset: -109,
        },
        '78%': {
            animationTimingFunction: 'ease-in',
            strokeDashoffset: -145,
        },
        '92%': {
            animationTimingFunction: 'ease-in',
            strokeDashoffset: -157
        },
        '57%, 71%, 85%, 99%, to': {
            animationTimingFunction: 'ease-out',
            strokeDashoffset: -163,
        }
    },
    '@keyframes opacity': {
        'to': {
            opacity: 0.3
        },
        '50%': {
            opacity: 0.4
        },
        'from': {
            opacity: 0.9
        }
    }
})

export const Loading = () => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <svg className="pl" viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
                        <stop offset="0%" stop-color="#1769aa" />
                        <stop offset="100%" stop-color="#2196f3" />
                    </linearGradient>
                    <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#1769aa" />
                        <stop offset="100%" stop-color="#2196f3" />
                    </linearGradient>
                </defs>
                <circle className="pl__ring" cx="100" cy="100" r="82" fill="none" stroke="url(#pl-grad1)" stroke-width="36" stroke-dasharray="0 257 1 257" stroke-dashoffset="0.01" stroke-linecap="round" transform="rotate(-90,100,100)" />
                <line className="pl__ball" stroke="url(#pl-grad2)" x1="100" y1="18" x2="100.01" y2="182" stroke-width="36" stroke-dasharray="1 165" stroke-linecap="round" />
            </svg>

            <Typography>
                Đang tải...
            </Typography>
        </Box>
    )
}
