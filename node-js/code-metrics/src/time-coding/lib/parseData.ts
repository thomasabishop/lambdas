export interface ISummary {
    grand_total: {
        decimal: string
    }
    range: {
        text: string
    }
}

interface IDataSubset {
    data: ISummary[]
}

interface ITimeCoding {
    date: string
    duration: string
}

const parseData = (data: IDataSubset): ITimeCoding[] => {
    return data?.data.map((entry: ISummary) => ({
        date: entry?.range?.text,
        duration: entry?.grand_total?.decimal,
    }))
}

export { parseData }
