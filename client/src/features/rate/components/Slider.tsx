import { Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Empty } from 'antd'
import { Rate } from 'models'
import { useState } from 'react'
import { CardItem } from '.'

interface Props {
    listRate: Rate[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .title': {
            width: '100%',
            textAlign: 'center',
        }
    },
    controls: {
        marginTop: 0,
        display: 'flex',
        width: '%100',
        justifyContent: 'center',

        "& .btn": {
            width: 45,
            height: 30,
            cursor: 'pointer',

            "&:nth-child(1)": {
                marginRight: 16,

                "&:hover .btnLeft": {
                    transform: 'rotate(180deg) translateX(3px)'
                },
            },

            "&:nth-child(2)": {
                "&:hover .btnRight": {
                    transform: 'translateX(3px)'
                },
            },

            "& .arrow": {
                height: 2,
                width: 40,
                background: 'black',
                display: 'inline-block',
                position: 'relative',
                transition: '300ms transform',

                "&::after, &::before": {
                    content: '""',
                    position: 'absolute',
                    bottom: -0.5,
                    right: 0,
                    height: 'inherit',
                    width: 12,
                    background: 'inherit',
                    transform: 'rotate(45deg)',
                    transformOrigin: 'right center',
                },

                "&::after": {
                    transform: 'rotate(-45deg)',
                    bottom: 'unset',
                    top: -0.5
                },

                "&.btnLeft": {
                    transform: 'rotate(180deg)',
                }
            }
        },
    },
    wrapper: {
        width: '100%',
        marginTop: 80,

        '& .slider': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            height: 400,
            overFlow: 'hidden'
        }
    }
}))

export const Slider = ({ listRate }: Props) => {
    const classes = useStyles()
    const [currentIndex, setCurrentIndex] = useState({ index: 0, direction: 'dnext' })

    const nextSlider = () => {
        setCurrentIndex(old => {
            if (old.index === listRate.length - 1)
                return { index: 0, direction: 'dnext' }
            return { index: old.index + 1, direction: 'dnext' }
        })
    }

    const prevSlider = () => {
        setCurrentIndex(old => {
            if (old.index === 0)
                return { index: listRate.length - 1, direction: 'dprev' }
            return { index: old.index - 1, direction: 'dprev' }
        })
    }

    return (
        <Box className={classes.root}>
            {listRate.length > 3 && <Box className={classes.controls}>
                <div className='btn' onClick={prevSlider}>
                    <span className="btnLeft arrow"></span>
                </div>

                <div className='btn' onClick={nextSlider}>
                    <span className="btnRight arrow"></span>
                </div>
            </Box>}

            <Box className={classes.wrapper}>
                {listRate.length === 0 ?
                    <Box>
                        <Empty description='Nhà trọ hiện không có đánh giá'></Empty>
                    </Box>

                    : <Box className='slider'>
                        {listRate.map((rate, index) => {
                            const position = currentIndex.index
                            const direction = currentIndex.direction
                            let classCard = ''

                            if (listRate.length > 3) {
                                const next = position === listRate.length - 1 ? 0 : position + 1
                                const prev = position === 0 ? listRate.length - 1 : position - 1
                                const nNext = direction === 'dprev' ? next === listRate.length - 1 ? 0 : next + 1 : -1
                                const pPrev = direction === 'dnext' ? prev === 0 ? listRate.length - 1 : prev - 1 : -1

                                classCard = index === position ? 'active' : index === next
                                    ? 'next' : index === prev ? 'prev' : index === nNext && direction === 'dprev'
                                        ? 'nNext' : index === pPrev && direction === 'dnext' ? 'pPrev' : ''

                                classCard = `${classCard} ${direction}`
                            } else {
                                if (listRate.length === 3) {
                                    classCard = index === 0 ? 'pPrev' : index === 1 ? 'prev' : 'active'
                                    classCard = `${classCard} dnext`
                                } else {
                                    classCard = 'singular'
                                }
                            }

                            return <CardItem className={classCard} dataRate={rate} />
                        })}
                    </Box>}
            </Box>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Box>
    )
}
