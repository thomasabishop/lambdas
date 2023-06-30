export interface TWakatimeStatusbar {
    cached_at: string
    data: Data
    has_team_features: boolean
}

export interface Data {
    grand_total: GrandTotal
    range: Range
    projects: Project[]
    languages: Language[]
    dependencies: any[]
    machines: Machine[]
    editors: Editor[]
    operating_systems: OperatingSystem[]
    categories: Category[]
}

export interface GrandTotal {
    hours: number
    minutes: number
    total_seconds: number
    digital: string
    decimal: string
    text: string
}

export interface Range {
    start: string
    end: string
    date: string
    text: string
    timezone: string
}

export interface Project {
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
