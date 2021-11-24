import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import Motel from 'assets/images/motel.jpg'
import Review from 'assets/images/review.jpg'
import RoomMate from 'assets/images/roommate.jpg'
import { TopicCard } from "./TopicCard"
import Logo from 'assets/images/logo.png'
import { Thread } from "models/Thread"
import { useAppSelector } from "app/hooks"
import { selectDataThread } from "features/communicate/threadSlice"
import { useEffect, useState } from "react"
import { FIND_MOTEL_ID, FIND_ROOMMATE_ID, REVIEW_ID } from "contants/contants"
import postApi from "api/post"

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

const listImgThread = [Motel, RoomMate, Review]

export const CommunicateSection = ({ }: Props) => {
    const classes = useStyles()
    const listThread = useAppSelector(selectDataThread)

    const [listPostRecent, setListPostRecent] = useState({
        [FIND_MOTEL_ID]: [],
        [FIND_ROOMMATE_ID]: [],
        [REVIEW_ID]: [],
    })

    useEffect(() => {
        const iniFilter = {
            _page: 1,
            _limit: 3
        }

        try {
            const findMotelPromise = postApi.get({
                ...iniFilter,
                _subject: FIND_MOTEL_ID
            })

            const findRoommatePromise = postApi.get({
                ...iniFilter,
                _subject: FIND_ROOMMATE_ID
            })

            const reviewPromise = postApi.get({
                ...iniFilter,
                _subject: REVIEW_ID
            })

            Promise.all([findMotelPromise, findRoommatePromise, reviewPromise])
                .then(posts => {
                    posts.forEach(post => setListPostRecent(prev => ({
                        ...prev,
                        [post.data[0].subject._id]: post.data
                    })))
                })
        } catch (error) {
            console.log(error)
        }
    }, [])

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
                    {listThread && listThread.map((thread, index) => (
                        <TopicCard
                            key={thread._id}
                            image={listImgThread[index]}
                            title={thread.name}
                            view={thread.views}
                            count={thread.posts}
                            // @ts-ignore
                            listPost={listPostRecent[thread._id]}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
