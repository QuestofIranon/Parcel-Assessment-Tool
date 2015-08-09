from flask import Flask, render_template
from cartodb import CartoDBAPIKey, CartoDBException
import os
app = Flask(__name__)

@app.route('/')
def show_map():
	return render_template('index.html')

@app.route('/test')
def test_api():
	api_key = os.environ['CARTODBKEY']
	cartodb_domain = 'codeforkansascity'
	cl = CartoDBAPIKey(api_key, cartodb_domain)

if __name__ == '__main__':
	app.run(debug=True)
