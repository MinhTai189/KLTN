import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import Logo from 'assets/images/logo-white.png'
import { ButtonCustom } from 'components/Common/Button'
import { useHistory } from 'react-router'
import { ItemMotel } from '..'
import { selectDataMotel } from '../../motelSlice'

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
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
    listMotel: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gridGap: '3.5em',
        marginBlock: 80,
    },
    seeMore: {
        textAlign: 'center',
        marginTop: 16,

        "& button": {
            position: 'relative',
        }
    }
}))

export const ListMotel = () => {
    const classes = useStyles()
    const listMotel = useAppSelector(selectDataMotel)
    const history = useHistory()

    const hanleSeeMore = () => {
        history.push('/motels')
    }

    return (
        <div className='container'>
            <Typography variant='h2' className={classes.title}>
                Danh sách nhà trọ

                <img src={Logo} alt="logo" />
            </Typography>

            <ul className={classes.listMotel}>
                {listMotel.map((motel, index) => (
                    <ItemMotel key={index} motelData={motel} />
                ))}
            </ul>

            <div className={classes.seeMore}>
                <ButtonCustom sizeBtn='large' onClick={hanleSeeMore}>
                    Xem thêm
                </ButtonCustom>
            </div>
        </div>
    )
}
