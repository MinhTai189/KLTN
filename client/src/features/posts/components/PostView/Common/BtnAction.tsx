import { Box, Button, makeStyles } from '@material-ui/core'
import { FavoriteTwoTone } from '@material-ui/icons'
import { useAction } from 'hooks'
import { Actions } from './Actions'

interface Props {
    sizeBtn?: 'large' | 'medium' | 'small'
    positionAction?: 'left' | 'right'
    sizeAction?: 'small' | 'large'
    isLike: boolean
    type: number
    handleLike: (type: number, isClickBtn?: boolean) => void
}

const useStyles = makeStyles({
    root: {
        position: 'relative',

        '& .btn-action': {
            '& div': {
                width: 20,
                height: 20,
                display: 'grid',
                placeItems: 'center',

                '& svg': {
                    width: '100%',
                    height: '100%',
                }
            },
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

export const BtnAction = ({ sizeBtn = 'medium', positionAction = 'right', sizeAction = 'large', isLike, type, handleLike }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    return (
        <Box
            className={classes.root}
            component='span'
        >
            <Button
                className='btn btn-action'
                startIcon={isLike ? listAction[type].icon : <FavoriteTwoTone />}
                size={sizeBtn}
                style={{
                    color: isLike ? listAction[type].color : ''
                }}
                onClick={() => handleLike(0, true)}
            >
                {isLike ? listAction[type].label : 'Thích'}
            </Button>

            <Box
                className={`action-wrapper ${sizeBtn}`}
                style={{
                    right: positionAction === 'left' ? 0 : 'unset',
                    left: positionAction === 'right' ? 0 : 'unset',
                    bottom: sizeAction === 'large' ? '150%' : '100%'
                }}
            >
                <Actions
                    size={sizeAction}
                    handleLike={handleLike}
                />
            </Box>
        </Box>
    )
}
