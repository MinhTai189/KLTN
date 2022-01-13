import { Avatar, Box, Grid, makeStyles, Paper, Theme, Tooltip, Typography, withStyles, Zoom, Divider } from "@material-ui/core"
import { Facebook, Mail, Phone, Star, StarBorder, StarHalf } from "@material-ui/icons"
import { useAppSelector } from "app/hooks"
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
import { ButtonCustom, ChipCustom } from "components/Common"
import { selectCurrentUser } from "features/auth/authSlice"
import { Editor, MotelDetail, OwnerDetail, Room } from "models"
import { useCallback, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { toast } from "react-toastify"
import { roundMark, twoNumber } from "utils"
import { mapPriceMonth } from "utils/getPriceMotel"
import { getColorChip, styleChips } from 'utils/styleChips'
import { CreatedUser, InforRoomDetail } from ".."

interface Props {
    dataMotel: MotelDetail
    room: Room[]
    setOpenMotelModal: (state: boolean) => void
    setOpenRoomModal: (state: boolean) => void
    handleSelectRoom: (id: string) => void
    editor: Editor[]
    owner: OwnerDetail | undefined
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        background: '#f7f7f7',
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },

        '& .info-wrapper': {
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column-reverse'
            }
        }
    },
    name: {
        width: '100%',
        fontSize: '1.7em',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            fontSize: '1.55em',
        },

        [theme.breakpoints.down('xs')]: {
            fontSize: '1.5em',
            marginBottom: 0,
        },
    },
    statistics: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBlock: 8,
        background: '#fff',
        padding: theme.spacing(0.8, 1.5),
        borderRadius: 5,
        boxShadow: theme.shadows[1],

        '& .col': {
            display: 'flex',

            [theme.breakpoints.down('sm')]: {
                alignItems: 'center'
            },

            '& .number': {
                fontSize: '1.2em',
                color: theme.palette.primary.main,
                marginRight: 4,
                lineHeight: 1,
                textDecoration: 'underline',

                [theme.breakpoints.down('sm')]: {
                    fontSize: '1em',
                }
            },

            '& .stars ': {
                '& .MuiSvgIcon-root': {
                    width: '0.6em',
                    height: '0.6em',
                    fill: '#666',

                    [theme.breakpoints.down('sm')]: {
                        width: '0.45em',
                        height: '0.45em',
                    }
                }
            },

            '& .text': {
                fontSize: '0.8em',
                color: '#666',

                [theme.breakpoints.down('sm')]: {
                    fontSize: '0.65em',
                }
            }
        },

        '& .divider': {
            width: 1,
            height: 20,
            background: '#ccc',
            marginInline: 12,

            [theme.breakpoints.down('sm')]: {
                marginInline: 8,
            }
        },
    },
    chips: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',

        '& .chip': {
            marginBottom: 4,

            '&:not(:last-child)': {
                marginRight: 4,
            }
        }
    },
    schools: {
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        gap: theme.spacing(1),

        "& img": {
            width: '1.2em',
            height: '1.2em',

            [theme.breakpoints.down('sm')]: {
                width: '.9em',
                height: '.9em',
            }
        }
    },
    wrapper: {
        width: '100%',
        marginTop: 16,

        [theme.breakpoints.down('sm')]: {
            marginTop: 8
        },

        "& .title": {
            fontSize: '1.2em',
            marginBottom: 4,

            [theme.breakpoints.down('sm')]: {
                fontSize: '1.1em',
            }
        },

        "& .content": {
            fontSize: '1em',
            color: '#333',

            [theme.breakpoints.down('sm')]: {
                fontSize: '0.9em',
            }
        },

        "& .row": {
            marginBottom: 8,
            display: 'flex',
            alignItems: 'flex-end',
            paddingLeft: 16,

            "& .label": {
                fontSize: '1em',
                marginRight: 8,

                [theme.breakpoints.down('sm')]: {
                    fontSize: '0.9em',
                }
            },

            "& .text": {
                fontSize: '0.9em',

                [theme.breakpoints.down('sm')]: {
                    fontSize: '0.8em',
                }
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

                            [theme.breakpoints.down('sm')]: {
                                width: 16,
                                height: 16,
                            }
                        },
                    },

                    "& .contact__text a": {
                        fontSize: '0.9em',
                        color: '#333',
                        transitions: '300ms all ease',

                        [theme.breakpoints.down('sm')]: {
                            fontSize: '0.8em'
                        },

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
    },
}))

