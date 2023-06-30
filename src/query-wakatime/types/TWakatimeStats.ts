export interface TWakatimeStats {
    data: Data
}

export interface Data {
    id: string
    user_id: string
    range: string
    start: string
    end: string
    timeout: number
    writes_only: boolean
    timezone: string
    holidays: number
    status: string
    created_at: string
    modified_at: string
    best_day: BestDay
    daily_average: number
    is_already_updating: boolean
    days_minus_holidays: number
    categories: Category[]
    human_readable_daily_average: string
    is_stuck: boolean
    human_readable_total: string
    is_up_to_date: boolean
    dependencies: Dependency[]
    operating_systems: OperatingSystem[]
    percent_calculated: number
    total_seconds_including_other_language: number
    total_seconds: number
    is_up_to_date_pending_future: boolean
    human_readable_total_including_other_language: string
    editors: Editor[]
    days_including_holidays: number
    machines: Machine[]
    languages: Language[]
    daily_average_including_other_language: number
    projects: Project[]
    human_readable_daily_average_including_other_language: string
    username: string
    is_including_today: boolean
    human_readable_range: string
    is_coding_activity_visible: boolean
    is_other_usage_visible: boolean
}

export interface BestDay {
    id: string
    date: string
    total_seconds: number
    created_at: string
    modified_at: string
    text: string
}

export interface Category {
    name: string
    total_seconds: number
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface Dependency {
    total_seconds: number
    name: string
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface OperatingSystem {
    total_seconds: number
    name: string
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface Editor {
    total_seconds: number
    name: string
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface Machine {
    total_seconds: number
    name: string
    machine_name_id: string
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface Language {
    name: string
    total_seconds: number
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}

export interface Project {
    total_seconds: number
    name: string
    percent: number
    digital: string
    decimal: string
    text: string
    hours: number
    minutes: number
}
