import { Box, IconButton, Theme, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { gsap } from 'gsap'
import { SchoolDropdown } from 'models'
import { useEffect, useRef, useState } from 'react'
import { numberToCurrency } from 'utils'
import { MotelRows, SchoolRows } from '.'
import { VariableSizeList as List } from 'react-window';

interface Props {
    openDropdown: boolean | undefined;
    isFlip: boolean | undefined;
    setIsFlip: (e: boolean | undefined) => void
    schoolList: Array<SchoolDropdown>
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        height: 0,
        opacity: 0,
        transform: 'translateY(-30px)',
        perspective: 500
    },
    box: {
        position: 'absolute',
        inset: 0,
        background: '#fff',
        border: `4px solid ${theme.palette.primary.main}`,
        padding: '4px 0',
        marginTop: 4,
        overflowX: 'hidden',
        overflowY: 'auto',
        perspective: 500,

        "&::-webkit-scrollbar": {
            width: 0
        }
    }, nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 20,
        paddingLeft: 8,
        paddingRight: 8,

        "& .MuiIconButton-root": {
            width: 20,
            height: 20,

            "& .MuiIconButton-label svg": {
                width: 17,
                height: 17
            }
        },

        "& .MuiTypography-root": {
            color: theme.palette.text.secondary,
            fontSize: 16
        }
    },
}))

export const DropDown = ({ openDropdown, isFlip, setIsFlip, schoolList }: Props) => {
    const classes = useStyles()
    const ref = useRef()
    const childRef = gsap.utils.selector(ref)

    const dropdownBox1 = useRef<any>()
    const flipBox1 = useRef<any>()
    const flipBox2 = useRef<any>()

    useEffect(() => {
        if (openDropdown === true) {
            dropdownBox1.current =
                gsap.timeline()
                    .fromTo(ref.current as any,
                        { opacity: 0, y: -30, height: 0, duration: 0 },
                        { opacity: 1, y: 0, height: 300, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
                    .fromTo(childRef(".rows"), { opacity: 0, rotateX: 105 }, { opacity: 1, rotateX: 0, duration: 0.5, ease: 'step(3)', stagger: 0.1 })
        } else if (openDropdown === false) {
            if (isFlip === true) {
                setIsFlip(undefined)
                flipBox1.current.reverse()
                flipBox2.current.reverse()
            }
            dropdownBox1.current.reverse()
        }
    }, [openDropdown])

    useEffect(() => {
        if (isFlip === true) {
            flipBox1.current = gsap.fromTo(childRef('.box1'), { rotateX: 0, opacity: 1, zIndex: 2 }, { rotateX: 180, opacity: 0, zIndex: 1, duration: 0.5 })
            flipBox2.current = gsap.fromTo(childRef('.box2'), { rotateX: 0, opacity: 90, zIndex: 1 }, { rotateX: 360, opacity: 1, zIndex: 2, duration: 0.5 })
        } else if (isFlip === false) {
            flipBox1.current.reverse()
            flipBox2.current.reverse()
        }
    }, [isFlip])

    const onClickRows = (codeName: string, school: string) => {
        console.log({ codeName, school });
        setIsFlip(true)
    }

    const onClickBack = () => {
        setIsFlip(false)
    }

    const Row = ({ index, style }: { index: number, style: any }) => {
        const imgUrls = schoolList[index].motels.map(motel => motel.thumbnail)
        const amountMotel = schoolList[index].motels.length
        const classFlip = index <= 7 ? 'rows' : ''

        return <SchoolRows
            styleRows={style}
            classFlip={classFlip}
            key={index}
            codeName={schoolList[index].codeName}
            imgUrls={imgUrls}
            onClickRows={onClickRows}
            school={schoolList[index].name}
            district={schoolList[index].district}
            amountMotel={amountMotel}
        />
    };


    return (
        <div className={classes.root} ref={ref as any}>
            <div className={`${classes.box} box2`}>
                <Box className={classes.nav}>
                    <IconButton onClick={onClickBack}>
                        <ArrowBack />
                    </IconButton>

                    <Typography>Danh sách nhà trọ</Typography>
                </Box>

                {new Array(4).fill(0).map(() => (
                    <MotelRows
                        thumbnail='https://i.imgur.com/rBjvLob.jpeg'
                        name='Nha tro Minh Tai'
                        addr='Than Cuu Nghia'
                        amount={12}
                        price={numberToCurrency.vi(12000000)}
                    />
                ))}
            </div>

            <div className={`${classes.box} box1`}>
                {/* <List
                    height={300}
                    itemCount={schoolList.length}
                    width={600}
                    itemSize={() => 100}
                >
                    {Row}
                </List> */}
            </div>
        </div>
    )
}
