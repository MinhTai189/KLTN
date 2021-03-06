import { Box, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Logo from 'assets/images/logo.png';
import { Link } from 'react-router-dom';

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '0 4vw',

        '& .logo': {
            width: 45,
            height: 45,
        },

        '& .user-info': {
            display: 'flex',
            alignItems: 'center',

            '& .avatar': {
                width: 35,
                height: 35,
                marginRight: theme.spacing(0.5)
            },

            '& .name': {
                fontSize: '0.95rem',
                verticalAlign: 'unset'
            }
        }
    }
}))

const Navigation = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Link to='/'>
                <img className='logo' src={Logo} alt='' />
            </Link>

            <Box className='user-info'>
            </Box>
        </Box>
    )
}

export default Navigation
