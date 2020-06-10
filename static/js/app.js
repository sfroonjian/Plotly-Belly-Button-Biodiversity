// loads data from json file
d3.json("../samples.json").then((data) => {

    // creates array of all names/ids
    var names = data.names;

    // this function adds all names and values to the dropdown menu
    function buildDropDown() {
        var menu = d3.select("#selDataset");
        for (var i = 0; i < names.length; i++) {
            menu.append("option").text(names[i]).property("value", names[i]);
        }
    };
    buildDropDown();
})

// whenever a change is made to the dropdown menu, the optionChanged function is called
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    // loads data from json file
    d3.json("../samples.json").then((data) => {
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

        // sorts the whole object from greatest to least according to the OTU values
        var sortedValues = [data.samples[nameIndex]].sort((a, b) => b.sample_values - a.sample_values);
        console.log(sortedValues);

        // takes only the top ten values
        // var sortedValuesTop = sortedValues.slice(0, 10);
        // console.log(sortedValuesTop);

        // Reverse the array to accommodate Plotly's defaults
        // var valuesReversed = sortedValuesTop.reverse();
        // console.log(valuesReversed);

        // takes just the OTU sample_values from dataset
        xVals = sortedValues.map(object => object.sample_values)[0];
        // takes just the OTU ids from dataset
        yValsInt = sortedValues.map(object => object.otu_ids)[0]
        // converts items in array above into strings
        yVals = yValsInt.map(String);

        // sets up data for horizontal bar chart
        var trace1 = {
            x: xVals,
            y: yVals,
            text: sortedValues.map(object => object.otu_labels)[0],
            type: "bar",
            orientation: "h"
        };

        // Create the data array for the plot
        var data1 = [trace1];

        // Define the plot layout
        var layout1 = {
            title: `Top 10 Operational Taxonomic Units (OTU) in Belly Button`,
            xaxis: { title: "Amount" },
            yaxis: { title: "OTU ID Number" }
        };

        // Plot the chart to a div tag with id "bar"
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
            title: "All Operational Taxonomic Units (OTU) in Test Subject " + names[nameIndex] + "'s Belly Button",
            showlegend: false
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
                        tickwidth: 1,
                        nticks: 9,
                        tick0: 0,
                        dtick: 1,
                        ticks: "inside",
                        tickmode: "array",
                        ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                        tickvals: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
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

        // clears out html in div every time a new ID is selected
        info.html("");
        // adds a paragraph to the div with appropiate information for each piece of demographic data
        info.append("p").text("id: " + demoInfo.id);
        info.append("p").text("ethnicity: " + demoInfo.ethnicity);
        info.append("p").text("gender: " + demoInfo.gender);
        info.append("p").text("age: " + demoInfo.age);
        info.append("p").text("location: " + demoInfo.location);
        info.append("p").text("bbtype: " + demoInfo.bbtype);
        info.append("p").text("wfreq: " + demoInfo.wfreq);
    });
};