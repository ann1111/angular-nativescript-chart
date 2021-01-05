var dataset = {};
var colors = ['#4F81BC', '#C0504E', '#9BBB58', '#F79647', '#8064A1', '#4AACC5', '#7F6084', '#77A033', '#33558B', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
function init() {
    fillData();
    bindclick();
}
function fillData() {
    var id = "1";
    var filter = $("#filter").val();
    var datasetmain = '{"Total" : [ ["x","HeadCount"], ["Total" ,106]],"Total - HeadCount": [ ["x","BCL Technologies","Beehive Software Services Pvt Ltd."], ["HeadCount",10,96]],"Total - HeadCount - BCL Technologies": [ ["x","IEO","QOC01","QOC02","SOMAARTH"], ["BCL Technologies",2,1,1,6]],"Total - HeadCount - BCL Technologies - IEO": [ ["x","NEW DELHI"], ["IEO",2]],"Total - HeadCount - BCL Technologies - IEO - NEW DELHI": [ ["x","LIBRARY","UTILITY SUPPORT"], ["NEW DELHI",1,1]],"Total - HeadCount - BCL Technologies - QOC01": [ ["x","NEW DELHI"], ["QOC01",1]],"Total - HeadCount - BCL Technologies - QOC01 - NEW DELHI": [ ["x","MANAGEMENT"], ["NEW DELHI",1]],"Total - HeadCount - BCL Technologies - QOC02": [ ["x","Mumbai"], ["QOC02",1]],"Total - HeadCount - BCL Technologies - QOC02 - Mumbai": [ ["x","MANAGEMENT"], ["Mumbai",1]],"Total - HeadCount - BCL Technologies - SOMAARTH": [ ["x","Mumbai","NEW DELHI","PALWAL"], ["SOMAARTH",1,1,4]],"Total - HeadCount - BCL Technologies - SOMAARTH - Mumbai": [ ["x","IT"], ["Mumbai",1]],"Total - HeadCount - BCL Technologies - SOMAARTH - NEW DELHI": [ ["x","FIELD STAFF"], ["NEW DELHI",1]],"Total - HeadCount - BCL Technologies - SOMAARTH - PALWAL": [ ["x","MANAGEMENT","MEDICAL","RESEARCH"], ["PALWAL",1,2,1]],"Total - HeadCount - Beehive Software Services Pvt Ltd.": [ ["x","Branch_Unknown","IEO","SOMAARTH"], ["Beehive Software Services Pvt Ltd.",1,45,50]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - Branch_Unknown": [ ["x","Location_Unknown"], ["Branch_Unknown",1]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - Branch_Unknown - Location_Unknown": [ ["x","MANAGEMENT"], ["Location_Unknown",1]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - IEO": [ ["x","Mumbai","NEW DELHI","PALWAL"], ["IEO",2,42,1]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - IEO - Mumbai": [ ["x","IT","MANAGEMENT"], ["Mumbai",1,1]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - IEO - NEW DELHI": [ ["x","FINANCE","HUMAN RESOURCES","MANAGEMENT","RESEARCH"], ["NEW DELHI",1,1,11,29]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - IEO - PALWAL": [ ["x","ADMINISTRATION"], ["PALWAL",1]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - SOMAARTH": [ ["x","Mumbai","NEW DELHI"], ["SOMAARTH",48,2]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - SOMAARTH - Mumbai": [ ["x","IT","MANAGEMENT"], ["Mumbai",3,45]],"Total - HeadCount - Beehive Software Services Pvt Ltd. - SOMAARTH - NEW DELHI": [ ["x","FINANCE","MANAGEMENT"], ["NEW DELHI",1,1]],}';
    /*$.ajax({
        url: virtualUrl('Analytics/Show/GetData'),
        type: 'GET',
        data: {
            id: id,
            filter: filter
        },
        dataType: 'json',
        async: false,
        success: function (result) { 
            if (result.msg == "success") {
                var str = result.data;
                //dataset = JSON.parse(str);
                dataset = jQuery.parseJSON(str.replace(",}", "}"));
                loadChart('#chart', dataset, "Total");
               
            }
            $(".loader").hide();
        }
    });*/
    var str = datasetmain;
    dataset = jQuery.parseJSON(str.replace(",}", "}"));
    //var dataset = datasetmain;
    // loadChart('#chart', dataset, "Total");
    loadChart('#chart', dataset, "Total");
    $(".loader").hide();

}
function bindclick() {

    $("#btnPngExport").click(function () {
        exportChartToPng("chart");
    });

    $('#btnDataExport').click(function () {

        JSONToCSVConvertor(dataset[activeDataSetName.substr(0, activeDataSetName.length - 3)], activeDataSetName.substr(0, activeDataSetName.length - 3), true);
    });

    $("#filter").change(function () {
        $(".loader").show();
        chart.unload();
        $('#chart').empty();
        $("#charttitle").empty();
        activeDataSetName = "";
        iColor = 0;
        setTimeout(function () {
            fillData();
        }, 500);
    });

    $("#btntools").click(function () {
        $(this).parent().toggleClass("open");
    });
}

var activeDataSetName = "";
var chart;
var iColor = 0;
function loadChart(bindto, dataSet, dataSetName) {
    //alert(dataSet);
    activeDataSetName += dataSetName + " - ";
    dataSetName = activeDataSetName.substr(0, activeDataSetName.length - 3);
    $("#charttitle").html(activeDataSetName.substr(0, activeDataSetName.length - 3));
    chart = c3.generate({

        bindto: '#chart',
        data: {
            x: 'x',
            columns: dataset[dataSetName],
            type: 'bar',
            labels: true,
            color: function () {
                return colors[iColor];
            },
            onclick: function (d, element) {
                $("#btnBack").unbind("click");

                $("#btnBack").click(function (dsname) {

                    var nextds = "";
                    var arrds = activeDataSetName.split(" - ");
                    activeDataSetName = "";
                    if (arrds.length - 3 > -1) {
                        nextds = arrds[arrds.length - 3];
                        for (i = 0; i < arrds.length - 3; i++)
                            activeDataSetName += arrds[i] + " - ";
                    }
                    else {

                    }
                    --iColor;
                    chart.unload();
                    loadChart('#chart', dataset, nextds);
                });

                iColor++;
                chart.unload();
                loadChart('#chart', dataset, dataset[dataSetName][0][d.index + 1]);
            },

        },
        axis: {
            x: {
                type: "category",
                tick: {
                    rotate: -45,
                    multiline: false
                },
                height: 130
            }
        },

    });


}
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "Analytics_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function exportChartToPng(chartID) {
    //fix weird back fill
    d3.select('#' + chartID).selectAll("path").attr("fill", "none");
    //fix no axes
    d3.select('#' + chartID).selectAll("path.domain").attr("stroke", "black");
    //fix no tick
    d3.select('#' + chartID).selectAll(".tick line").attr("stroke", "black");
    var svgElement = $('#' + chartID).find('svg')[0];
    saveSvgAsPng(svgElement, chartID + '.png');
}