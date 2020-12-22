# ZirconTech Universal Certificate Verifier

A standalone universal viewer &amp; verifier for blockcerts credentials

## Production
The component is developed with Polymer 3.
To use the component in your project, install it via:

```
  npm i @blockcerts/blockcerts-verifier
```

# Development
## Viewing Your Element

```
npm run start
```

Will make the demo page available on http://localhost:8081/demo/.

## Modifying the Sanitizer

The `sanitizer` is used in order to protect against malicious certificates that could hold XSS attacks.
It is an overlay of the [xss](https://www.npmjs.com/package/xss) library, since at times, you might want to be able to configure or adapt the whitelist to your own needs.

To modify it, you should edit the `sanitizer/index.js` file. 

#### Whitelist CSS properties
More specifically if you wish to whitelist some CSS properties, add them to the object `whiteListedCssProperties`.

#### Generate the updated sanitizer
```
  npm run build:sanitizer
```

This will generate the `sanitizer.js` file, which is then used by the application and the tests.

If you want to work on the sanitizer in watch mode (and auto-generate your changes), use the following command:

```
  npm run build:sanitizer -- -w
```

## Running Tests

### Application Tests

```
npm run test:application
```

NOTE: application must be started to run the tests, or at the very least the mock-server via the `npm run start:mock-server` (automatically included in the `npm run start` command).

**watch mode**

```
npm run test:application:watch
```

### Component Tests
```
npm run test:components
```

**"watch" mode**
```
npm run test:components:persist
```
Will allow refreshing the test page: http://localhost:8000/components/blockcerts-verifier/generated-index.html?cli_browser_id=0

## More info

This project is a fork from the [Blockcerts](https://www.blockcerts.org) open source project, it was extended to aggregate custom presentation and data processing
