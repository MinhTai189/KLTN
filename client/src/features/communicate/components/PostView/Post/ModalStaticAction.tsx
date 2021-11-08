import { Box, Theme, Typography, Button, Divider } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { Modal } from "components/Common"
import { useAction } from "hooks"
import { BodyModalStacticAction } from "./BodyModalStacticAction"

interface Props {
    open: boolean
    onCancel: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .top': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            '& .tabs': {
                display: 'flex',
                alignItems: 'center',
                margin: 0,
                transition: '100ms',

                '& .tab': {
                    marginRight: 6,

                    '&.active': {
                        borderBottom: `2px solid ${theme.palette.primary.main}`,

                        '& .label, & .counter': {
                            color: theme.palette.primary.main
                        }
                    },

                    '& .btn-tab': {
                        padding: theme.spacing(0, 0.2),
                        minWidth: 'unset',
                        textTransform: 'initial',

                        '& .tab-icon': {
                            width: 14,
                            height: 14,
                            marginRight: 4
                        },

                        '& .label': {
                            fontSize: '0.8em',
                            marginRight: 4
                        },

                        '& .counter': {
                            fontSize: '0.9em',
                            fontWeight: 500
                        },
                    }
                }
            },

            '& .btn-close': {
                width: '1.3em',
                height: '1.3em',
                padding: 'unset',
                minWidth: 'unset',

                '& svg': {
                    width: '80%',
                    height: '80%',
                }
            }
        }
    },
}))

export const ModalStaticAction = ({ open, onCancel }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    return (
        <Modal
            open={open}
            onCancel={onCancel}
        >
            <Box className={classes.root}>
                <Box className='top'>
                    <ul className="tabs">
                        <li className="tab active">
                            <Button className="btn-tab">
                                <Typography className='label'>
                                    Tất cả
                                </Typography>

                                <Typography className='counter'>
                                    12
                                </Typography>
                            </Button>
                        </li>

                        {listAction.map((action, index) => {

                            return (
                                <li className="tab">
                                    <Button
                                        className='btn-tab'
                                    >
                                        <img
                                            src={action.png}
                                            alt="icon"
                                            className='tab-icon'
                                        />

                                        <Typography className='counter'>
                                            88
                                        </Typography>
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>

                    <Button
                        className='btn-close'
                        size='small'
                        onClick={onCancel}
                    >
                        <Close className='icon' />
                    </Button>
                </Box>

                <Divider style={{ marginTop: 12 }} />

                <Box mt={1}>
                    <BodyModalStacticAction />
                </Box>
            </Box>
        </Modal>
    )
}
