const { attachHours, sortWeekdays, appendQty } = require('./get-store-locations')

const weekdays = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun'
]

const unsortedOpeningHours = {
    'tue': {
      open: '10:00',
      close: '12:00'
    },
    'fri': {
      open: '13:00',
      close: '12:00'
    },
    'wed': {
      open: '11:00',
      close: '12:00'
    },
    'mon': {
      open: '9:00',
      close: '12:00'
    },
    'thu': {
      open: '12:00',
      close: '12:00'
    },
    'sun': {
      open: '15:00',
      close: '12:00'
    },
    'sat': {
      open: '14:00',
      close: '12:00'
    }
}

const fixture = [
    {
        "distance": 3.5216850164926097,
        "faxNumber": null,
        "hours": {
            "thu": {
                "close": "21:00",
                "open": "10:00"
            },
            "sun": {
                "close": "17:00",
                "open": "10:00"
            },
            "sat": {
                "close": "17:00",
                "open": "09:00"
            },
            "fri": {
                "open": "10:00",
                "close": "21:00"
            },
            "tue": {
                "close": "18:00",
                "open": "10:00"
            },
            "wed": {
                "close": "18:00",
                "open": "10:00"
            },
            "mon": {
                "open": "10:00",
                "close": "18:00"
            }
        },
        "shipToStore": "false",
        "storeName": "CNCG-MARCHE CENTRAL,MONTREAL,QC",
        "country": "CA",
        "mallName": "Marché Central",
        "chainName": "Garage",
        "latitude": "45.53388",
        "chain": "2000",
        "minTransitTime": "1",
        "storeType": "14",
        "ispEmailAddress": "mteam195@gdbuzz.com",
        "address1": "999 Rue du Marche Central",
        "phoneNumber": "514-388-2132",
        "city": "Montréal",
        "longitude": "-73.653077",
        "ispEligible": "true",
        "maxTransitTime": "2",
        "altPhoneNumber": null,
        "postalCode": "H4N1J8",
        "message": "NA",
        "address2": "999 Rue du Marche Central",
        "state": "QC",
        "id": "195",
        "unit": "km"
    },
    {
        "distance": 3.6127265079180884,
        "faxNumber": null,
        "hours": {
            "fri": {
                "close": "21:00",
                "open": "10:00"
            },
            "tue": {
                "close": "18:00",
                "open": "10:00"
            },
            "wed": {
                "close": "18:00",
                "open": "10:00"
            },
            "mon": {
                "close": "18:00",
                "open": "10:00"
            },
            "thu": {
                "open": "10:00",
                "close": "21:00"
            },
            "sun": {
                "close": "17:00",
                "open": "10:00"
            },
            "sat": {
                "open": "09:00",
                "close": "17:00"
            }
        },
        "shipToStore": "true",
        "storeName": "CGZD-MARCHE CENTRAL,MONTREAL,QC",
        "country": "CA",
        "mallName": "Marché Central",
        "chainName": "Dynamite",
        "latitude": "45.53379059",
        "chain": "1000",
        "minTransitTime": "1",
        "storeType": "14",
        "ispEmailAddress": "mteam229@gdbuzz.com",
        "address1": "999 Rue du Marche Central - TEST 09132017",
        "phoneNumber": "514-388-2132",
        "city": "Montréal",
        "longitude": "-73.65427399",
        "ispEligible": "true",
        "maxTransitTime": "2",
        "altPhoneNumber": null,
        "postalCode": "H4N1J8",
        "message": "NA",
        "address2": "999 Rue du Marche Central - TEST 09132017",
        "state": "QC",
        "id": "229",
        "unit": "km"
    }
]

const unsortedStore =  {
    "distance": 3.5216850164926097,
    "shipToStore": "false",
    "storeName": "CNCG-MARCHE CENTRAL,MONTREAL,QC",
    "country": "CA",
    "mallName": "Marché Central",
    "chainName": "Garage",
    "latitude": "45.53388",
    "chain": "2000",
    "minTransitTime": "1",
    "storeType": "14",
    "ispEmailAddress": "mteam195@gdbuzz.com",
    "address1": "999 Rue du Marche Central",
    "phoneNumber": "514-388-2132",
    "city": "Montréal",
    "longitude": "-73.653077",
    "ispEligible": "true",
    "maxTransitTime": "2",
    "altPhoneNumber": null,
    "postalCode": "H4N1J8",
    "message": "NA",
    "address2": "999 Rue du Marche Central",
    "state": "QC",
    "id": "195",
    "faxNumber": null,
    "hours": {
        "tue": {
            "open": "10:00",
            "close": "18:00"
        },
        "sun": {
            "close": "18:00",
            "open": "10:00"
        },
        "wed": {
            "close": "18:00",
            "open": "10:00"
        },
        "fri": {
            "open": "10:00",
            "close": "21:00"
        },
        "mon": {
            "open": "10:00",
            "close": "21:00"
        },
        "thu": {
            "close": "17:00",
            "open": "09:00"
        },
        "sat": {
            "close": "17:00",
            "open": "10:00"
        }
    },
    "unit": "km"
}

const stockfixture = [
    {
        itemId: "0557999",
        stockQty: 4,
        availability: "AVAILABLE",
        locationId: "229"
    },
]

describe('get-store-locations', () => {

    describe('appendQty', () => {
        it('should append stock data to objects with matching id', () => {
            const data = appendQty(stockfixture)(fixture)
            expect(data[1].stockQty).toEqual(4)
        })

        it('should default stockQty to 0 for non matching ids', () => {
            const data = appendQty(stockfixture)(fixture)
            expect(data[0].stockQty).toEqual(0)
        })
    })

    describe('sortHours', () => {
        it('should attach the correct hours to the matching day', () => {
            const data = attachHours(unsortedOpeningHours, weekdays)
            expect(data).toEqual({
                mon: { open: '9:00', close: '12:00' },
                tue: { open: '10:00', close: '12:00' },
                wed: { open: '11:00', close: '12:00' },
                thu: { open: '12:00', close: '12:00' },
                fri: { open: '13:00', close: '12:00' },
                sat: { open: '14:00', close: '12:00' },
                sun: { open: '15:00', close: '12:00' }
            })
        })
    })

    describe('sortWeekdays', () => {
        it('should attach the sorted days to the store object', () => {
            const data = sortWeekdays(unsortedStore, weekdays)
            expect(data).toEqual({
                distance: 3.5216850164926097,
                shipToStore: 'false',
                storeName: 'CNCG-MARCHE CENTRAL,MONTREAL,QC',
                country: 'CA',
                mallName: 'Marché Central',
                chainName: 'Garage',
                latitude: '45.53388',
                chain: '2000',
                minTransitTime: '1',
                storeType: '14',
                ispEmailAddress: 'mteam195@gdbuzz.com',
                address1: '999 Rue du Marche Central',
                phoneNumber: '514-388-2132',
                city: 'Montréal',
                longitude: '-73.653077',
                ispEligible: 'true',
                maxTransitTime: '2',
                altPhoneNumber: null,
                postalCode: 'H4N1J8',
                message: 'NA',
                address2: '999 Rue du Marche Central',
                state: 'QC',
                id: '195',
                faxNumber: null,
                hours:
                 { mon: { open: '10:00', close: '21:00' },
                   tue: { open: '10:00', close: '18:00' },
                   wed: { close: '18:00', open: '10:00' },
                   thu: { close: '17:00', open: '09:00' },
                   fri: { open: '10:00', close: '21:00' },
                   sat: { close: '17:00', open: '10:00' },
                   sun: { close: '18:00', open: '10:00' } },
                unit: 'km'
            })
        })
    })
})
