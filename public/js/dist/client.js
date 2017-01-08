"use strict";

function getAndRenderPumpkins() {
  if (event) event.preventDefault();
  return $.ajax({
    method: "GET",
    url: "http://localhost:8000/pumpkins"
  }).done(onSuccess).fail(onError);
}

function postPumpkin() {
  if (event) event.preventDefault();

  var pumpkin = pumpkinCarver.exportComplete();
  pumpkin.title = $('#pumpkinTitle').val();

  return $.ajax({
    method: "POST",
    url: "http://localhost:8000/pumpkins",
    data: pumpkin
  }).done(function () {
    window.location = '/';
  });
}

function deletePumpkin(id) {
  return $.ajax({
    method: "DELETE",
    url: "http://localhost:8000/pumpkins/" + id
  }).done(function () {
    return function () {
      $('#' + id).slideUp();
    }(id);
  });
}

function onSuccess(json) {
  var $container = $("#main");

  json.forEach(function (pumpkin, i) {
    $container.append("<div class=\"pumpkin\" id=\"" + pumpkin._id + "\"><img src=\"" + pumpkin.previewSrc + "\"><h3>" + pumpkin.title + "</h3><a href=\"#\" class=\"delete\">Delete</a></div>");
  });

  $('a.delete').click(function () {
    deletePumpkin($(this).parent().attr('id'));
    return false;
  });
}

function onError(xhr, status, errorThrown) {
  alert("Sorry, there was a problem!");
  console.log("Error: " + errorThrown);
  console.log("Status: " + status);
  console.dir(xhr);
}