from flask import Flask, render_template, request, send_file
from cartodb import CartoDBAPIKey, CartoDBException
import os
import json
app = Flask(__name__)

#generates a session with cartodb
def CreateCartoSession():
	api_key = os.environ["CARTODBKEY"]
	cartodb_domain = 'codeforkansascity'
	cl = CartoDBAPIKey(api_key, cartodb_domain)
	return cl

#renders the main page
@app.route('/')
def index():
	return render_template('index.html')

#returns the parcel geometry and zone data for every parcel as json
@app.route('/map_data.json', methods=['GET'])
def map():
	#carto = CreateCartoSession()

	#query = ("SELECT  cartodb_id, the_geom, the_geom_webmercator "
		#"FROM codeforkansascity.kcmo_parcels_6_18_2015_kiva_nbrhd")

	#return carto.sql(query, False, True, 'geojson')

	return send_file('data/mapdatatopo.json')

#returns the geometry for the address and immediate surrounding parcels as json
@app.route('/search/<address>.geojson', methods=['GET'])
def search(address):
	carto = CreateCartoSession()

	query = ("WITH query_geom "
		"AS (SELECT the_geom AS geom "
		"FROM codeforkansascity.kcmo_parcels_6_18_2015_kiva_nbrhd "
		"WHERE address LIKE '") + address + ("%') " 
		"SELECT parcels.cartodb_id, parcels.kivapin, "
		"parcels.the_geom, parcels.the_geom_webmercator "
		"FROM codeforkansascity.kcmo_parcels_6_18_2015_kiva_nbrhd "
		"AS parcels, query_geom "
		"WHERE ST_DWithin(query_geom.geom::geography, "
		"parcels.the_geom::geography, 5)")

	return carto.sql(query, False, True, 'geojson')

if __name__ == '__main__':
	app.run(debug=True)
