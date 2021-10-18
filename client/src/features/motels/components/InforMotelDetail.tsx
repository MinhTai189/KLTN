import { Box, makeStyles, Theme, Tooltip } from "@material-ui/core"
import { Facebook, Mail, Phone, Star, StarBorder, StarHalf } from "@material-ui/icons"
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'
import { MotelDetail } from "models"
import { roundMark } from "utils"

interface Props {
    dataMotel: MotelDetail
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
    },
    name: {
        width: '100%',
        textAlign: 'center',
        fontSize: 30,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    schools: {
        display: 'flex',
        justifyContent: 'center',

        "& img": {
            width: 20,
            height: 20,

            "&:not(:last-child)": {
                marginRight: 16
            }
        }
    },
    wrapper: {
        width: '100%',
        maxWidth: 800,

        "& .title": {
            fontSize: 22,
            marginBottom: 4
        },

        "& .content": {
            fontSize: 17,
        },

        "& .row": {
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',

            "& .label": {
                fontSize: 17,
                lineHeight: 1,
                marginRight: 8
            },

            "& .text": {
                fontSize: 17,
                lineHeight: 1.2,
            },

            "& .contact": {
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '2px solid',
                paddingLeft: 8,

                "& .contact__row": {
                    display: 'flex',
                    alignItems: 'center',

                    "&:not(:last-child)": {
                        marginBottom: 8,
                    },

                    "& .icon": {
                        height: 'fit-content',
                        marginRight: 8,
                        display: 'grid',
                        placeItems: 'center',
                    },

                    "& .contact__text a": {
                        fontSize: 16,
                        color: 'unset',
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
}))

export const InforMotelDetail = ({ dataMotel }: Props) => {
    const classes = useStyles()
    const { name, school, desc, address, mark, contact: { phone, facebook, email, zalo } } = dataMotel
    let markToStar = roundMark(mark as number) || [0, 0]

    return (
        <Box className={classes.root}>
            <h1 className={classes.name}>{name}</h1>

            <ul className={classes.schools}>
                {school.map((item, index) => (
                    <Tooltip key={index} title={item.name}>
                        <img src={item.logo} alt="logo school" />
                    </Tooltip>
                ))}
            </ul>

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

                <div className="row">
                    <span className="label"><b>Điểm đánh giá:</b></span>

                    <span className="text">
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

                <div className="row">
                    <span className="label"><b>Thông tin phòng trọ:</b></span>
                </div>
            </Box>
        </Box>
    )
}
