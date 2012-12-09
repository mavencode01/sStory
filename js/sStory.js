// Generated by CoffeeScript 1.3.3
var correctInputs, getJsonCode, makeBuilder, makeNavbar, makeOpenGraph, makeTimeline, makeTributary, sStory, sections, submitNewSection;

sections = {};

makeTimeline = function(d, i) {
  var timelineoptions;
  timelineoptions = {
    type: 'timeline',
    width: '100%',
    height: '620',
    source: d.url,
    embed_id: 'timeline' + i
  };
  return $(document).ready(function() {
    return createStoryJS(timelineoptions);
  });
};

makeTributary = function(element, gistID) {
  return $.ajax({
    url: "https://api.github.com/gists/" + gistID,
    cache: false
  }).done(function(gist) {
    var codefile, config, display_div, editor, editor_div, model, render, snippet, snippetHTML, snippet_data, tb, tribcont;
    console.log("GISTY", gist);
    snippet = gist.files['inlet.js'].content;
    snippet_data = {
      gist_url: gist.html_url,
      code: snippet
    };
    snippetHTML = ich.snippet(snippet_data);
    $('#snippets').append(snippetHTML);
    codefile = $(element + ' .code').text();
    display_div = d3.select(element + ' .example');
    editor_div = d3.select(element + ' .editor');
    $(element + ' .code').hide();
    tb = Tributary();
    render = "svg";
    config = new tb.Config({
      display: render
    });
    model = new tb.CodeModel({
      code: codefile
    });
    tribcont = new tb.TributaryContext({
      config: config,
      model: model,
      el: display_div.node()
    });
    tribcont.render();
    tribcont.execute();
    editor = new tb.Editor({
      model: model,
      el: editor_div.node()
    });
    return editor.render();
  });
};

makeNavbar = function(sections) {
  var nav_sections, section, sectioncount, title, _i, _len;
  sectioncount = 0;
  nav_sections = sections;
  for (_i = 0, _len = nav_sections.length; _i < _len; _i++) {
    section = nav_sections[_i];
    sectioncount++;
    section.count = sectioncount;
    if (section.title !== void 0) {
      section.title = section.title.replace(/<(?:.|\n)*?>/gm, '');
    } else {
      title = "No title";
    }
    $("#nav").append($(ich.navbarsection(section)));
  }
  $("#nav-expand").on('click', function() {
    console.log('clicked');
    if ($("#nav").hasClass("nav-expanded")) {
      return $("#nav").removeClass("nav-expanded");
    } else {
      return $("#nav").addClass("nav-expanded");
    }
  });
  return $("#nav-expand").hoverIntent({
    sensitivity: 2,
    interval: 120,
    timeout: 200,
    over: function() {
      if ($("#nav").hasClass("nav-expanded")) {
        return $("#nav").removeClass("nav-expanded");
      } else {
        return $("#nav").addClass("nav-expanded");
      }
    }
  });
};

makeOpenGraph = function(sections) {
  var section, _i, _len;
  for (_i = 0, _len = sections.length; _i < _len; _i++) {
    section = sections[_i];
    if (section.type === 'image' || section.type === 'image2' || section.type === 'image3') {
      $("head").prepend($('<meta />').attr("property", "og:title").attr("content", section.title));
      $("head").prepend($('<meta />').attr("property", "og:image").attr("content", section.url));
      return true;
    } else {
      return false;
    }
  }
};

makeBuilder = function(sections) {
  var builder, sectionli, summarycontent, summaryheader;
  builder = d3.select("#section-summary ol");
  sectionli = builder.selectAll('.section-summary-item').data(sections).enter().append("li").attr("class", "section-summary-item");
  summaryheader = sectionli.append("div").attr("class", "summary-header");
  summaryheader.append("h4").text(function(d, i) {
    if (d.title !== void 0) {
      return d.title;
    } else {
      return "> No title given.";
    }
  });
  summaryheader.append("div").attr("class", "sectiontype").text(function(d, i) {
    return d.type;
  });
  summarycontent = sectionli.append("div").attr("class", "summary-content");
  return summarycontent.append("div").attr("class", "image-url").text(function(d, i) {
    return d.url;
  });
};

