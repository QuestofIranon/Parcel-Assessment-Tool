from flask import Flask, render_template, request
from cartodb import CartoDBAPIKey, CartoDBException
import os
import json
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/search/<address>', methods=['GET'])
def search(address):
	api_key = os.environ["CARTODBKEY"]
	cartodb_domain = 'codeforkansascity'
	carto = CartoDBAPIKey(api_key, cartodb_domain)

	query = ("WITH query_geom "
		"AS (SELECT the_geom AS geom "
		"FROM codeforkansascity.kcmo_parcels_6_18_2015_kiva_nbrhd "
		"WHERE address LIKE '") + address + ("%')" 
		"SELECT parcels.cartodb_id, parcels.kivapin, parcels.the_geom, parcels.the_geom_webmercator "
		"FROM codeforkansascity.kcmo_parcels_6_18_2015_kiva_nbrhd AS parcels, query_geom "
		"WHERE ST_DWithin(query_geom.geom::geography, parcels.the_geom::geography, 5)")

	return json.dumps(carto.sql(query))

if __name__ == '__main__':
	app.run(debug=True)
