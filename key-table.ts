const Value = Symbol('Value')

type KeyData<T> = {
    [Value]?: T
    [key: string]: KeyData<T>
}

export default class KeyTable<T> {
    private data: KeyData<T> = {}
    set(key: string, value: T) {
        const loop = (o: KeyData<T>, sub: string): T => {
            if (sub.length === 0) {
                return o[Value] = value
            }
            const c = sub[0]
            if (o.hasOwnProperty(c)) {
                return loop(o[c] as KeyData<T>, sub.substring(1))
            }

            for (const sub2 in o) {
                const match = matchStart(sub, sub2)
                if (match) {
                    if (match < sub2.length) {
                        const next = {
                            [sub2.substring(match)]: o[sub2],
                        }
                        o[sub2.substring(0, match)] = next
                        delete o[sub2]
                        return loop(next, sub.substring(match))
                    } else {
                        return loop(o[sub2] as KeyData<T>, sub.substring(match))
                    }
                }
            }
            o[sub] = {
                [Value]: value
            }
            return value
        }
        return loop(this.data, key)
    }
    get(key: string): T | undefined {
        const loop = (o: KeyData<T>, sub: string): T | undefined => {
            if (sub.length === 0) {
                return o[Value]
            }
            const c = sub[0]
            if (o.hasOwnProperty(c)) {
                return loop(o[c], sub.substring(1))
            }
            // Find key matching first character
            for (const sub2 in o) {
                let match = matchStart(sub, sub2)
                if (match) {
                    return loop(o[sub2], sub.substring(match))
                }
            }
            return undefined
        }
        return loop(this.data, `${key}`)
    }
    delete(key: string): boolean {
        const loop = (o: KeyData<T>, sub: string): boolean => {
            if (sub.length === 0) {
                if (o[Value] !== undefined) {
                    delete o[Value]
                    return true
                }
                return false
            }
            const c = sub[0]
            if (o.hasOwnProperty(c)) {
                const child = o[c]
                const ret = loop(child, sub.substring(1))
                if (ret && isEmpty(child)) {
                    delete o[c]
                }
                return ret
            }

            for (const sub2 in o) {
                let match = matchStart(sub, sub2)
                if (match) {
                    const child = o[sub2]
                    const ret = loop(child, sub.substring(match))
                    if (ret && isEmpty(child)) {
                        delete o[sub2]
                    }
                    return ret
                }
            }
            return false
        }
        return loop(this.data, `${key}`)
    }
    get length() {
        let count = 0
        for (let key of this.getKeys()) {
            count++
        }
        return count
    }
    get keys() {
        return this.getKeys()
    }
    * getKeys(prefix = '') {
        function * walk(o: KeyData<T>, sub: string, key: string): IterableIterator<string> {
            if (o[Value] !== undefined && sub === '') {
                yield key
            }
            for (const sub2 in o) {
                if (sub === '') {
                    yield * walk(o[sub2], '', key + sub2)
                } else {
                    const match = matchStart(sub, sub2)
                    if (match) {
                        yield * walk(o[sub2], sub.substring(match), key + sub2)
                    }
                }
            }

        }
        yield * walk(this.data, prefix, '')
    }
}

function isEmpty<T>(o: KeyData<T>): boolean {
    if (o.hasOwnProperty(Value)) {
        return false
    }
    for (const key in o) {
        return false
    }
    return true
}

function matchStart (s1: string, s2: string): number  {
    const l = Math.max(s1.length, s2.length)
    for (let i = 0; i < l; i++) {
        if (s1[i] !== s2[i]) return i
    }
    return l
}
