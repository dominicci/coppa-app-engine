const { get, elems, modify, find, defaults } = require('partial.lenses')

// attachHours :: Hours -> String[] -> Hours
const attachHours = (hours, week) => week.reduce((acc, day) => {
    acc[day] = get([day], hours)
    return acc
},{})

// sortWeekdays :: Store -> String[] -> Store
const sortWeekdays = (store, week) => ({...store, hours: attachHours(store.hours, week)})

// findStockById :: Store -> Inventory -> Number
const findStockById = store => get([find(x => x.locationId === store.id), 'stockQty', defaults(0)])

// appendQty :: Inventory -> Store[] -> Store[]
const appendQty = stocks => stores =>
  modify(elems, store => ({ ...store, stockQty: findStockById(store)(stocks) }))(stores)

module.exports = {
    findStockById,
    appendQty,
    sortWeekdays,
    attachHours,
}