import { Box, Grid, makeStyles, Paper, Theme, Tooltip, Typography } from "@material-ui/core"
import { Facebook, Mail, Phone, Star, StarBorder, StarHalf } from "@material-ui/icons"
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
import { MotelDetail, Room } from "models"
import { roundMark, twoNumber } from "utils"
import { CreatedUser, InforRoomDetail } from "."

interface Props {
    dataMotel: MotelDetail
    room: Room[]
    setOpenRoomModal: (state: boolean) => void
    handleSelectRoom: (id: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        background: '#f7f7f7',
        padding: theme.spacing(1, 2)
    },
    name: {
        width: '100%',
        fontSize: '1.3em',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 2,
        // color: theme.palette.primary.main
    },
    statistics: {
        display: 'flex',
        alignItems: 'center',
        marginBlock: 8,
        background: '#fff',
        padding: theme.spacing(0.8, 1.5),
        borderRadius: 5,
        boxShadow: theme.shadows[1],

        '& .col': {
            display: 'flex',

            '& .number': {
                fontSize: '1.3em',
                color: '#48a9a6',
                fontWeight: 400,
                marginRight: 4,
                lineHeight: 1,
                textDecoration: 'underline',
            },

            '& .stars ': {
                '& .MuiSvgIcon-root': {
                    width: '0.65em',
                    height: '0.65em',
                    fill: '#666'
                }
            },

            '& .text': {
                fontSize: '0.85em',
                color: '#666'
            }
        },

        '& .divider': {
            width: 1,
            height: 20,
            background: '#ccc',
            marginInline: 12
        }
    },
    schools: {
        display: 'flex',
        alignItems: 'center',
        margin: 0,

        "& img": {
            width: '1.2em',
            height: '1.2em',

            "&:not(:last-child)": {
                marginRight: 8
            }
        }
    },
    wrapper: {
        width: '100%',
        maxWidth: 800,
        marginTop: 16,

        "& .title": {
            fontSize: '1.2em',
            marginBottom: 4
        },

        "& .content": {
            fontSize: '1em',
            color: '#333',
        },

        "& .row": {
            marginBottom: 8,
            display: 'flex',
            alignItems: 'flex-end',
            paddingLeft: 16,

            "& .label": {
                fontSize: '1em',
                marginRight: 8
            },

            "& .text": {
                fontSize: '0.9em',
            },

            "& .contact": {
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid',
                paddingLeft: 8,

                "& .contact__row": {
                    display: 'flex',
                    alignItems: 'center',

                    "&:not(:last-child)": {
                        marginBottom: 6,
                    },

                    "& .icon": {
                        height: 'fit-content',
                        marginRight: 4,
                        display: 'grid',
                        placeItems: 'center',

                        '& .MuiSvgIcon-root, & svg': {
                            width: 18,
                            height: 18,
                        },
                    },

                    "& .contact__text a": {
                        fontSize: '0.9em',
                        color: '#333',
                        transitions: '300ms all ease',

                        "&:hover": {
                            color: theme.palette.primary.main,
                            paddingLeft: 4
                        }
                    },
                }
            }
        }
    },
    wrapperInfor: {
        padding: theme.spacing(0.7),
        // background: '#dbdbdb',
    },
}))

export const InforMotelDetail = ({ dataMotel, room, handleSelectRoom, setOpenRoomModal }: Props) => {
    const classes = useStyles()
    const { name, school, amountRate, desc, address, mark, contact: { phone, facebook, email, zalo } } = dataMotel
    let markToStar = roundMark(mark as number) || [0, 0]

    return (
        <Box className={classes.root}>
            <div>
                <Grid container spacing={2}>
                    <Grid item sm={12} md={8}>
                        <h1 className={classes.name}>{name}</h1>

                        <div className={classes.statistics}>
                            <div className="col">
                                <span className="number">
                                    {mark.toFixed(1)}
                                </span>

                                <span className="stars">
                                    {new Array(5).fill(1).map((_, index) => {
                                        if (markToStar[0] > 0) {
                                            markToStar[0] = markToStar[0] - 1
                                            return <Star key={index} />
                                        } else if (markToStar[1] !== 0) {
                                            markToStar[1] = 0
                                            return <StarHalf key={index} />
                                        }
                                        return <StarBorder key={index} />
                                    })}
                                </span>
                            </div>

                            <span className='divider'></span>

                            <div className="col">
                                <span className="number">
                                    {twoNumber(amountRate)}
                                </span>

                                <Typography className='text'>
                                    Đánh giá
                                </Typography>
                            </div>

                            <span className='divider'></span>

                            <div className="col">
                                <span className="number">
                                    00
                                </span>

                                <Typography className='text'>
                                    Chỉnh sửa
                                </Typography>
                            </div>

                            <span className='divider'></span>

                            <div className="col">
                                <ul className={classes.schools}>
                                    {school.map((item, index) => (
                                        <Tooltip key={index} title={item.name}>
                                            <img src={item.logo} alt="logo school" />
                                        </Tooltip>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <Paper className={classes.wrapperInfor}>
                            <CreatedUser />
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            <Box className={classes.wrapper}>
                <h3 className="title">Thông tin mô tả</h3>

                <p className="content">
                    {desc}
                </p>
            </Box>

            <Box className={classes.wrapper}>
                <h3 className="title">Thông tin chi tiết</h3>

                <div className="row">
                    <span className="label"><b>Địa chỉ:</b></span>

                    <span className="text">{address}</span>
                </div>

                <div className="row" style={{ alignItems: 'flex-start' }}>
                    <span className="label"><b>Liên hệ:</b></span>

                    <div className="contact">
                        <span className="contact__row" style={!phone ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                            <span className='icon'><Phone /></span>
                            <span className="contact__text">
                                <a href={`tel:+84${phone?.slice(1, phone.length)}`}>{phone || 'Không xác định'}</a>
                            </span>
                        </span>

                        <span className="contact__row" style={!email ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                            <span className='icon'><Mail /></span>
                            <span className="contact__text">
                                <a href={`mailto:${email}`}>{email || 'Không xác định'}</a>
                            </span>
                        </span>

                        <span className="contact__row" style={!facebook ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                            <span className='icon'><Facebook /></span>
                            <span className="contact__text">
                                <a href={facebook}>{facebook ? 'Facebook' : 'Không xác định'}</a>
                            </span>
                        </span>

                        <span className="contact__row" style={!zalo ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                            <span className='icon'><Zalo /></span>
                            <span className="contact__text">
                                <a href={`https://zalo.me/${zalo}`}>{zalo || 'Không xác định'}</a>
                            </span>
                        </span>
                    </div>
                </div>

                <InforRoomDetail room={room} setOpenRoomModal={setOpenRoomModal} handleSelectRoom={handleSelectRoom} />

            </Box>
        </Box>
    )
}
