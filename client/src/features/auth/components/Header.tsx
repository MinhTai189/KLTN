import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 55,
        height: 55,
        display: 'grid',
        placeItems: 'center',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '50%',
        marginBottom: theme.spacing(1)
    }
}))

interface Props {
    icon: any;
    textBtn: string
}

function Header({ textBtn, icon }: Props) {
    const classes = useStyles();

    return (
        <Box className={classes.root} width="100%" mb={3}>
            <span className={classes.icon}>
                {icon}
            </span>
            <Typography variant="h6">
                {textBtn}
            </Typography>
        </Box>
    )
}

export default Header
