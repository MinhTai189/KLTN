import { Box, makeStyles, Button } from '@material-ui/core'
import { ReactElement } from 'react'
import { Actions } from './Actions'

interface Props {
    icon?: ReactElement
    sizeBtn?: 'large' | 'medium' | 'small'
    positionAction?: 'left' | 'right'
    sizeAction?: 'small' | 'large'
}

const useStyles = makeStyles({
    root: {
        position: 'relative',

        '& .btn-action': {
            '& svg': {
                width: 20,
                height: 20,
            }
        },

        '&:hover .action-wrapper': {
            transform: 'scale(1)',
            opacicy: 1,
        },

        '& .action-wrapper': {
            position: 'absolute',
            bottom: '150%',
            zIndex: 88,
            transform: 'scale(0)',
            opacicy: 0,
            transformOrigin: 'center bottom',
            transition: '200ms'
        },
    }
})

export const BtnAction = ({ icon, sizeBtn = 'medium', positionAction = 'right', sizeAction = 'large' }: Props) => {
    const classes = useStyles()

    return (
        <Box
            className={classes.root}
            component='span'
        >
            <Button
                className='btn btn-action'
                startIcon={icon}
                size={sizeBtn}
            >
                Thích
            </Button>

            <Box
                className={`action-wrapper ${sizeBtn}`}
                style={{
                    right: positionAction === 'left' ? 0 : 'unset',
                    left: positionAction === 'right' ? 0 : 'unset',
                    bottom: sizeAction === 'large' ? '150%' : '100%'
                }}
            >
                <Actions size={sizeAction} />
            </Box>
        </Box>
    )
}
