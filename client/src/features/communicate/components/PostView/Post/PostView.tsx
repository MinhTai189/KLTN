import { Avatar, Box, Breadcrumbs, Button, Divider, makeStyles, Theme, Typography } from "@material-ui/core"
import { FavoriteTwoTone, SmsTwoTone } from "@material-ui/icons"
import { useRef } from "react"
import { Link } from 'react-router-dom'
import { Comment } from "../Comment/Comment"
import { TypingComment } from "../Comment/TypingComment"
import { BtnAction } from "../Common/BtnAction"
import { MotelRecommendPost } from "../Recommended/MotelRecommendPost"
import { RelatedPost } from "../Recommended/RelatedPost"
import { Content } from "./Content"
import { ListTag } from "./ListTag"
import { StaticAction } from "./StaticAction"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    title: {
        fontSize: '2em',
        fontWeight: 500,
        marginBlock: theme.spacing(3)
    },
    authorWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),

        '& .avatar': {
            marginRight: theme.spacing(1),
            border: `2px solid ${theme.palette.primary.main}`,
            cursor: 'pointer',
            width: '2.2em',
            height: '2.2em',
        },

        '& .name': {
            fontSize: '1.25em',
            cursor: 'pointer',
            color: theme.palette.primary.main,
            fontWeight: 500
        },

        '& .date-comment': {
            '& .text': {
                fontSize: '0.9em'
            }
        }
    },
    threadActions: {
        paddingBlock: theme.spacing(1),
        borderTop: '1px solid #ccc',
        borderBottom: '1px solid #ccc',

        '& .button-group': {
            '& .btn': {
                marginRight: 16,
                background: '#edeef2',
                paddingInline: theme.spacing(2),
                textTransform: 'initial'
            },
        },
    }
}))

export const PostView = (props: Props) => {
    const classes = useStyles()
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Box className={classes.root}>
            <Box className='breadcrumb'>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link to='/'>
                        Material-UI
                    </Link>
                    <Link to='/'>
                        Core
                    </Link>
                    <Typography color="textPrimary">Breadcrumb</Typography>
                </Breadcrumbs>
            </Box>

            <Typography
                variant='h1'
                className={classes.title}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, magnam. Veniam nisi recusandae, harum animi tempore est quasi qui facilis quaerat dignissimos! A quam officiis nulla ipsa aspernatur tenetur molestiae?
            </Typography>

            <Box className={classes.authorWrapper}>
                <Link to='/'>
                    <Avatar
                        className='avatar'
                    // src={}
                    >
                        U
                    </Avatar>
                </Link>

                <Box className='author-info'>
                    <Link to='/'>
                        <Typography
                            className='name'
                            variant='h3'
                        >
                            Tran Minh Tai
                        </Typography>
                    </Link>

                    <Box className="date-comment">
                        <Typography
                            className='text'
                            component='span'>
                            4 tháng&nbsp;&#x22C5;&nbsp;
                            Bình luận: 42
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            <Box my={1}>
                <ListTag />
            </Box>

            <Box my={3}>
                <Content />
            </Box>

            <Box>
                <StaticAction />
            </Box>

            <Box
                className={classes.threadActions}
                mt={0.5}
                mb={4}
            >
                <Box className='button-group'>
                    <BtnAction icon={<FavoriteTwoTone />} />

                    <Button
                        className='btn'
                        startIcon={<SmsTwoTone />}
                        href="#comment"
                        onClick={() => { inputRef.current?.focus() }}
                    >
                        Bình luận
                    </Button>
                </Box>
            </Box>

            <Box my={4}>
                <RelatedPost />
            </Box>

            <Box my={4}>
                <MotelRecommendPost />
            </Box>

            <Box mb={2} mt={8}>
                <TypingComment
                    ref={inputRef}
                />
            </Box>

            <Comment />

            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Box>
    )
}
