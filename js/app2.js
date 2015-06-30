var map;
var templates;

function main(){

  var options = {
    center: [39.08, -94.55],
    zoom: 14, 
    zoomControl: false,  // dont add the zoom overlay (it is added by default)
    loaderControl: false, //dont show tiles loader
    query: 'SELECT * FROM data'

  };
  
  map = new L.Map('map', options );
  
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Positron'
  }).addTo(map);
  
  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  var datalayer = 'https://code4kc.cartodb.com/api/v2/viz/8167c2b8-0cf3-11e5-8080-0e9d821ea90d/viz.json';

  cartodb.createLayer(map, datalayer).addTo(map).on('done', function(layer){
    var sublayer = layer.getSubLayer(2); //sublayer generated from the data.json file
    sublayer.infowindow.set('template', $('#infowindow_template').html());
    sublayer.setInteraction(true);
    //add more data as needed:
    sublayer.setInteractivity('cartodb_id, address, apn, kivapin, land_ban30, land_ban_6, land_ban_4, land_ban_6, land_ban_7, land_ban10, land_ban36, land_ban56, land_ban60, land_bank_, own_name, landusecod, land_ban32, land_ban_3');
    sublayer.on('featureClick', function(e, latlng, pos, data, layer) {
      populatePanel(data);

      $('.cartodb-infowindow').on('click', '#openpanel' ,function(){
        $('.cd-panel').addClass('is-visible');
      });
    });
  }).on('error', function(){
    console.log("Error");
  });
}

var ParcelArea;

function buildEnvelope(zone){

  var template = $('#envelope_template').html();
  //store some variables:
  var BSFMax = calculateBSF(ParcelArea, ZoneTable[zone]["LC"], ZoneTable[zone]["St"], ZoneTable[zone]["PI"], ZoneTable[zone]["SA"], ZoneTable[zone]["PF"]);
  var BuildingComponent = calculateBuildingComponent(BSFMax, ZoneTable[zone]["LC"], ZoneTable[zone]["St"], ZoneTable[zone]["PI"], ZoneTable[zone]["SA"], ZoneTable[zone]["PF"], ZoneTable[zone]["far"]);
  var ParkingComponent = calculateParkingComponent(BuildingComponent, ZoneTable[zone]["PI"], ZoneTable[zone]["SA"]);

  //populate the template
  var rendered = Mustache.render(template, {
    maxfootprint: Math.floor(calculateBFootprint(BSFMax, ZoneTable[zone]["St"])),
    maxfloors: ZoneTable[zone]["St"],
    maxsqftg: Math.floor(BSFMax),
    minstalls: Math.floor(calculateParkingStalls(ParkingComponent, ZoneTable[zone]["SA"]))
  });
  $('#envelope').html(rendered);

}

function populatePanel(data){
  $('#AddressTitle').text(data.land_ban60);
  var zone = data.land_ban_3;
  ParcelArea = data.land_ban30;

  buildEnvelope(zone);

  //build the general tab
  var template = $('#generalbox_template').html();
  var rendered = Mustache.render(template, {
    owner: data.own_name, 
    landuse: data.land_bank_, 
    landusecode: data.landusecod,
    zone: data.land_ban_3,
    council: data.land_ban_7,
    school: data.land_ban10,
    neighborhood: data.land_ban_6,
    bff: "n/a",
    assland: "n/a",
    assimprove: "n/a",
    eximprove: "n/a",
    acres: "n/a",
    perimeter: "n/a",
    plss: "n/a"
  });
  $('#general').html(rendered);

  //build the tax tab
  template = $('#taxbox_template').html();
  var rendered = Mustache.render(template, {
    assessedvalue: "n/a",
    taxvalue: "n/a",
    levy: "n/a",
    prevyear: "2014",
    prevtax: "n/a",
    lastassessed: "n/a"
  });
  $('#tax').html(rendered);

  //build the neighborhood tab
  template = $('#nhoodbox_template').html();
  rendered = Mustache.render(template);
  $('#neighborhood').html(rendered);

  //build the plan tab
  template = $('#planbox_template').html();
  rendered = Mustache.render(template);
  $('#plan').html(rendered);

  //build the incentives tab
  template = $('#incentivesbox_template').html();
  rendered = Mustache.render(template);
  $('#incentives').html(rendered);

  //build the links tab
  template = $('#linksbox_template').html();
  rendered = Mustache.render(template, {
    kivapin: data.kivapin
  });
  $('#links').html(rendered);

  /*populate the zoning select
  
  The drop downs will need to be modified later to accomodate building type and business type options

  var zoningselect = $('#ZoningSelect');
  zoningselect.empty();
  zoningselect.append($("<option \>").val(data.land_ban_3).text(data.land_ban_3));

  */
  
  $("select#ZoningSelect").val(zone);
  //switch back to the general tab (otherwise it will leave the last active tab for the last parcel active)
  $("#general-tab").tab("show");

  //TODO: fill in the other select boxes, zoning select should probably have more options, and the fill in the building evelope
  //TODO: refactor things as objects

}


jQuery(document).ready(function($){
  $("select#ZoningSelect").on('change', function(){
    buildEnvelope($("select#ZoningSelect").find(":selected").val())
  });

  main();

  $('.cd-panel').on('click', function(event){
    if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  });

});

