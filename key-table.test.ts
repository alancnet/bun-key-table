import { expect, test } from 'bun:test'
import KeyTable from './key-table'

test('KeyTable', () => {
    const table = new KeyTable<number>()
 
    table.set('reality', 1)
    table.set('realtor', 2)
    table.set('realtors', 3)
    table.set('ranger', 4)
    table.set('foo', 5)
     
    expect(table.get('reality')).toBe(1)
    expect(table.get('realtor')).toBe(2)
    expect(table.get('realtors')).toBe(3)
    expect(table.get('ranger')).toBe(4)
    expect(table.get('foo')).toBe(5)

    table.delete('realtor')

    expect(Array.from(table.getKeys(''))).toEqual([
        'reality',
        'realtors',
        'ranger',
        'foo'
    ])

    table.delete('reality')
    table.delete('realtors')
    table.delete('ranger')
})