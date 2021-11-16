import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',
        borderRight: '2px solid',

        '& .wrapper': {

            '& .items': {
                cursor: 'pointer',
                padding: theme.spacing(1, 1.5),
                borderRadius: '5px 0 0 5px',
                transition: '500ms',

                '&:hover, &.active': {
                    background: '#000',

                    '& .thread': {
                        color: '#fff'
                    }
                },

                '&:not(:last-child)': {
                    marginBottom: theme.spacing(1),
                },

                '& .thread': {
                    fontSize: '1.3em'
                }
            }
        }
    }
}))

export const ListThread = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <ul className="wrapper">
                <li className="items active">
                    <Typography className='thread' variant='h6'>
                        Tìm nhà trọ
                    </Typography>
                </li>
                <li className="items">
                    <Typography className='thread' variant='h6'>
                        Tìm bạn ở ghép
                    </Typography>
                </li>
                <li className="items">
                    <Typography className='thread' variant='h6'>
                        Đánh giá
                    </Typography>
                </li>
            </ul>
        </Box>
    )
}
