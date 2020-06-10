// load data from json file
d3.json("../samples.json").then((data) => {

    var names = data.names;

    function buildDropDown() {
        var menu = d3.select("#selDataset");
        for (var i = 0; i < names.length; i++) {
            menu.append("option").text(names[i]).property("value", names[i]);
        }
    };
    buildDropDown();
})

d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    d3.json("../samples.json").then((data) => {
        var names = data.names;
        var dropdownMenu = d3.select("#selDataset");
        var value = dropdownMenu.property("value");

        var nameIndex = names.indexOf(value)

        var demoInfo = data.metadata[nameIndex];
        var otuId = data.samples[nameIndex].otu_ids;
        var otuValue = data.samples[nameIndex].sample_values;

        var sortedValues = [data.samples[nameIndex]].sort((a, b) => b.sample_values - a.sample_values);
        console.log(sortedValues);
        //     var sortedValuesTop = sortedValues.slice(0, 10);
        //     console.log(sortedValuesTop);

        // Reverse the array to accommodate Plotly's defaults
        // var valuesReversed = sortedValuesTop.reverse();
        // console.log(valuesReversed);

        xVals = sortedValues.map(object => object.sample_values)[0];
        yValsInt = sortedValues.map(object => object.otu_ids)[0]
        yVals = yValsInt.map(String);

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

        colors = []
        r = 5
        g = 160
        b = 255

        for (var i = 0; i < names.length; i++) {
            r += 1
            g -= 1
            b -= 1
            colors.push("rgb(" + r + ", " + g + ", " + b + ")")
        }

        console.log(colors)

        var trace2 = {
            x: otuId,
            y: otuValue,
            mode: 'markers',
            marker: {
                gradient: "horizontal",
                size: otuValue
            }
        };

        var data2 = [trace2];

        var layout2 = {
            title: "All Operational Taxonomic Units (OTU) in Test Subject " + names[nameIndex] + "'s Belly Button",
            showlegend: false
        };

        Plotly.newPlot('bubble', data2, layout2);


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

        var layout3 = {
            margin: {
                t: 0, b: 0
            }
        };

        Plotly.newPlot('gauge', data3, layout3);


        var info = d3.select("#sample-metadata");

        info.html("");
        info.append("p").text("id: " + demoInfo.id);
        info.append("p").text("ethnicity: " + demoInfo.ethnicity);
        info.append("p").text("gender: " + demoInfo.gender);
        info.append("p").text("age: " + demoInfo.age);
        info.append("p").text("location: " + demoInfo.location);
        info.append("p").text("bbtype: " + demoInfo.bbtype);
        info.append("p").text("wfreq: " + demoInfo.wfreq);
    });
};