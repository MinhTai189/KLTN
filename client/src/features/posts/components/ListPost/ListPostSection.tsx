import { Box, Grid } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { FIND_MOTEL_ID } from "contants/contants"
import ListPostContext from "features/posts/contexts/ListPostContext"
import { postAction, selectFilterPost } from "features/posts/postSlice"
import { useEffect, useState } from "react"
import { ListPost } from "./ListPost"
import { ListThread } from "./ListThread"

export const ListPostSection = () => {
    const dispatch = useAppDispatch()
    const postFilter = useAppSelector(selectFilterPost)
    const [currentSelectedThread, setCurrentSelectedThread] = useState(FIND_MOTEL_ID)

    useEffect(() => {
        dispatch(postAction.get({
            ...postFilter,
            _subject: currentSelectedThread
        }))
    }, [currentSelectedThread, postFilter])

    return (
        <ListPostContext.Provider value={{
            currentSelectedThread,
            setCurrentSelectedThread
        }}>
            <Box component='section'>
                <Grid container>
                    <Grid item md={2}>
                        <ListThread />
                    </Grid>

                    <Grid item md={8}>
                        <ListPost />
                    </Grid>

                    <Grid item md={2}></Grid>
                </Grid>
            </Box>
        </ListPostContext.Provider>
    )
}

ListPostContext.displayName = 'ListPostProvider'
