// loads data from json file
d3.json("samples.json").then((data) => {

    // this function adds all names and values to the dropdown menu
    function init() {
        // creates array of all names/ids
        var names = data.names;
        // selects the dropdown menu
        var menu = d3.select("#selDataset");

        // adds the id of each test subject to the dropdown menu and adds the value as the same number
        for (var i = 0; i < names.length; i++) {
            menu.append("option").text(names[i]).property("value", names[i]);
        }

        // creates array of all names/ids
        var names = data.names;
        // selects dropdown menu element
        var dropdownMenu = d3.select("#selDataset");
        // selects the value from menu that user selected
        var value = dropdownMenu.property("value");
        // gets all the demegraphic info from the test subject the user select
        var demoInfo = data.metadata[0];
        // creates array of all OTU ids of the test subject the user select
        var otuId = data.samples[0].otu_ids;
        // creates array of all OTU values of the test subject the user select
        var otuValue = data.samples[0].sample_values;
        // creates array of all OTU labels of the test subject the user select
        var otuLabels = data.samples[0].otu_labels;

        // zips all 3 arrays above togethers
        var zip = otuValue.map(function (e, i) {
            return [e, otuId[i], otuLabels[i]];
        });

        // sorts zipped array from greatest to least OTU value
        var sortedValues = zip.sort((a, b) => b[0] - a[0]);
        // takes only the top OTU values 10 values
        var sortedValuesTop = sortedValues.slice(0, 10);
        var reversedValues = sortedValuesTop.reverse()

        // takes just the OTU sample_values from dataset
        var xVals = reversedValues.map(object => object[0]);
        // takes just the OTU ids from dataset
        var yValsList = reversedValues.map(object => object[1].toString());
        var yVals = yValsList.map(item => "OTU " + item);
        // takes just the OTU labels from dataset
        var labels = reversedValues.map(object => object[2]);

        // sets up data for horizontal bar chart
        var trace1 = {
            x: xVals,
            y: yVals,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Create the data array for the plot
        var data1 = [trace1];

        // Define the plot layout
        var layout1 = {
            title: "Top 10 Operational Taxonomic Units (OTU)",
            xaxis: { title: "Amount Present in Belly Button" },
            yaxis: { title: "OTU ID Number" }
        };

        // Plots the chart to a div tag with id "bar"
        Plotly.newPlot("bar", data1, layout1);

        // colors = []
        // r = 5
        // g = 160
        // b = 255
        // for (var i = 0; i < names.length; i++) {
        //     r += 1
        //     g -= 1
        //     b -= 1
        //     colors.push("rgb(" + r + ", " + g + ", " + b + ")")
        // }
        // console.log(colors)

        // sets up data for bubble chart
        var trace2 = {
            x: otuId,
            y: otuValue,
            mode: 'markers',
            marker: {
                gradient: "horizontal",
                size: otuValue
            }
        };

        // Create the data array for the plot
        var data2 = [trace2];

        // Define the plot layout
        var layout2 = {
            title: "All Operational Taxonomic Units (OTU) in Test Subject's Belly Button",
            showlegend: false,
            xaxis: { title: "OTU ID Number" },
            yaxis: { title: "Amount Present" }
        };

        // Plot the chart to a div tag with id "bubble"
        Plotly.newPlot('bubble', data2, layout2);

        // sets up data for gauge chart
        var data3 = [
            {
                domain: {
                    x: [0, 1],
                    y: [0, 1]
                },
                value: demoInfo.wfreq,
                title: {
                    text: "Belly Button Washing Frequency\nScrubs per Week"
                },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {
                        range: [null, 9],
                        tickwidth: 0,
                        nticks: 9,
                        tick0: 0,
                        dtick: 1,
                        ticks: "inside",
                        ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                        // tickcolor: 
                    }
                }
            }
        ];

        // Define the plot layout
        var layout3 = {
            margin: {
                t: 0, b: 0
            }
        };

        // Plot the chart to a div tag with id "gauge"
        Plotly.newPlot('gauge', data3, layout3);

        // gets the div tag with id "sample-metadata"
        var info = d3.select("#sample-metadata");

        // adds a paragraph to the div with appropiate information for each piece of demographic data
        Object.entries(demoInfo).forEach(([key, value]) => info.append("p").text(key + ": " + value));

    };

    init();
});

// whenever a change is made to the dropdown menu, the optionChanged function is called
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    // prevents the page from refreshing
    d3.event.preventDefault();

    // loads data from json file
    d3.json("samples.json").then((data) => {
        // creates array of all names/ids
        var names = data.names;
        // selects dropdown menu element
        var dropdownMenu = d3.select("#selDataset");
        // selects the value from menu that user selected
        var value = dropdownMenu.property("value");

        // gets the index of the id that the user selected
        var nameIndex = names.indexOf(value)

        // gets all the demegraphic info from the test subject the user select
        var demoInfo = data.metadata[nameIndex];
        // creates array of all OTU ids of the test subject the user select
        var otuId = data.samples[nameIndex].otu_ids;
        // creates array of all OTU values of the test subject the user select
        var otuValue = data.samples[nameIndex].sample_values;
        // creates array of all OTU labels of the test subject the user select
        var otuLabels = data.samples[nameIndex].otu_labels;

        // zips all 3 arrays above togethers
        var zip = otuValue.map(function (e, i) {
            return [e, otuId[i], otuLabels[i]];
        });

        // sorts zipped array from greatest to least OTU value
        var sortedValues = zip.sort((a, b) => b[0] - a[0]);
        // takes only the top OTU values 10 values
        var sortedValuesTop = sortedValues.slice(0, 10);
        var reversedValues = sortedValuesTop.reverse()

        // takes just the OTU sample_values from dataset
        var xVals = reversedValues.map(object => object[0]);
        // takes just the OTU ids from dataset
        var yValsList = reversedValues.map(object => object[1].toString());
        var yVals = yValsList.map(item => "OTU " + item);
        // takes just the OTU labels from dataset
        var labels = reversedValues.map(object => object[2]);

        // Re-Plots the bar chart with new values to a div tag with id "bar"
        Plotly.restyle("bar", "x", [xVals]);
        Plotly.restyle("bar", "y", [yVals]);
        Plotly.restyle("bar", "text", [labels]);

        var marker = {
            gradient: "horizontal",
            size: otuValue
        };

        // Re-Plots the bubble chart with updated values to a div tag with id "bubble"
        Plotly.restyle("bubble", "x", [otuId]);
        Plotly.restyle("bubble", "y", [otuValue]);
        Plotly.restyle("bubble", "marker", [marker]);


        // Re-Plots the gauage chart with update values to a div tag with id "gauge"
        Plotly.restyle("gauge", "value", demoInfo.wfreq)

        // gets the div tag with id "sample-metadata"
        var info = d3.select("#sample-metadata");

        // clears out html in div every time a new ID is selected
        info.html("");

        // adds a paragraph to the div with appropiate information for each piece of demographic data
        Object.entries(demoInfo).forEach(([key, value]) => info.append("p").text(key + ": " + value));

    });
};