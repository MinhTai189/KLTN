import { Box, makeStyles, Theme, Tooltip } from "@material-ui/core"
import transitions from "@material-ui/core/styles/transitions"
import { Facebook, Mail, Phone, Star } from "@material-ui/icons"
import School from 'assets/images/school.png'
import { ReactComponent as Zalo } from 'assets/images/zalo.svg'

interface Props {

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

export const InforMotelDetail = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <h1 className={classes.name}>Nhà trọ Minh Tài</h1>

            <ul className={classes.schools}>
                <Tooltip title='Trường đại học Tiền Giang'>
                    <img src={School} alt="logo school" />
                </Tooltip>
                <Tooltip title='Trường đại học Tiền Giang'>
                    <img src={School} alt="logo school" />
                </Tooltip>
                <Tooltip title='Trường đại học Tiền Giang'>
                    <img src={School} alt="logo school" />
                </Tooltip>
            </ul>

            <Box className={classes.wrapper}>
                <h3 className="title">Thông tin mô tả</h3>

                <p className="content">
                    Bước lên cầu thang lên gác có thể thấy có lối đi chia về hai hướng. Rẽ sang bên trái là phòng của bố mẹ em, còn bên phải là phòng của em trai em. Phòng bố mẹ lớn hơn một chút so với các phòng còn lại, được sơn màu hồng tím nhạt. Bố em sơn màu sơn này vì đó là màu yêu thích của mẹ. Phòng em trai em són màu xanh đậm. Đúng tính chất căn phòng của một cậu bé năng động, căn phòng ấy có đủ loại đồ chơi và hình dán các siêu anh hùng. Trên tầng 3 là phòng của em và hiên nhà, nơi để phơi và giặt quần áo. Em chọn căn phòng trên tầng cao nhất là vì từ đây có thể nhìn ra thành phố, không khí rất thoáng đãng, trong lành.
                </p>
            </Box>

            <Box className={classes.wrapper}>
                <h3 className="title">Thông tin chi tiết</h3>

                <div className="row">
                    <span className="label"><b>Địa chỉ:</b></span>

                    <span className="text">123/2, Thân Cửu Nghĩa, Châu Thành, Tiền Giang</span>
                </div>

                <div className="row">
                    <span className="label"><b>Điểm đánh giá:</b></span>

                    <span className="text">
                        {new Array(5).fill(1).map((_, index) => (
                            <Star key={index} />
                        ))}
                    </span>
                </div>

                <div className="row" style={{ alignItems: 'flex-start' }}>
                    <span className="label"><b>Liên hệ:</b></span>

                    <div className="contact">
                        <span className="contact__row">
                            <span className='icon'><Phone /></span>
                            <span className="contact__text">
                                <a href="tel:+84366471931">0366471931</a>
                            </span>
                        </span>

                        <span className="contact__row">
                            <span className='icon'><Mail /></span>
                            <span className="contact__text">
                                <a href="mailto:ktln.110.088@gmail.com">ktln.110.088@gmail.com</a>
                            </span>
                        </span>

                        <span className="contact__row">
                            <span className='icon'><Facebook /></span>
                            <span className="contact__text">
                                <a href="">Trần Minh Tài</a>
                            </span>
                        </span>

                        <span className="contact__row">
                            <span className='icon'><Zalo /></span>
                            <span className="contact__text">
                                <a href="">0366471931</a>
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
