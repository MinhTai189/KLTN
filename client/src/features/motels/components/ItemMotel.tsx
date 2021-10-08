import { CircularProgress, makeStyles, Theme, Tooltip } from '@material-ui/core'
import { AcUnit, Build, CallMerge, Favorite, FavoriteBorder, FavoriteOutlined, Group, HorizontalSplit, Hotel, Motorcycle, Star, StarBorder, StarHalf, Toys, TrendingUp, Videocam, Wifi } from '@material-ui/icons'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Motel from 'assets/images/motel.jpg'
import { ButtonCustom } from 'components/Common/Button'
import { authActions, selectCurrentUser, selectLoading } from 'features/auth/authSlice'
import { Motel as MotelModel, User } from 'models'
import { ReactElement, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import { roundMark } from 'utils'
import { getPriceMotel } from 'utils/getPriceMotel'

interface Props {
    motelData: MotelModel
}

interface Optional {
    title: string;
    icon: ReactElement
}

interface ObjectOptional {
    wifi: Optional;
    ml: Optional;
    gac: Optional;
    nx: Optional;
    camera: Optional;
    quat: Optional;
    tl: Optional;
    giuong: Optional;
    gt: Optional;
    cc: Optional;
    dcvs: Optional
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 350,
        height: 460,
        overflow: 'hidden',
        marginBottom: 80,
        outline: `5px solid ${theme.palette.primary.main}`,
        boxShadow: '4px 4px 10px 5px #828282',
        transition: 'all 500ms ease',

        "&:hover": {
            transform: 'translateY(-10px)',
            boxShadow: `8px 12px 10px 5px ${theme.palette.primary.main}`,

            "& .thumbnail": {
                transform: 'scale(1.07)'
            },

            "& .cover": {
                background: 'rgba(0,0,0,0.5)'
            },

            "& .listOptional .items": {
                transform: 'translateX(0)',
                opacity: 1
            }
        }
    },
    top: {
        width: "100%",
        height: '50%',
        position: 'relative',
        overflow: 'hidden',

        "& img": {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 500ms ease',
        }
    },
    cover: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        transition: 'all 500ms ease',
    },
    topLeft: {
        position: 'absolute',
        left: 0,
        bottom: '50%',
        transform: 'translateY(50%)',

        "& .listOptional": {
            display: 'flex',
            flexDirection: 'column-reverse',

            "& .items": {
                width: 23,
                height: 15,
                opacity: 0,
                background: theme.palette.primary.main,
                borderRadius: '0 5px 5px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 4,
                transform: 'translateX(-100%)',
                transition: 'all 500ms ease',

                "&:not(:last-child)": {
                    marginTop: 12
                },

                "& .MuiSvgIcon-root": {
                    width: 11,
                    color: 'white'
                }
            }
        },
    },
    topRight: {
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',

        "& .favorite": {
            width: 45,
            height: 40,
            background: theme.palette.primary.main,
            borderRadius: '0 0 0 100px',
            display: 'grid',
            placeItems: 'center',
            paddingLeft: 5,
            paddingBottom: 8,
            marginBottom: 8,

            "& .MuiSvgIcon-root": {
                cursor: 'pointer',
                transitions: 'transform 300ms ease',

                "&:hover": {
                    transform: 'scale(1.15)'
                }
            }
        },

        "& .stars": {
            display: 'flex',
            flexDirection: 'column',
            paddingRight: 10,
            marginBottom: 5
        },

        "& .status": {
            width: 50,
            height: 18,
            textAlign: 'center',
            background: '#19BB0B',
            transform: 'rotate(90deg)',
            fontSize: 11,
            fontWeight: 600,
            marginTop: 23,
            marginRight: -5,
            pointerEvents: 'none'
        },

        "& .MuiSvgIcon-root": {
            color: 'white',
            width: 20,
            height: 20,
        }
    },
    bottom: {
        padding: 8,
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        "& .info": {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            "& .name": {
                color: theme.palette.primary.main,
                margin: 0,
                fontSize: 17
            },

            "& .price": {
                background: theme.palette.secondary.main,
                fontSize: 11,
                padding: '1px 7px'
            },
        },

        "& .desc": {
            fontSize: 13,
            lineHeight: 1.4,
            color: '#7C7C7C',
            marginTop: 5
        },

        "& .rowBottom": {
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            "& .schools": {
                display: 'flex',

                "& img": {
                    height: 22,

                    "&:not(:last-child)": {
                        marginRight: 4
                    }
                }
            }
        }
    },
}))

