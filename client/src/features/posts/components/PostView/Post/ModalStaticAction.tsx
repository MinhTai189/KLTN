import { Box, Theme, Typography, Button, Divider } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { Modal } from "components/Common"
import { useAction } from "hooks"
import { LikePost } from "models"
import { useMemo, useState } from "react"
import { BodyModalStacticAction } from "./BodyModalStacticAction"

interface Props {
    open: boolean
    onCancel: () => void
    staticLike: number[]
    totalQuantity: number
    listLike: LikePost[]
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

export const ModalStaticAction = ({ open, onCancel, staticLike, totalQuantity, listLike }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    const [currentTab, setCurrentTab] = useState(7)

    const currentListLike = useMemo(() => {
        if (currentTab === 7)
            return listLike

        return listLike.filter(like => like.type === currentTab)
    }, [currentTab, listLike])

    const handleClickTab = (tab: number) => {
        setCurrentTab(tab)
    }

    return (
        <Modal
            open={open}
            onCancel={onCancel}
        >
            <Box className={classes.root}>
                <Box className='top'>
                    <ul className="tabs">
                        <li
                            className={`tab ${currentTab === 7 ? 'active' : ''}`}
                            onClick={() => handleClickTab(7)}
                        >
                            <Button className="btn-tab">
                                <Typography className='label'>
                                    Tất cả
                                </Typography>

                                <Typography className='counter'>
                                    {totalQuantity}
                                </Typography>
                            </Button>
                        </li>

                        {listAction.map((action, index) => {
                            const quantity = staticLike[index]

                            if (quantity === 0) return null

                            return (
                                <li
                                    key={index}
                                    className={`tab ${currentTab === index ? 'active' : ''}`}
                                    onClick={() => handleClickTab(index)}
                                >
                                    <Button
                                        className='btn-tab'
                                    >
                                        <img
                                            src={action.png}
                                            alt="icon"
                                            className='tab-icon'
                                        />

                                        <Typography className='counter'>
                                            {quantity}
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
                    <BodyModalStacticAction
                        listLike={currentListLike}
                    />
                </Box>
            </Box>
        </Modal>
    )
}
