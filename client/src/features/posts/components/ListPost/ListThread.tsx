import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { FIND_MOTEL_ID, FIND_ROOMMATE_ID, REVIEW_ID } from "constant/constant"
import ListPostContext from "features/posts/contexts/ListPostContext"
import { useContext } from "react"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',
        borderRight: '2px solid',

        [theme.breakpoints.down('sm')]: {
            border: 'none',
            borderBottom: '2px solid',
        },

        '& > .wrapper': {
            display: 'flex',
            flexDirection: 'column',

            [theme.breakpoints.down('sm')]: {
                flexDirection: 'row',
                marginBottom: theme.spacing(1)
            },

            '& .items': {
                cursor: 'pointer',
                padding: theme.spacing(1, 1.5),
                borderRadius: '5px 0 0 5px',
                transition: '500ms',

                [theme.breakpoints.down('sm')]: {
                    borderRadius: 5,
                    padding: theme.spacing(0.5, 1),
                },

                '&:hover, &.active': {
                    background: '#000',

                    '& .thread': {
                        color: '#fff'
                    }
                },

                '&:not(:last-child)': {
                    marginBottom: theme.spacing(1),

                    [theme.breakpoints.down('sm')]: {
                        marginBottom: 0
                    },
                },

                '& .thread': {
                    fontSize: '1.3em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '1em',
                    },
                }
            }
        }
    }
}))

export const ListThread = () => {
    const classes = useStyles()
    const { currentSelectedThread, setCurrentSelectedThread } = useContext(ListPostContext)

    return (
        <Box className={classes.root}>
            <ul className="wrapper">
                <li
                    className={`items ${currentSelectedThread === FIND_MOTEL_ID ? 'active' : ''}`}
                    onClick={() => setCurrentSelectedThread(FIND_MOTEL_ID)}
                >
                    <Typography className='thread' variant='h6'>
                        Tìm nhà trọ
                    </Typography>
                </li>
                <li
                    className={`items ${currentSelectedThread === FIND_ROOMMATE_ID ? 'active' : ''}`}
                    onClick={() => setCurrentSelectedThread(FIND_ROOMMATE_ID)}
                >
                    <Typography className='thread' variant='h6'>
                        Tìm bạn ở ghép
                    </Typography>
                </li>
                <li
                    className={`items ${currentSelectedThread === REVIEW_ID ? 'active' : ''}`}
                    onClick={() => setCurrentSelectedThread(REVIEW_ID)}
                >
                    <Typography className='thread' variant='h6'>
                        Đánh giá
                    </Typography>
                </li>
            </ul>
        </Box>
    )
}