correctInputs = function() {
  switch ($('#type').val()) {
    case "image":
      $('#embed-wrapper').hide();
      $('#caption').hide();
      return $('#url-wrapper').show();
    case "image2":
      $('#embed-wrapper').hide();
      $('#caption').show();
      $('#url-wrapper').show();
      return $('#caption').attr("rows", 2);
    case "image3":
      $('#embed-wrapper').hide();
      $('#caption').show();
      $('#url-wrapper').show();
      return $('#caption').attr("rows", 5);
    case "vimeo":
      $('#embed-wrapper').hide();
      $('#caption').show();
      return $('#url-wrapper').show();
    case "soundcloud":
      $('#embed-wrapper').show();
      $('#caption').hide();
      return $('#url-wrapper').hide();
    case "timeline":
      $('#embed-wrapper').hide();
      $('#caption').hide();
      return $('#url-wrapper').show();
    case "text":
      $('#embed-wrapper').hide();
      $('#caption').show();
      return $('#url-wrapper').hide();
  }
};

getJsonCode = function() {
  return $('#json-code').val(JSON.stringify(sections)).show();
};

submitNewSection = function() {
  var section;
  section = {};
  $("#error-bar").html("").css("opacity", 0);
  section.title = $("#add-section #title").val();
  section.url = $("#add-section #url").val();
  section.caption = $("#add-section #caption textarea").val();
  section.type = $("#add-section #type").val();
  section.embed = $("#add-section #embed").val();
  console.log("New " + section.type + " section", section);
  if (section.title === "") {
    $("#error-bar").html("Every section needs a title, could you add one?").css("opacity", 1);
    return false;
  } else if (section.url === "" && section.type !== "text") {
    $("#error-bar").html("Looks like you forgot to add the URL.").css("opacity", 1);
    return false;
  } else if (section.type === "image2" && section.caption === "") {
    $("#error-bar").html("This section type needs a caption.").css("opacity", 1);
    return false;
  } else if (section.type === "image3" && section.caption === "") {
    $("#error-bar").html("This section type needs a caption.").css("opacity", 1);
    return false;
  } else if (section.type === "text" && section.caption === "") {
    $("#error-bar").html("I think you may have forgotten your text!").css("opacity", 1);
    return false;
  }
  if (section.type === "image" || section.type === "image2" || section.type === "image3") {
    sections.push({
      title: section.title,
      type: section.type,
      url: section.url,
      caption: section.caption
    });
  } else if (section.type === "vimeo") {
    sections.push({
      title: section.title,
      type: section.type,
      url: section.url,
      caption: section.caption
    });
  } else if (section.type === "soundcloud") {
    sections.push({
      title: section.title,
      type: section.type,
      embed: section.embed
    });
  } else if (section.type === "text") {
    sections.push({
      title: section.title,
      type: section.type,
      text: section.caption
    });
  }
  $("#container").html("");
  $("#section-summary ol").html("");
  sStory(sections);
  return makeBuilder(sections);
};

sStory = function(sections) {
  var container, scrollorama;
  makeOpenGraph(sections);
  makeBuilder(sections);
  makeNavbar(sections);
  container = d3.select("#container");
  container.selectAll('.section').data(sections).enter().append("div").attr("id", function(d, i) {
    return "section-" + (i + 1);
  }).attr("class", function(d, i) {
    return "section " + d.type + " " + d.type + i;
  }).html(function(d, i) {
    var html;
    switch (d.type) {
      case "text":
        html = ich.text(d, true);
        break;
      case "image":
        html = ich.image(d, true);
        break;
      case "image2":
        html = ich.image2(d, true);
        break;
      case "image3":
        html = ich.image3(d, true);
        break;
      case "vimeo":
        html = ich.vimeo(d, true);
        break;
      case "soundcloud":
        html = ich.soundcloud(d, true);
        break;
      case "map":
        console.log("map");
        break;
      case "timeline":
        html = "<h2>" + d.title + "</h2> ";
        html += "<div id='timeline" + i + "'></div>";
        makeTimeline(d, i);
        console.log("timeline");
    }
    return html;
  }).style("background-image", function(d, i) {
    if (d.type === "image" || d.type === "image2" || d.type === "image3") {
      return "url('" + d.url + "')";
    }
  });
  scrollorama = $.scrollorama({
    blocks: '.section',
    enablePin: false
  });
  $("#nav a:first").addClass("current-section");
  return scrollorama.onBlockChange(function() {
    var i;
    i = scrollorama.blockIndex;
    console.log(i);
    $("#nav a").removeClass("current-section");
    return $("#nav-section-" + (i + 1)).addClass("current-section");
  });
};
