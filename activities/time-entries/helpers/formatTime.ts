const formatTime = (seconds: number) => {
    const hours = seconds / 3600
    return hours.toFixed(2)
}

export { formatTime }
