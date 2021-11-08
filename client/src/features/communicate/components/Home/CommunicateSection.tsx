import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import Chat from 'assets/images/chat.jpg'
import Motel from 'assets/images/motel.jpg'
import Review from 'assets/images/review.jpg'
import RoomMate from 'assets/images/roommate.jpg'
import { TopicCard } from "./TopicCard"
import Logo from 'assets/images/logo.png'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: '#e9ecee',
        padding: theme.spacing(1, 0, 3)
    },
    title: {
        width: '100%',
        textAlign: 'center',
        padding: '16px 0',
        margin: '56px auto',
        fontSize: 15,
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontWeight: 600,
        position: 'relative',

        "&::before": {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: 150,
            height: 1,
            background: theme.palette.text.primary
        },

        "& > img": {
            width: 25,
            height: 25,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: -11
        }
    },
    wrapper: {
        padding: theme.spacing(4, 0),
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    }
}))

export const CommunicateSection = (props: Props) => {
    const classes = useStyles()

    return (
        <Box
            className={classes.root}
            component='section'
            my={6}
        >
            <Box className='container'>
                <Typography variant='h2' className={classes.title}>
                    Hỏi đáp - Trao đổi

                    <img src={Logo} alt="logo" />
                </Typography>

                <Box className={classes.wrapper}>
                    <TopicCard
                        image={Motel}
                        title='Tìm nhà trọ'
                        view='101'
                        count='4'
                        listPost=''
                    />

                    <TopicCard
                        image={Review}
                        title='Đánh giá'
                        view='8'
                        count='36'
                        listPost=''
                    />

                    <TopicCard
                        image={RoomMate}
                        title='Tìm bạn ở ghép'
                        view='2002'
                        count='200'
                        listPost=''
                    />

                    <TopicCard
                        image={Chat}
                        title='Giao lưu, thảo luận'
                        view='101'
                        count='4'
                        listPost=''
                    />
                </Box>
            </Box>
        </Box>
    )
}
