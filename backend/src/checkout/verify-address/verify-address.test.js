const { verifyParams, isShippingAvailable, getParams, filterResponse } = require('./verify-address')

describe('verify-address.io.js', () => {
  describe('verifyParams', () => {
    it('should pass if country is CA', () => {
      expect(
        verifyParams('CA')
      ).toEqual(true)
    })

    it('should pass if country is US', () => {
      expect(
        verifyParams('US')
      ).toEqual(true)
    })

    it('should reject if country is not US nor CA', () => {
      expect(
        verifyParams('CN')
      ).toEqual(false)
    })
  })

  describe('getParams', () => {
    it('should return only the required parameters', () => {
      expect(
        getParams({
          addressOne: '5540 Ferrier St',
          city: 'Mount Royal',
          state: 'QC',
          zipcode: 'H4P1M2',
          country: 'CA',
        })
      ).toEqual({
        'LicenseInfo.RegisteredUser.UserID': process.env.INFORMATICA_STRIKEIRON_USERID,
        'LicenseInfo.RegisteredUser.Password': process.env.INFORMATICA_STRIKEIRON_PASSWORD,
        'NorthAmericanAddressVerification.AddressLine1': '5540 Ferrier St',
        'NorthAmericanAddressVerification.Casing': 'PROPER',
        'NorthAmericanAddressVerification.CityStateOrProvinceZIPOrPostalCode': 'Mount Royal QC H4P1M2',
        'NorthAmericanAddressVerification.Country': 'CA',
        format: 'JSON',
      })
    })

    it('should return only the all parameters', () => {
      expect(
        getParams({
          addressOne: '5540 Ferrier St',
          addressTwo: 'suite 1',
          company: 'Groupe Dynamite',
          city: 'Mount Royal',
          state: 'QC',
          zipcode: 'H4P1M2',
          country: 'CA',
        })
      ).toEqual({
        'LicenseInfo.RegisteredUser.UserID': process.env.INFORMATICA_STRIKEIRON_USERID,
        'LicenseInfo.RegisteredUser.Password': process.env.INFORMATICA_STRIKEIRON_PASSWORD,
        'NorthAmericanAddressVerification.AddressLine1': '5540 Ferrier St',
        'NorthAmericanAddressVerification.Casing': 'PROPER',
        'NorthAmericanAddressVerification.AddressLine2': 'suite 1',
        'NorthAmericanAddressVerification.CityStateOrProvinceZIPOrPostalCode': 'Mount Royal QC H4P1M2',
        'NorthAmericanAddressVerification.Country': 'CA',
        'NorthAmericanAddressVerification.Firm': 'Groupe Dynamite',
        format: 'JSON',
      })
    })
  })
  describe('filterResponse', () => {
    it('should return only the result', () => {
      expect(
        filterResponse({
          data: {
            WebServiceResponse: {
              '@xmlns': 'http://ws.strikeiron.com',
              SubscriptionInfo: {
                '@xmlns': 'http://ws.strikeiron.com',
                LicenseStatusCode: '0',
                LicenseStatus: 'Valid license key',
                LicenseActionCode: '0',
                LicenseAction: 'Decremented hit count',
                RemainingHits: '861883',
                Amount: '0',
              },
              NorthAmericanAddressVerificationResponse: {
                '@xmlns': 'http://www.strikeiron.com',
                NorthAmericanAddressVerificationResult: {
                  ServiceStatus: {
                    StatusNbr: '200',
                    StatusDescription: 'Found',
                  },
                  ServiceResult: {
                    CanadaAddress: {
                      AddressLine1: '5592 FERRIER ST',
                      AddressLine2: null,
                      StreetNumber: '5592',
                      Firm: 'GROUPE DYNAMITE',
                      PreDirection: null,
                      StreetName: 'FERRIER',
                      StreetType: 'ST',
                      PostDirection: null,
                      Extension: null,
                      ExtensionNumber: null,
                      Village: null,
                      City: 'MONT-ROYAL',
                      AddressStatus: 'VALID',
                      PostalCode: 'H4P 1M2',
                      Province: 'QC',
                      CivicNumber: '5592',
                      CivicSuffix: null,
                      DeliveryModeType: null,
                      DeliveryModeNumber: null,
                      DeliveryInstallationArea: null,
                      DeliveryInstallationType: null,
                      DeliveryInstallationQualifier: null,
                      GeoCode: {
                        Latitude: '45.494126',
                        Longitude: '-73.661547',
                      },
                    },
                  },
                },
              },
            },
          },
        })
      ).toEqual({
        ServiceStatus: {
          StatusNbr: '200',
          StatusDescription: 'Found',
        },
        ServiceResult: {
          CanadaAddress: {
            AddressLine1: '5592 FERRIER ST',
            AddressLine2: null,
            StreetNumber: '5592',
            Firm: 'GROUPE DYNAMITE',
            PreDirection: null,
            StreetName: 'FERRIER',
            StreetType: 'ST',
            PostDirection: null,
            Extension: null,
            ExtensionNumber: null,
            Village: null,
            City: 'MONT-ROYAL',
            AddressStatus: 'VALID',
            PostalCode: 'H4P 1M2',
            Province: 'QC',
            CivicNumber: '5592',
            CivicSuffix: null,
            DeliveryModeType: null,
            DeliveryModeNumber: null,
            DeliveryInstallationArea: null,
            DeliveryInstallationType: null,
            DeliveryInstallationQualifier: null,
            GeoCode: {
              Latitude: '45.494126',
              Longitude: '-73.661547',
            },
          },
        },
      })
    })
    it('should return unexpected result', () => {
      expect(filterResponse({ data: { error: 'some error message' } })).toEqual({
        data: { error: 'some error message' },
        error: 'Unexpected API Response',
      })
    })
  })

  describe('isShippingAvailable', () => {
    it('should return shipping unavailable', () => {
      expect(
        isShippingAvailable({
          ServiceStatus: {
            StatusNbr: '200',
            StatusDescription: 'found',
          },
          ServiceResult: {
            USAddress: {
              AddressLine1: '820 Calle Jose Marti',
              AddressLine2: null,
              StreetNumber: '820',
              Firm: null,
              PreDirection: null,
              StreetName: 'Calle Jose Marti',
              StreetType: null,
              PostDirection: null,
              Extension: null,
              ExtensionNumber: null,
              Village: null,
              City: 'San Juan',
              AddressStatus: 'Valid',
              State: 'PR',
              Urbanization: null,
              ZIPPlus4: '00907',
              ZIPCode: '00907',
              ZIPAddOn: null,
              CarrierRoute: 'C004',
              PMB: null,
              PMBDesignator: null,
              DeliveryPoint: null,
              DPCheckDigit: null,
              LACS: null,
              CMRA: null,
              DPV: 'N',
              DPVFootnote: 'AA M3',
              RDI: null,
              RecordType: null,
              CongressDistrict: 'AL',
              County: 'San Juan',
              CountyNumber: '127',
              StateNumber: '72',
              GeoCode: {
                Latitude: '0',
                Longitude: '0',
                CensusTract: '001900',
                StateNumber: '72',
                CountyNumber: '127',
                BlockNumber: '3005',
                BlockGroup: '721270019003',
              },
            },
          }
        })
      ).toEqual(
        {
            "StatusNbr": "200",
            "StatusDescription": "found",
            "ShippingStatus": "Shipping unavailable"
        }
      )
    })
    it('should return verfied address where shipping is available', () => {
      expect(
        isShippingAvailable({
          ServiceStatus: {
            StatusNbr: '200',
            StatusDescription: 'found',
          },
          ServiceResult: {
            USAddress: {
              AddressLine1: '820 Calle Jose Marti',
              AddressLine2: null,
              StreetNumber: '820',
              Firm: null,
              PreDirection: null,
              StreetName: 'Calle Jose Marti',
              StreetType: null,
              PostDirection: null,
              Extension: null,
              ExtensionNumber: null,
              Village: null,
              City: 'San Juan',
              AddressStatus: 'Valid',
              State: 'PA',
              Urbanization: null,
              ZIPPlus4: '00907',
              ZIPCode: '00907',
              ZIPAddOn: null,
              CarrierRoute: 'C004',
              PMB: null,
              PMBDesignator: null,
              DeliveryPoint: null,
              DPCheckDigit: null,
              LACS: null,
              CMRA: null,
              DPV: 'N',
              DPVFootnote: 'AA M3',
              RDI: null,
              RecordType: null,
              CongressDistrict: 'AL',
              County: 'San Juan',
              CountyNumber: '127',
              StateNumber: '72',
              GeoCode: {
                Latitude: '0',
                Longitude: '0',
                CensusTract: '001900',
                StateNumber: '72',
                CountyNumber: '127',
                BlockNumber: '3005',
                BlockGroup: '721270019003',
              },
            },
          }
        })
      ).toEqual(
        {
          ServiceStatus: {
            StatusNbr: '200',
            StatusDescription: 'found',
          },
          ServiceResult: {
            USAddress: {
              AddressLine1: '820 Calle Jose Marti',
              AddressLine2: null,
              StreetNumber: '820',
              Firm: null,
              PreDirection: null,
              StreetName: 'Calle Jose Marti',
              StreetType: null,
              PostDirection: null,
              Extension: null,
              ExtensionNumber: null,
              Village: null,
              City: 'San Juan',
              AddressStatus: 'Valid',
              State: 'PA',
              Urbanization: null,
              ZIPPlus4: '00907',
              ZIPCode: '00907',
              ZIPAddOn: null,
              CarrierRoute: 'C004',
              PMB: null,
              PMBDesignator: null,
              DeliveryPoint: null,
              DPCheckDigit: null,
              LACS: null,
              CMRA: null,
              DPV: 'N',
              DPVFootnote: 'AA M3',
              RDI: null,
              RecordType: null,
              CongressDistrict: 'AL',
              County: 'San Juan',
              CountyNumber: '127',
              StateNumber: '72',
              GeoCode: {
                Latitude: '0',
                Longitude: '0',
                CensusTract: '001900',
                StateNumber: '72',
                CountyNumber: '127',
                BlockNumber: '3005',
                BlockGroup: '721270019003',
              },
            },
          }
        }
      )
    })
  })
})
