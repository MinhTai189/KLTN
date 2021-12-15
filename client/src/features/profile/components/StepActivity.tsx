import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Activity } from "models"
import { Link } from "react-router-dom"
import { calculateCreatedTimeHDMY } from "utils/convert-date/calculateCreatedTime"

interface Props {
    activity: Activity
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(3),

        '& .top': {
            display: 'flex',
            alignItems: 'flex-end',

            '& .title': {
                fontSize: '1rem',
                fontWeight: 500,
                marginRight: theme.spacing(1.5),

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.9rem',
                }
            },

            '& .date': {
                fontSize: '0.9rem',
                color: theme.palette.text.secondary,

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.75rem',
                }
            }
        },

        '& .content': {
            background: '#edeef2',
            padding: theme.spacing(1.5),
            marginTop: theme.spacing(1),
            borderRadius: 5,
            fontSize: '0.85rem',

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.75rem',
                padding: theme.spacing(0.7, 1),
                lineHeight: 1.3
            }
        }
    }
}))

const StepActivity = ({ activity }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Link to={activity.url}>
                <Box className="top">
                    <Typography variant="h5" className='title'>
                        {activity.title}
                    </Typography>

                    <Typography className="date">
                        {calculateCreatedTimeHDMY(activity.createdAt)}
                    </Typography>
                </Box>

                <Box className="content">
                    {activity.content}
                </Box>
            </Link>
        </Box>
    )
}

export default StepActivity
