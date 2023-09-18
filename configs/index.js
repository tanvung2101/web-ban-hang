function Config() {
    if (window === undefined) return null
    return Config = { ...window._CONFIG }

}
export default Config