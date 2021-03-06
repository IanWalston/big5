const answers = [];

//get the test
$.get("/test.json", function(data) {
  const question_list = data.questions;
  const display = $("#display");
  const row = $("<div>").addClass("row hidesmall fixed");

  //some style for display
  display
    .addClass("rounded border border-dark p-4 m-2")
    .css("background-color", "lightgrey");

  //rend the word questions in the DOM
  row.append(
    $("<h1>")
      .addClass("col-md-5")
      .append("Questions")
  );

  //render labels for radio buttons at top of large screen DOM
  [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree"
  ].forEach(item => {
    row.append(
      $("<label>")
        .addClass("col-md-1 radio-inline hidesmall")
        .append($("<p>").html(item))
    );
  });

  display.append(row);
  display.append("<hr>");

  //render each question row in the DOM
  let i = 1;
  question_list.forEach(question => {
    const num = question.questionNumber;
    const rev = question.reversed;
    const row = $("<form>").addClass("row rounded");

    //add question to row
    row.append(
      $("<h4>")
        .addClass("col-md-5")
        .append(
          "I " +
            JSON.stringify(question.question)
              .replace(/"/g, "")
              .toLowerCase()
        )
    );

    //add radios to row
    row.append(
      //append radio 1
      $("<label>")
        .addClass("col-md-1 radio-inline rounded")
        .attr("onclick", `$(this).addClass("flash")`)
        .append(
          $("<input>")
            .attr("type", "radio")
            .attr("name", "optradio")
            .attr("onclick", `(${rev})?answers[${num}] = 5:answers[${num}] = 1`)
        )
        .append(
          $("<div>")
            .html("Strongly Disagree")
            .addClass("showsmall")
        )
    );
    row.append(
      //append radio 2
      $("<label>")
        .addClass("col-md-1 radio-inline rounded")
        .attr("onclick", `$(this).addClass("flash")`)
        .append(
          $("<input>")
            .attr("type", "radio")
            .attr("name", "optradio")
            .attr("onclick", `(${rev})?answers[${num}] = 4:answers[${num}] = 2`)
        )
        .append(
          $("<div>")
            .html("Disagree")
            .addClass("showsmall")
        )
    );
    row.append(
      //append radio 3
      $("<label>")
        .addClass("col-md-1 radio-inline rounded flash")
        .attr("onclick", `$(this).addClass("flash")`)
        .append(
          $("<input>")
            .attr("type", "radio")
            .attr("name", "optradio")
            .attr("onclick", `(${rev})?answers[${num}] = 3:answers[${num}] = 3`)
            .attr("checked", "checked")
        )
        .append(
          $("<div>")
            .html("Neutral")
            .addClass("showsmall")
        )
    );
    row.append(
      //append radio 4
      $("<label>")
        .addClass("col-md-1 radio-inline rounded")
        .attr("onclick", `$(this).addClass("flash")`)
        .append(
          $("<input>")
            .attr("type", "radio")
            .attr("name", "optradio")
            .attr("onclick", `(${rev})?answers[${num}] = 2:answers[${num}] = 4`)
        )
        .append(
          $("<div>")
            .html("Agree")
            .addClass("showsmall")
        )
    );
    row.append(
      //append radio 5
      $("<label>")
        .addClass("col-md-1 radio-inline rounded")
        .attr("onclick", `$(this).addClass("flash")`)
        .append(
          $("<input>")
            .attr("type", "radio")
            .attr("name", "optradio")
            .attr("onclick", `(${rev})?answers[${num}] = 1:answers[${num}] = 5`)
        )
        .append(
          $("<div>")
            .html("Strongly Agree")
            .addClass("showsmall")
        )
    );

    //add for to DOM at #display
    display.append(row);
    display.append($("<hr>"));

    //setting default answer to neutral in the answer object
    answers[num.slice(0, -1)] = 3;

    if (i % 6 == 0) {
      const row = $("<div>");
      //rend the word questions in the DOM
      row.append(
        $("<h1>")
          .addClass("col-md-5 hidesmall")
          .append("Questions")
      );

      //render labels for radio buttons at top of large screen DOM
      [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree"
      ].forEach(item => {
        row.append(
          $("<label>")
            .addClass("col-md-1 radio-inline hidesmall")
            .append($("<p>").html(item))
        );
      });
      row.addClass("row rounded");
      display.append(row);
      display.append("<hr>");
    }
    i++;
  });

  //append submit button to bottom of DOM
  display.append(
    $("<div>")
      .addClass("row")
      .append($("<div>").addClass("col-md-8"))
      .append(
        $("<button>")
          .html("Submit Test")
          .addClass("col-md-4 mb-5 btn btn-primary")
          .on("click", () => {
            //turn the answers object into a string, then make a request to the server to score our test
            score_string = answers.join(",").slice(1, -2);
            console.log(score_string);

            $.get("/score/" + score_string, function(data) {
              display.empty();
              console.log(data);

              //canvasjs paint chart of 5 Factor score
              const userchart = new CanvasJS.Chart("userchartdisplay", {
                animationEnabled: true,

                title: {
                  text: "Your 5 Factor Personality Score"
                },
                axisX: {
                  interval: 1
                },
                axisY2: {
                  minimum: 1,
                  maximum: 5,
                  interlacedColor: "rgba(1,77,101,.2)",
                  gridColor: "rgba(1,77,101,.1)",
                  title: "Score"
                },
                data: [
                  {
                    type: "bar",
                    name: "score",
                    axisYType: "secondary",
                    color: "#014D65",
                    dataPoints: [
                      { y: data.score.Extraversion, label: "Extraversion" },
                      { y: data.score.Agreeableness, label: "Agreeableness" },
                      {
                        y: data.score.Conscientiousness,
                        label: "Conscientiousness"
                      },
                      {
                        y: data.score.Emotional_Stability,
                        label: "Emotional Stability"
                      },
                      { y: data.score.Intellect, label: "Intellect" }
                    ]
                  }
                ]
              });
              userchart.render();
              $(".canvasjs-chart-credit")
                .css("z-index", "-1")
                .css("opacity", "0");
              //end of chart

              //canvasjs paint chart of 5 Factor score
              const animalchart = new CanvasJS.Chart("animalchartdisplay", {
                animationEnabled: true,

                title: {
                  text: `${data.match.match.name} 5 Factor Personality Score`
                },
                axisX: {
                  interval: 1
                },
                axisY2: {
                  minimum: 1,
                  maximum: 5,
                  interlacedColor: "rgba(1,77,101,.2)",
                  gridColor: "rgba(1,77,101,.1)",
                  title: "Score"
                },
                data: [
                  {
                    type: "bar",
                    name: "score",
                    axisYType: "secondary",
                    color: "#014D65",
                    dataPoints: [
                      {
                        y: data.match.match.Extraversion,
                        label: "Extraversion"
                      },
                      {
                        y: data.match.match.Agreeableness,
                        label: "Agreeableness"
                      },
                      {
                        y: data.match.match.Conscientiousness,
                        label: "Conscientiousness"
                      },
                      {
                        y: data.match.match.Emotional_Stability,
                        label: "Emotional Stability"
                      },
                      { y: data.match.match.Intellect, label: "Intellect" }
                    ]
                  }
                ]
              });
              animalchart.render();
              $(".canvasjs-chart-credit")
                .css("z-index", "-1")
                .css("opacity", "0");
              //end of chart

              display
                .css("background-color", "white")
                .css("border-color", "white")
                .removeClass("border-dark");

              display.append(
                $("<div>")
                  .html(
                    `The animal with the closest score to your's was the ${
                      data.match.match.name
                    }!`
                  )
                  .css("margin-top", "400px")
              );

              const img = $("<img>");
              img
                .attr("src", data.match.match.imgurl)
                .css("margin-bottom", "1600px");
              display.append(img);

              console.log(data.match);
            });
          })
      )
  );

  // $(".radio-inline").on("click", ()=>console.log(this));
});
//clickable animation