export const InforMotelDetail = ({ dataMotel, room, handleSelectRoom, setOpenRoomModal, editor, setOpenMotelModal, owner }: Props) => {
    const classes = useStyles()
    const { name, school, amountRate, desc, address, mark, status, contact: { phone, facebook, email, zalo } } = dataMotel
    const [listPrice, setListPrice] = useState<string[]>([])

    const currentUser = useAppSelector(selectCurrentUser)
    const getListPrice = useCallback(() => room.map(r => mapPriceMonth(r.price) + '/tháng'), [room])
    let markToStar = roundMark(mark as number) || [0, 0]

    const HtmlTooltip = withStyles((theme: Theme) => ({
        tooltip: {
            background: '#fff',
            maxWidth: 220,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[4],
            padding: 0,

            '& .MuiTooltip-arrow::before': {
                background: '#fff'
            },

            '& .tooltip-wrraper': {
                display: 'flex',
                flexDirection: 'column',
                padding: theme.spacing(1, 1.5),

                '& .top-tooltip': {
                    display: 'flex',
                    marginBottom: 8,
                    padding: theme.spacing(0.5, 1),
                    borderRadius: 5,
                    cursor: 'pointer',
                    transition: '300ms',

                    "&:hover": {
                        background: 'rgba(0,0,0, 0.1)',
                    },

                    '& img': {
                        width: '3.8em',
                        height: '3.8em',
                        objectFit: 'cover',
                        marginRight: 16,
                        borderRadius: '50%',
                        boxShadow: theme.shadows[3]
                    },

                    '& .name': {
                        ontWeight: 300,
                        fontSize: '1.35em',
                    },

                    '& .title': {
                        fontWeight: 300,
                        fontSize: '1.35em',
                    }
                },

                '& .bottom-tooltip': {
                    borderTop: '1px dashed #ccc',
                    paddingTop: 4,

                    '& .content': {
                        fontSize: '1.4em',
                        color: '#777',
                        marginBottom: 4,
                    },
                    '& .date': {
                        fontSize: '0.9em',
                        textAlign: 'right',
                        color: '#7d7d7d'
                    }
                }
            }
        },
    }))(Tooltip);

    const TopToolTip = (userId: string, avatar: string, name: string, isAdmin: boolean) => {
        return (
            <Link to={`/profile/${userId}`}>
                <Box className='top-tooltip'>
                    <img src={avatar} alt="avatar" />

                    <span className="detail">
                        <Typography className='name'>{name}</Typography>
                        <Typography className='title'>{isAdmin ? 'Admin' : 'User'}</Typography>
                    </span>
                </Box>
            </Link>
        )
    }

    const BottomToolTip = (content: string, date: string) => {
        const createdDate = new Date(date)
        const createdAt = createdDate.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })

        return (
            <Box className='bottom-tooltip'>
                <Typography className='content'>{content}</Typography>

                <Typography className='date'>{createdAt}</Typography>
            </Box>
        )
    }

    useEffect(() => {
        setListPrice(getListPrice())
    }, [getListPrice])

    const handleClickUpdateMotel = () => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để có thể sử dụng chức năng này!')
            return;
        }

        setOpenMotelModal(true)
    }

    return (
        <Box className={classes.root}>
            <div>
                <Grid container>
                    <Grid item xs={12}>
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
                                    {twoNumber(editor.length)}
                                </span>

                                <Typography className='text'>
                                    Yêu thích
                                </Typography>
                            </div>

                            <span className='divider'></span>

                            <div className="col">
                                <span className="number">
                                    {twoNumber(editor.length)}
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

                        <Grid className='info-wrapper' container spacing={1}>
                            <Grid item xs={12} sm={7} md={8} lg={7} xl={8}>
                                <ul className={classes.chips}>
                                    <li className="chip">
                                        <ChipCustom
                                            style={status ? styleChips.green : styleChips.red}
                                            label={status ? 'Còn phòng' : 'Hết phòng'}
                                            size='medium'
                                            color='primary'
                                        />
                                    </li>

                                    {listPrice.length > 0 && listPrice.map((price, index) => {
                                        const color = getColorChip()

                                        return <li key={index} className="chip">
                                            <ChipCustom
                                                // @ts-ignore
                                                style={styleChips[color]}
                                                label={price}
                                                size='medium'
                                                color='primary'
                                            />
                                        </li>
                                    })}

                                    {editor.length > 0 && editor.map((e, index) => {
                                        const color = getColorChip()

                                        return <li key={index} className="chip">
                                            <HtmlTooltip
                                                arrow
                                                interactive
                                                TransitionComponent={Zoom}
                                                title={
                                                    <Box
                                                        className='tooltip-wrraper'
                                                    >
                                                        {TopToolTip(e.user._id, e.user.avatarUrl, e.user.name, e.user.isAdmin)}
                                                        {BottomToolTip(e.edited, e.createdAt)}
                                                    </Box>
                                                }
                                            >
                                                <ChipCustom
                                                    // @ts-ignore
                                                    style={styleChips[color]}
                                                    clickable
                                                    label='Đã chỉnh sửa'
                                                    avatar={<Avatar src={e.user.avatarUrl} alt='avatar' />}
                                                    size='medium'
                                                    color='primary'
                                                />
                                            </HtmlTooltip>
                                        </li>
                                    })}
                                </ul>

                                <h1 className={classes.name}>{name}</h1>
                            </Grid>
                            <Grid item xs={12} sm={5} md={4} lg={5} xl={4}>
                                <Paper className={classes.wrapperInfor}>
                                    {owner && <CreatedUser owner={owner} />}

                                    <Divider style={{ marginTop: 4, marginBottom: 4 }} />

                                    <Box>
                                        <ButtonCustom
                                            style={{ borderRadius: 0 }}
                                            sizeBtn='small'
                                            fullWidth
                                            onClick={handleClickUpdateMotel}
                                        >
                                            Chỉnh sửa nhà trọ
                                        </ButtonCustom>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            <Box className={classes.wrapper}>
                <h3 className="title">Thông tin mô tả</h3>

                <p className="content" dangerouslySetInnerHTML={{ __html: desc }} />
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
