/// <reference path ="/node_modules/@types/jquery/jquery.d.ts"/>
import * as $ from ‘jquery’;

$(function () {
  $('input[name="daterange"]').daterangepicker({
      opens: 'right'
     
  }, function (start, end, label) {
      console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });
});