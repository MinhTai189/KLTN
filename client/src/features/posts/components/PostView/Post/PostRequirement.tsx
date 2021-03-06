import { Box, makeStyles, Theme, Typography, Divider } from '@material-ui/core'
import { Require } from 'models'
import { mapPriceMonth } from 'utils/getPriceMotel'

interface Props {
    require: Require
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'inline-block',
        boxShadow: '0 0 1px 1px rgba(0,0,0,0.3)',
        padding: theme.spacing(1),
        borderRadius: 8,

        '& > .label': {
            fontSize: '1.05em',

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.95em'
            }
        },

        '& .list-require': {
            marginTop: theme.spacing(1.5),

            '& .require': {
                marginBlock: 4,

                '& .text': {
                    fontSize: '0.9em',

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.8em'
                    },

                    '& b': {
                        fontWeight: 500,
                        marginRight: theme.spacing(0.5)
                    }
                }
            }
        }
    },
}))

export const PostRequirement = ({ require }: Props) => {
    const classes = useStyles()
    const schools = require.schools ? require.schools.map(sch => sch.name).join(',') : ''

    return (
        <Box className={classes.root}>
            <Typography
                variant='h6'
                className='label'
            >
                Một số yêu cầu
            </Typography>

            <Divider />

            <Box
                component='ul'
                className='list-require'
            >
                {schools && <li className='require'>
                    <Typography className='text'>
                        <b>Gần trường: </b>
                        {schools}
                    </Typography>
                </li>}

                {require.price && <li className='require'>
                    <Typography className='text'>
                        <b>Giá khoảng: </b>
                        {`${mapPriceMonth(require.price || 0)}/tháng`}
                    </Typography>
                </li>}

                {require.additional && <li className='require'>
                    <Typography className='text'>
                        <b>Yêu cầu khác: </b>
                        {require.additional}
                    </Typography>
                </li>}
            </Box>
        </Box>
    )
}
