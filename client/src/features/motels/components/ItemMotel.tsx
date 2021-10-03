import { makeStyles, Theme, Tooltip } from '@material-ui/core'
import { FavoriteBorder, Settings, Star } from '@material-ui/icons'
import Motel from 'assets/images/motel.jpg'
import School from 'assets/images/school.png'
import { ButtonCustom } from 'components/Common/Button'

interface Props {

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
                    height: 11,
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
                    width: 22,
                    height: 22,

                    "&:not(:last-child)": {
                        marginRight: 4
                    }
                }
            }
        }
    },
}))

const optionalIcons = {

}

export const ItemMotel = (props: Props) => {
    const classes = useStyles()

    return (
        <li className={classes.root}>
            <div className={classes.top}>
                <img className='thumbnail' src={Motel} alt="motel image" />

                <div className={`${classes.cover} cover`}></div>

                <div className={classes.topLeft}>
                    <ul className="listOptional">
                        {new Array(7).fill(12).map((_, index) => {
                            const delay = 0.3 + 0.07 * (index + 1)

                            return (
                                <Tooltip title="Máy lạnh">
                                    <span className="items" style={{ transitionDelay: `${delay}s` }}>
                                        <Settings />
                                    </span>
                                </Tooltip>
                            )
                        })}
                    </ul>
                </div>

                <div className={classes.topRight}>
                    <span className="favorite">
                        <FavoriteBorder />
                    </span>

                    <ul className="stars">
                        {new Array(5).fill('1').map(() => (
                            <Star />
                        ))}
                    </ul>

                    <small className="status">Trống</small>
                </div>
            </div>

            <div className={classes.bottom}>
                <div className="top">
                    <div className="info">
                        <h3 className="name">Nhà trọ Minh Tài</h3>
                        <span className="price">1,2tr-1,5tr/tháng</span>
                    </div>

                    <p className="desc">Of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing...</p>
                </div>

                <div className="rowBottom">
                    <ButtonCustom>Xem chi tiết</ButtonCustom>

                    <ul className="schools">
                        {new Array(5).fill(1).map(() => (
                            <img src={School} alt="school logo" />
                        ))}
                    </ul>
                </div>
            </div>
        </li>
    )
}
