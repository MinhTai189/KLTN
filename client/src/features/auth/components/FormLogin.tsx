import { Box, Button, IconButton, makeStyles, Typography } from '@material-ui/core'
import { LockOpen } from '@material-ui/icons'
import React, { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import { ReactComponent as Face } from '../../../assets/images/facebook.svg'
import { ReactComponent as Google } from '../../../assets/images/google.svg'
import { CheckboxField, InputField, InputPasswordField } from '../../../components/FormFields'
import { LoginData } from '../models'
import Header from './Header'

interface Props {
    onSubmit: (data: LoginData) => void;
    setRememberMe: (value: boolean) => void
}

const initialLoginData: LoginData = {
    username: '',
    password: '',
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        padding: theme.spacing(2, 4),
        backgroundColor: '#fff',
    },
    wrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',

        "& a": {
            color: theme.palette.primary.main
        }
    },
    svg: {
        width: 22,
        height: 22,
    },
    loginBy: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',

        "& > p": {
            marginBottom: -7
        }
    }
}))

function FormLogin({ onSubmit, setRememberMe }: Props): ReactElement {
    const classes = useStyles()
    const { control, handleSubmit } = useForm<LoginData>({
        defaultValues: initialLoginData
    })

    return (
        <Box className={classes.root}>
            <Header textBtn='ĐĂNG NHẬP' icon={<LockOpen />} />

            <Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField type="text" control={control} name='username' label='Tài khoản' required={true} />
                    <InputPasswordField control={control} label="Mật khẩu" name='password' labelWidth={70} required={true} />

                    <Box>
                        <CheckboxField setValue={setRememberMe} label='Ghi nhớ đăng nhập' />
                    </Box>

                    <Box mt={1}>
                        <Button type="submit" size="large" variant="contained" color="primary" fullWidth >Đăng nhập</Button>
                    </Box>
                </form>

                <Box my={1} className={classes.wrap}>
                    <Link to="/auth/forgot-password">
                        Quên mật khẩu?
                    </Link>

                    <Link to="/auth/register">
                        Bạn chưa có tài khoản? Đăng ký
                    </Link>
                </Box>

                <Box className={classes.loginBy} mt={5} mb={1}>
                    <Typography component='p'>Đăng nhập với:</Typography>

                    <IconButton>
                        <Google className={classes.svg} />
                    </IconButton>

                    <IconButton>
                        <Face className={classes.svg} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default FormLogin
