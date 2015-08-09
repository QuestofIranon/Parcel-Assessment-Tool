# Parcel-Assessment-Tool

Working directory for the Parcel Assessment Tool project(PAT) for the UMKC School of Law.

PAT is a web application designed with a mobile first philosophy, making it easily accessable from any device. 
The target user is a real estate developer or any other person or party interested in researching information about parcels in the Kansas City area.  
The application will display useful information including; zoning, liens, lot dimensions, a geo locator, building envelopes, legal descriptions, PINs, owner information, school district, etc.  

The goal is to combine as much relevant information to real estate developers and other users
as possible in one easily accessable location.  Hopefully this will streamline the assessment process
and save valuable time.

For potential contributers, this would entail gathering data from Kansas City, Jackson County, and other sources.  

We are working on establishing an updated problem statement that reflects the cumulative lessons learned, realities of data collection, and steps forward.

#### Interested in contributing?
Please see our [Road Map](https://github.com/UMKC-Law/Parcel-Assessment-Tool/wiki/Road-Map) and check the ideas for ways that you can contribute!

#### Setup on a local machine for testing and development
_better instructions coming soon_

1. checkout this branch on your local computer
2. If you don't already have python and pip install them, make sure you have a python2.7 interpretter located somewhere on your system
3. if you haven't previously installed virtualenv: run `pip install virtualenv` (you might need to be a super user)
4. run `virtualenv -p /path/to/python2.7.exe env` in the root directory of the branch (in Windows your path will likely be C:\\python27\\python.exe)
5. run `. env/bin/activate` in linux/osx/unix or `env\scripts\activate` in windows
6. run `pip install -r REQUIREMENTS.txt` in the command line from the branch's root directory
7. Assign your cartodb api key to an environment variable named `CARTODBKEY`
8. After pip installs the requirements: run `python app.py` from the branch's root directory
9. open your browser and type `localhost:5000` in the address bar

!DO NOT PUSH THE VIRTUAL ENVIRONMENT TO GITHUB!
