// key as hostname, value as list of excluded query
const exception = new Map<string, string[]>()

exception.set('youtube.com', ['v'])

export default exception
