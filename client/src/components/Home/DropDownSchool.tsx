import { Box, Theme, Typography } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Background from 'assets/images/background.jpg'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxHeight: 300,
        background: '#fff',
        border: `4px solid ${theme.palette.primary.main}`,
        padding: '4px 0',
        marginTop: 4,
        overflowX: 'hidden',
        overflowY: 'auto',
        transformOrigin: '0 0',
        transform: 'rotateX(90) translateY(-30px)',
        opacity: 0,

        "&::-webkit-scrollbar": {
            width: 0
        }
    },
    rows: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        transition: theme.transitions.easing.sharp,
        cursor: 'pointer',

        "&:hover": {
            background: '#d7d7d7'
        },

        "&:not(:last-child)": {
            borderBottom: '1px solid #ccc',
        }
    },
    col1: {
        color: theme.palette.text.secondary,
        flexBasis: '40%',

        "& p": {
            fontWeight: 500
        }
    },
    col2: {
        color: theme.palette.text.secondary,
        flexBasis: '30%'
    },
    col3: {
        display: 'flex',
        flexBasis: "30%",
    },
    imgs: {
        display: 'flex',
        flex: 1,

        "& img": {
            width: 45,
            height: 45,
            objectFit: 'cover',
            outline: '1px solid #ccc',

            "&:not(:last-child)": {
                marginRight: 8
            }
        }
    },
    amount: {
        width: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',

        "& svg": {
            fill: theme.palette.secondary.main,
            fontSize: 15
        },

        "& span": {
            color: theme.palette.text.secondary,
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1
        }
    }
}))

export const DropDownSchool = ({ }: Props) => {
    const classes = useStyles()
    const ref = useRef()

    // useEffect(() => {
    const timeline = gsap.timeline()
    timeline.fromTo(ref.current as any, { opacity: 0, z: 0, rotateX: 90, y: -30 },
        { opacity: 0.5, z: 500, rotateX: 88, duration: 3 })
    //     timeline.to(ref.current as any, { opacity: 0.5, z: 0, rotateX: 30 })
    //     timeline.to(ref.current as any, { opacity: 1, rotateX: 0 })
    // })

    return (
        <div className={classes.root} ref={ref as any}>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                        <img src={Background} alt='motel' />
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.rows}>
                <Box className={classes.col1}>
                    <Typography>
                        Trường đại học Tiền Giang
                    </Typography>
                </Box>

                <Box className={classes.col2}>
                    <Typography align='left'>
                        Thành phố Mỹ Tho
                    </Typography>
                </Box>


                <Box className={classes.col3}>
                    <Box className={classes.imgs}>
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                        <img src={Background} alt='motel' />
                    </Box>

                    <Box className={classes.amount}>
                        <Home />

                        <span>8</span>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
