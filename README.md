# Trading

Project was created to demonstrate how to structure and solve some basic problems related to creating trading platform.
Initial version of OrderBook was created. With a little more effort it could be a good starter for such project.

## Screenshoots

![Screenshot 2022-02-14 at 10 00 13](https://user-images.githubusercontent.com/2132309/153832394-88cc68e0-91e8-4b67-81f9-dacd9a223c0b.png)
![Screenshot 2022-02-14 at 10 00 27](https://user-images.githubusercontent.com/2132309/153832403-04ecd702-6334-4e40-bc1e-e4203b3f75cb.png)
![Screenshot 2022-02-14 at 10 00 52](https://user-images.githubusercontent.com/2132309/153832410-a8242933-c9e6-4098-933c-39ea13016c24.png)

## Libraries and tools

-   React
-   Typescript
-   Redux
-   Yarn
-   Nx
-   Cypress
-   Jest

## Available commands

`yarn start` - starting dev server

`yarn build` - production build

`yarn build:watch` - watch production build

`yarn test` - run jest and cypress

`yarn coverage:generate` - generate coverage report

## What is covered

-   Order Book module, functional and running
-   Components lib, created for better perf
-   Css modules (BEM with camelcase)
-   Functional project structure
-   Modules separation - ground for micro frontend and dynamic module loading
-   Feed subscription sharing through feed model

## Testing

-   Latest Chrome
-   Latest Safari
-   Latest Opera
-   Iphone Xs
-   Samsung s10e

## Code coverage

Code test coverage ic collected from both jest (unit) and cypress (integration) tests

![Screenshot 2022-02-15 at 00 36 50](https://user-images.githubusercontent.com/2132309/153965304-8068ae67-6b6d-48ba-8005-57ada46e6f0e.png)

## Project structure

Project structure is quite common. We have a api / module / models / components separation.

![Screenshot 2022-02-14 at 23 36 17](https://user-images.githubusercontent.com/2132309/153958945-e3051f81-7417-4a1d-9659-63e637d3cb95.png)

## Dependancy graph

![Screenshot 2022-02-14 at 23 34 54](https://user-images.githubusercontent.com/2132309/153959096-f3da1c8c-844f-4a43-b245-a6a071e08ef7.png)

## Accesing store

Store object is available through `window.getStore().getState()`

## Links

You check the app here:
https://hubert-trading.vercel.app/

To check how feed subscription sharing works you can open (requires more testing):
https://hubert-trading.vercel.app/?showDouble=true

Be default we are trimmig results to numLevels if you want to see all:
https://hubert-trading.vercel.app/?showAll=true

## Final notes

Coding took around 70h. Project was developed in progressive way. It was improved iteration by iteration. There are parts that are prod ready, and some that require couple more iterations (you need to stop at some point:)). There are todos marked in code to highlight next steps.
