# angular2-mapboxgl-FoursquareAPI.

Simple example project on how to use Angular2, MapboxGL and Foursquare API.

I Initially forked this project in order to fastly setup Mapbox GL and Angular project : https://github.com/haoliangyu/angular2-mapboxgl-starter.git


# Requirement

In order to launch this project you have to be sure to have Nodejs(and Npm/Yarn) installed on you machine.

# Setup 

In the terminal go into the project folder :

```
$ cd path/to/the/folder/project
```

Then install all dependecy via Npm or yarn :

```
$ yarn 
```

or

```
$ npm install
```

Now install globally webpackdev :

```
sudo npm install -g webpack-dev-server 
```

And now all you need to do is to launch the web server :

```
$ webpack-dev-server --content-base public
```

You can now access the app via : http://localhost:8080


# The app 

There is exactly 3 component in this app and 3 services.

For the services :

- The geocoding service is there to geocode ( Transform an address into Lat/lng points ) and regeocode.
- The Map services which is there to allow to access the mapbox Map everywhere in the app.
- The foursquare services which allow us to retrieve recommenceded position near a specific point searched by the user.
(I used Subject from Rx/js here to allow the sidebar component to receive update from this service even if the caller is initially the navigator component.)

For the component :

- The app component which is the Parent component. His main function is to hold the map from mapbox. he is also parent of navigator component.
- Tha navigator component wich has as main role to receive an address from an input and to use geocoding service to retrieve Lng and lat in order to then use the foursquare API with the informations returned.
- The sidebar component which has as main role to receive data from foursquare API and display recommended Location.
