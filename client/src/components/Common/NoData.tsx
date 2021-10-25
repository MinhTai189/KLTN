import { makeStyles, Typography } from '@material-ui/core'
import NoDataImg from 'assets/images/no-data-illustration.jpg'

interface Props {
    content?: string
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '& img': {
            width: '8em',
            height: '8em',
            objectFit: 'cover'
        },

        '& .content': {
            maxWidth: 450,
            textAlign: 'center',
            fontSize: 14,
            opacity: 0.8,
            marginTop: 8
        }
    }
})

export const NoData = ({ content = '' }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img src={NoDataImg} alt='no data illustration' />

            <Typography className='content'>{content}</Typography>
        </div>
    )
}
