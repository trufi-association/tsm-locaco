# Trufi Server Module: Locaco 

This is a trufi server module (tsm) for the app "Trufi Versal" which queries it for the right user location dependent configuration to use. It is compatible and adhering to the conventions in [trufi-server-modules](https://github.com/trufi-association/trufi-server-modules) so it can be seamlessly integrated in our backend structures.

## What is "Trufi Versal"?

if they want to bring our solution to their city. Normally people need to take our example code at [trufi-core](https://github.com/trufi-association/trufi-core) , modify it to match their needs e.g. change colours, logo, name, splashscreen, backend endpoint urls etc, compile and finally release it by themselves. This is feasible for developers but not for most people interested.

With Trufi Versal we are providing a solution to that problem. To be able to use Trufi Versal in your city you just need provide us with a json configuration file to upload to our server. At each start of the app on your phone that app will fetch the configuration to use dependent on your current location. The app will use that configuration to connect to the right backend endpoints which makes it work for your region.

So we basically took the burden from modifying, compiling and releasing the app to the app stores from you. **What you still have to do:** Buy/Rent a server, set up our [backend](https://github.com/trufi-association/trufi-server-modules) and provide us with the configuration for Trufi Versal.

## How does it work?

1. You buy/rent a server and set up our [backend](https://github.com/trufi-association/trufi-server-modules).
2. You create a configuration based on our [template.json](template.json) and remove all comments from it.
3. You send it to us and we upload it.
4. You do the marketing and point your users to our "Trufi Versal" app.
5. On each start of the app it sends the current location of the user to our server and returns back the configuration. Imagine you created the backend for Nouakchott and we uploaded your JSON configuration to our server. Users using the app in Nouakchott will receive your JSON configuration and the app will speak with your server to provide the user with the expected experience.

## Exposed APIs

### GET configuration for location

`/configuration/city` e.g. `https://example.com/configuration/city`

JSON example body request: 

```json
{
    "lat": 53.531,
    "lon": 9.90
}
```

The given coordinate needs to be in WSG64.

JSON example response:

```json
{
    "id": "Germany-Hamburg",
    "name": "Germany, Hamburg",
    "city": "Hamburg",
    "country": "Germany",
    "endpoint": {
        "mapBackground": "https://de-hamburg.api.trufi.app:8300/tileserver",
        "nominatim": "https://api.trufi.app/nominatim-germany/reverse",
        "opentripplannerGraphQL": "https://api.trufi.app/otp-hh/routers/default/index/graphql",
        "photon": "https://de-hamburg.api.trufi.app:8300/photon"
    },
    "mapConfiguration": {
        "mapCenter": {
            "lat": 53.551086,
            "lon": 9.993682
        }
    },
    "contact": {
        "email": "example@example.com",
        "feedbackUrl": "https://example.com/feedback",
        "shareAppUrl": "https://example.com/share",
        "socialmedia": {
            "facebook": "https://www.facebook.com/Example"
        }
    },
    "legal": {
        "email": "example@example.com",
        "orgName": "Trufi Association e.V.",
        "termsOfServiceUrl": "",
        "privacyPolicyUrl": ""
    }
}
```

See our [example.json](example.json) for the format and a description of the fields of the response (city configuration). If you want to use the example for testing or want to build upon it you will need to remove the comments as comments are illegal in JSON.

#### Errors thrown

This endpoint returns errors in the following circumstances:

1. No valid JSON body

   ```json
   {
       "msg": "JSON body parameter 'lat' or 'lon' or both haven't been provided",
       "status": 300
   }
   ```

2. No city configurations available in this instance
   ```json
   {
       "msg": "This instance of 'Locaco' contains no city configurations",
       "code": 100
   }
   ```

3. Not withing the allowed range of the nearest city
   ```json
   {
       "msg": "Not withing the range of nearest city 'Germany, Hamburg'.",
       "code": 200,
       "maxDistanceAllowed": 50,
       "nearestCity": "Hamburg",
       "nearestCountry": "Germany"
   }
   ```

   

#### Error classes

- `100-199`: Issues with the instance itself.
- `200-299`: Issues with the city configuration.
- `300-399`: Issues with the request.
