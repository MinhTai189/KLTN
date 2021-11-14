import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import Motel from 'assets/images/motel.jpg'
import Review from 'assets/images/review.jpg'
import RoomMate from 'assets/images/roommate.jpg'
import { TopicCard } from "./TopicCard"
import Logo from 'assets/images/logo.png'
import { Thread } from "models/Thread"

interface Props {
    listThread: Array<Thread>
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

const listImgThread = [Motel, RoomMate, Review]

export const CommunicateSection = ({ listThread }: Props) => {
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
                    {listThread.map((thread, index) => (
                        <TopicCard
                            image={listImgThread[index]}
                            title={thread.name}
                            view='101'
                            count={thread.posts}
                            listPost=''
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
