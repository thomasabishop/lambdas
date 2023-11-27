export interface TWakatimeSummaries {
    data: Summary[]
    start: string
    end: string
    cumulative_total: CumulativeTotal
    daily_average: DailyAverage
}

export interface Summary {
    languages: Language[]
    grand_total: GrandTotal
    editors: Editor[]
    operating_systems: OperatingSystem[]
    categories: Category[]
    dependencies: Dependency[]
    machines: Machine[]
    projects: Project[]
    range: Range
}

export interface Language {
    name: string
    total_seconds: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface GrandTotal {
    hours: number
    minutes: number
    total_seconds: number
    digital: string
    decimal: string
    text: string
}

export interface Editor {
    name: string
    total_seconds: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface OperatingSystem {
    name: string
    total_seconds: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface Category {
    name: string
    total_seconds: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface Dependency {
    name: string
    total_seconds: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface Machine {
    name: string
    total_seconds: number
    machine_name_id: string
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface Project {
    name: string
    total_seconds: number
    color: any
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
    seconds: number
    percent: number
}

export interface Range {
    start: string
    end: string
    date: string
    text: string
    timezone: string
}

export interface CumulativeTotal {
    seconds: number
    text: string
    digital: string
    decimal: string
}

export interface DailyAverage {
    holidays: number
    days_minus_holidays: number
    days_including_holidays: number
    seconds: number
    seconds_including_other_language: number
    text: string
    text_including_other_language: string
}
