;

window.addEventListener("load", function() {
    var map = L.map('lmap');
    map.setView([35.40, 139.50], 11);

    // load a white picture constantly instead of map pictures
    var tileLayer = L.tileLayer('/img/whitelayer.png',
        { minZoom: 9, maxZoom: 12,
          attribution: '<a href="https://github.com/hashcc/railmaps">Tokyo railmaps</a>' });
    tileLayer.addTo(map);

    // pop up of the station name
    var eventOnclick = function(e) {
        e.preventDefault();
        if (/^lv/.test(this.id)) { return false; }

        var latlng = map.mouseEventToLatLng(e);
        L.popup()
        .setLatLng(latlng)
        .setContent(this.id)
        .openOn(map);
        console.log(this, e, latlng);
    };

    var railsheet = undefined;
    var railOverlay = L.d3SvgOverlay(function(sel, proj) {
        var g = $(sel[0][0]);
        if (g.find('*').length < 1) {
            console.log(this,proj);
            console.log(g);
            g.append(railsheet.children)
            .find('g#station-points g[id],path[id],circle[id]')
            .on('click', eventOnclick);
            g.find('g#station-names text')
            .css('pointer-events', 'none')
            .attr('pointer-events', 'none');
            var pb = g.context.getBBox();
            var p0 = proj.layerPointToLatLng(L.point(0, pb.height));
            var p1 = proj.layerPointToLatLng(L.point(pb.width, 0));
            map.setMaxBounds(L.latLngBounds(p0, p1));
        }
        console.log("zoom", proj.map.getZoom());
    });

    // load SVG file
    d3.xml("/img/tokyo_ja.svg", "image/svg+xml", function(xml) {
        railsheet = xml.documentElement;
        console.log(railsheet);
        railOverlay.addTo(map);
    });
}, false);
