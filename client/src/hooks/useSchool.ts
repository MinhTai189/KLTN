import schoolApi from "api/school"
import { FieldOption, ListResponse, School } from "models"
import { useEffect, useState } from "react"

export const useSchool = () => {
    const [optionsSchool, setOptionsSchool] = useState<Array<School>>([])
    const [autoCompSchool, setAutoCompSchool] = useState<Array<FieldOption>>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        schoolApi.getAll()
            .then((response: ListResponse<School>) => {
                const data = response.data

                const autoComp = data.map(e => ({
                    value: e.codeName,
                    label: e.name
                }))

                setOptionsSchool(data)
                setAutoCompSchool(autoComp)
                setLoading(false)
            })
            .catch((err: any) => {
                console.log("Khong the lay du lieu Schools", err.message)
                setLoading(false)
            })
    }, [])

    return { optionsSchool, loading, autoCompSchool }
}
