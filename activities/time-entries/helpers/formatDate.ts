const formatDate = (date: Date | string | number) => {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export { formatDate }