const optionalIcons: any = {
    wifi: {
        title: 'Wifi',
        icon: <Wifi />
    },
    ml: {
        title: 'Máy lạnh',
        icon: <AcUnit />
    },
    gac: {
        title: 'Gác',
        icon: <CallMerge />
    },
    nx: {
        title: 'Nhà xe',
        icon: <Motorcycle />
    },
    camera: {
        title: 'Camera an ninh',
        icon: <Videocam />
    },
    quat: {
        title: 'Quạt',
        icon: <Toys />
    },
    tl: {
        title: 'Phòng trên lầu',
        icon: <TrendingUp />
    },
    giuong: {
        title: 'Giường sẵn',
        icon: <Hotel />
    },
    gt: {
        title: 'Giường tầng',
        icon: <HorizontalSplit />
    },
    cc: {
        title: 'Ở cùng',
        icon: <Group />
    },
    dcvs: {
        title: 'Dụng cụ vệ sinh',
        icon: <Build />
    },
}

export const ItemMotel = ({ motelData }: Props) => {
    const classes = useStyles()
    const { _id, thumbnail, optional, name, room, desc, school, status, mark } = motelData
    const currentUser: User = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    const loading = useAppSelector(selectLoading)
    const [isLike, setIsLike] = useState(false)
    const history = useHistory()

    let optionalKeys: string[] = Object.keys(optional as any)
    let optionalValues: boolean[] = Object.values(optional as any)
    let markToStar = roundMark(mark as number) || [0, 0]

    let indexOptional = 0;

    useEffect(() => {
        currentUser && setIsLike(checkFavoriteMotel())
        console.log({ currentUser, isLike })
    }, [currentUser])

    const onClickDetail = () => {
        history.push(`/motels/${_id}`)
    }

    const handleFavoriteMotel = () => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để sử dụng chức năng này!')
            return;
        }

        if (isLike) {
            dispatch(authActions.unlikeMotel(_id as string))
        } else {
            dispatch(authActions.likeMotel(_id as string))
        }
    }

    const checkFavoriteMotel = (): boolean => {
        return !!currentUser.favorite && currentUser.favorite.includes(_id as string)
    }

    return (
        <li className={classes.root}>
            <div className={classes.top}>
                <img className={thumbnail as string} src={Motel} alt="motel image" />

                <div className={`${classes.cover} cover`}></div>

                <div className={classes.topLeft}>
                    <ul className="listOptional">
                        {optionalValues.length > 0 && optionalValues.map((value, index) => {
                            const delay = 0.3 + 0.07 * (indexOptional + 1)
                            if (value === false) return;
                            indexOptional++

                            const key = optionalKeys[index]

                            return (
                                <Tooltip key={index} title={optionalIcons[key].title}>
                                    <span className="items" style={{ transitionDelay: `${delay}s` }}>
                                        {optionalIcons[key].icon}
                                    </span>
                                </Tooltip>
                            )
                        })}
                    </ul>
                </div>

                <div className={classes.topRight}>
                    <span className="favorite">
                        {!loading ?
                            isLike
                                ? <Tooltip title='Thêm nhà trọ vào danh sách yêu thích'>
                                    <span onClick={handleFavoriteMotel}>
                                        <Favorite />
                                    </span>
                                </Tooltip>
                                : <Tooltip title='Xóa nhà trọ vào danh sách yêu thích'>
                                    <span onClick={handleFavoriteMotel}>
                                        <FavoriteBorder />
                                    </span>
                                </Tooltip>
                            : <CircularProgress color='secondary' size={15} />
                        }
                    </span>

                    <ul className="stars">
                        {new Array(5).fill('1').map((_, index) => {
                            if (markToStar[0] > 0) {
                                markToStar[0] = markToStar[0] - 1
                                return <Star key={index} />
                            } else if (markToStar[1] !== 0) {
                                markToStar[1] = 0
                                return <StarHalf key={index} />
                            }
                            return <StarBorder key={index} />
                        })}
                    </ul>

                    <small className="status" style={{ background: status ? '#19BB0B' : '#c90404' }}>{status ? 'Trống' : 'Đầy'}</small>
                </div>
            </div>

            <div className={classes.bottom}>
                <div className="top">
                    <div className="info">
                        <h3 className="name">{name}</h3>
                        <span className="price">{`${getPriceMotel(room)}/tháng`}</span>
                    </div>

                    <p className="desc">{desc.slice(0, 250) + '...'}</p>
                </div>

                <div className="rowBottom">
                    <ButtonCustom onClick={onClickDetail}>Xem chi tiết</ButtonCustom>

                    <ul className="schools">
                        {school.map((item: any, index: number) => (
                            <Tooltip key={index} title={item.name}>
                                <img src={item.logo} alt="school logo" />
                            </Tooltip>
                        ))}
                    </ul>
                </div>
            </div>
        </li>
    )
}
