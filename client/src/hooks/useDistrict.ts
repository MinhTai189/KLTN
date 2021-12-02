import districtApi from "api/district"
import { District, FieldOption, ListResponse } from "models"
import { useEffect, useState } from "react"

export const useDistrict = () => {
    const [optionsDistrict, setOptionsDistrict] = useState<Array<District>>([])
    const [autoCompDistrict, setAutoCompDistrict] = useState<Array<FieldOption>>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        districtApi.getAll()
            .then((response: ListResponse<District>) => {
                const data = response.data

                const autoComp = data.map(e => ({
                    value: e.codeName,
                    label: e.name
                }))

                setOptionsDistrict(data)
                setAutoCompDistrict(autoComp)
                setLoading(false)
            })
            .catch((err: any) => {
                console.log("Khong the lay du lieu Districts", err.message)
                setLoading(false)
            })
    }, [])

    return { optionsDistrict, loading, autoCompDistrict }
}
