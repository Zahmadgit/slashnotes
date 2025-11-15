import { openDB } from 'idb'

const notesDatabasePromise = openDB('notesdatabase', undefined, {
  upgrade(db) {
    db.createObjectStore('keyval')
  }
})

export async function get(key) {
  return (await notesDatabasePromise).get('keyval', key)
}
//this is gonna be annoying also handling updating...
export async function set(key, val) {
  return (await notesDatabasePromise).put('keyval', val, key)
}

export async function del(key) {
  return (await notesDatabasePromise).delete('keyval', key)
}

export async function clear() {
  return (await notesDatabasePromise).clear('keyval')
}

export async function keys() {
  return (await notesDatabasePromise).getAllKeys('keyval')
}

export async function getAllKeys() {
  return (await notesDatabasePromise).getAllKeys('keyval')
}
