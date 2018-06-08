/**
 * @author cni
 */

"use strict";

var standardHeader = $("#header:not(.special-header)");

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}

window.Kit = window.Kit || {};

Kit.bIsXs = false;
Kit.nPageOffset = 0;

Kit.check_deviceWidth = function() {
  Kit.bIsXs = (Kit.detectXs || {}).clientHeight ? false : true;
};

Kit.reset_navPrimary = function() {
  $("#nav-primary-collapse")
    .find("li.is-open")
    .removeClass("is-open, trail")
    .end()
    .find("ul.nav-expanded")
    .removeClass("nav-expanded");
};

if (standardHeader.length) {
  jQuery(window).resize(function(e) {
    Kit.nHeaderHeight = document.getElementById("header").clientHeight;

    Kit.check_deviceWidth();

    if (window.Waypoint) {
      Waypoint.refreshAll();
    }

    if (!Kit.bIsXs) {
      Kit.reset_navPrimary();
    }
  });
}

/**
 * DOM ready
 */

jQuery(document).ready(function($) {
  if (standardHeader.length) {
    window.scrollTo(0, 0);
    Kit.nHeaderHeight = document.getElementById("header").clientHeight;

    Kit.detectXs = document.getElementById("js-detect-xs");
    Kit.check_deviceWidth();
    Kit.nPageOffset = document.querySelector(".supergraphic.fixed")
      ? document.querySelector(".supergraphic.fixed").clientHeight
      : 0;

    /**
     * Nav-Top klonen
     */
    var elNavTop = document.querySelector(".nav-top").cloneNode(true);

    elNavTop.classList.remove("hidden-xs");
    elNavTop.classList.add("visible-xs-block");
    document.getElementById("nav-primary-collapse").appendChild(elNavTop);
  }

  /**
   * DataTables
   * https://datatables.net/
   */
  if (jQuery.prototype.DataTable) {
    $("table.js-data-table").DataTable();
  }

  $.fn.CliplisterView = function() {
    return this.each(function() {
      var elem = $(this);
      var parent_id = this.id;
      var data_assets = elem.data("assets");
      var data_autoplay =
        elem.data("autoplay") !== undefined ? elem.data("autoplay") : false;
      var data_loop =
        elem.data("loop") !== undefined ? elem.data("loop") : false;
      var data_mute =
        elem.data("mute") !== undefined ? elem.data("mute") : false;
      var data_lang =
        elem.data("lang") !== undefined ? elem.data("lang") : "en";
      var data_poster_only =
        elem.data("posterOnly") !== undefined ? true : false;

      var video_options = {
        parentId: parent_id,
        customer: 157893,
        assets: data_assets,
        keyType: 10000,
        autoplay: data_autoplay,
        loop: data_loop,
        mute: data_mute,
        lang: data_lang,
        stage: {
          width: "100%",
          aspectRatio: "asset"
        },
        plugins: {
          InnerControls: {
            layer: 2,
            mobileDefaultControls: true,
            id: "controls",
            blacklist: ["share", "quality", "playback-speed"],
            template: {
              type: "external",
              source:
                "https://mycliplister.com/static/viewer/assets/skins/default/controls.html"
            }
          },
          ClickableVideo: {
            layer: 1
          },
          PlayButton: {
            id: "playButton",
            layer: 8,
            image:
              "https://mycliplister.com/static/viewer/assets/skins/default/playButton.png",
            width: 100,
            height: 100
          },
          PreviewImage: {
            layer: 6
          },
          BufferingSpinner: {
            id: "videoBufferSpinner",
            layer: 7,
            width: 50,
            height: 50
          }
        }
      };

      if (data_poster_only) {
        // Overwrite plugins, only plugin is PreviewImage!
        video_options.plugins = {
          PreviewImage: {
            layer: 1
          }
        };
      }

      setTimeout(function() {
        var myViewer = new CliplisterControl.Viewer(video_options);
      }, 1000);
    });
  };
  $(".video-player-static, .video-player-default").CliplisterView();

  // Stop Video on modal hide if there's any video ...
  $(".modal").on("hide.bs.modal", function(event) {
    $(event.currentTarget).find(".video-player-default").each(function() {
      // Call Cliplister API for each video inside modal
      this.api && this.api.stop();
    });
  });

  /**
   * Slick Slider v1.6.0
   * http://kenwheeler.github.io/slick/
   */
  if (jQuery.prototype.slick) {
    $('.js-slick-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        var slide = $(slick.$slides.get(currentSlide));
        var slideVideo = slide.find('.video-player');
        if (slideVideo.length > 0 && slideVideo[0].api) {
            slideVideo[0].api.pause();
            $(this).slick('slickPause');
        }
    })
    .on('afterChange', function(event, slick, currentSlide, nextSlide) {
        var $slider = slick.$slider;
        $(this).slick('slickPlay');
    });
  }


  // https://github.com/kenwheeler/slick/issues/1373
  // http://stackoverflow.com/a/26680322/3870081
  $(".accordion.js-has-slick-slider").on("shown.bs.collapse", function(e) {
    $(e.target)
      .find(".js-slick-slider")
      .slick("setPosition");
  });

  /**
   * Waypoints
   * https://github.com/imakewebthings/waypoints
   */
  if (window.Waypoint) {
    function stickyNaviMobilExtra() {
      var addService = $(".sticky-element-list li").clone();

      if ($("#nav-service li").hasClass("from-sticky")) {
        $("#nav-service li.from-sticky").remove();
      } else {
        $("#nav-service").prepend(addService);
      }

      $("#nav-service > li").each(function() {
        var attr = $(this).attr("id");

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== typeof undefined && attr !== false) {
          // don't do anything
        } else {
          $(this).addClass("from-sticky");
        }
      });
    }

    function stickyNaviExtra() {
      var addService = $(".sticky-element-list").clone();
      $("#nav-service").prepend(addService);
      $("#nav-secondary .sticky-element-list")
        .removeClass("sticky-element-list")
        .addClass("sticky-service-list");
    }

    var viewportWidth = $(window).width();
    if (viewportWidth < 1300) {
      stickyNaviExtra();
    }

    $(window).on("resize", function() {
      if ($(".sticky-element").is(":hidden")) {
        stickyNaviExtra();
      } else if ($(".sticky-element").is(":visible")) {
        $(".sticky-service-list").remove();
      }
      if ($(".sticky-service-list").is(":visible")) {
        $(".sticky-service-list")
          .not(":first")
          .remove();
      }
    });

    if (standardHeader.length) {
      /**
       * Header
       */
      var elHeader = document.getElementById("header"),
        elNavPrimary = document.getElementById("nav-primary"),
        $content = $("#content");

      if (elHeader && elNavPrimary) {
        var navPrimary = new Waypoint({
          element: elNavPrimary,
          handler: function(direction) {
            $(elHeader).toggleClass("sticked", direction == "down");
            $content.css(
              "margin-top",
              direction == "down" ? Kit.nHeaderHeight : ""
            );
            // START 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35
            var iOS =
              ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;
            if (iOS) {
              $content.css("margin-top", "85px");
            }
            // END 20170214 dsp workaround iOS scrolling bug, email mho>dsp Mo 13.02.2017 14:35

            /*if (isMobile) {
              stickyNaviMobilExtra();
              if ($(".sticky-service-list").is(":visible")) {
                $(".sticky-service-list").hide();
              } else {
                $(".sticky-service-list").show();
              }
            }*/
          },
          offset: Kit.nPageOffset
        });
      } // END Header
    }

    /**
     * Quicknav
     */
    var elQuickNav = document.getElementById("nav-search-results"),
      elWaypointStart = $(elQuickNav).closest(".js-waypoint-start")[0],
      elWaypointEnd = $(elQuickNav).closest(".js-waypoint-end")[0];

    if (elQuickNav && elWaypointStart && elWaypointEnd) {
      var start = new Waypoint({
        element: elWaypointStart,
        handler: function(direction) {
          elQuickNav.classList.toggle("sticked");
        },
        offset: Kit.nPageOffset + elNavPrimary.clientHeight
      });

      var end = new Waypoint({
        element: elWaypointEnd,
        handler: function(direction) {
          elQuickNav.classList.toggle("stuck");
        },
        offset: function() {
          return -(
            this.element.clientHeight -
            elQuickNav.clientHeight -
            Kit.nPageOffset -
            elNavPrimary.clientHeight -
            parseInt($(elWaypointStart).css("padding-top"), 10)
          );
        }
      });
    } // END Quicknav

    /**
     * START Accordion-Quicknav
     */
    var elQuickNavAcc = document.getElementById("nav-tab-accordion"),
      elWaypointStartAcc = $(elQuickNavAcc).closest(".js-waypoint-start")[0],
      elWaypointEndAcc = $(elQuickNavAcc).closest(".js-waypoint-end")[0];

    if (elQuickNavAcc && elWaypointStartAcc && elWaypointEndAcc) {
      var startAcc = new Waypoint({
        element: elWaypointStartAcc,
        handler: function(direction) {
          elQuickNavAcc.classList.toggle("sticked");
        },
        offset: Kit.nPageOffset + elNavPrimary.clientHeight
      });

      var endAcc = new Waypoint({
        element: elWaypointEndAcc,
        handler: function(direction) {
          elQuickNavAcc.classList.toggle("stuck");
        },
        offset: function() {
          return -(
            this.element.clientHeight -
            elQuickNavAcc.clientHeight -
            Kit.nPageOffset -
            elNavPrimary.clientHeight -
            parseInt($(elWaypointStartAcc).css("padding-top"), 10)
          );
        }
      });
    } // END Accordion-Quicknav
  }

  /**
   * Search Form
   */
  var $headerSearchField = $("#header-search").find("input[type=search]");

  $headerSearchField
    .on("focus", function(e) {
      document.body.classList.add("search-active");
    })
    .on("blur", function(e) {
      setTimeout(function () {
        document.body.classList.remove("search-active");
      }, 300);
    });

  $("#js-show-header-search").on("click", "a", function(e) {
    $headerSearchField.trigger("focus");
  });

  /**
   * To Top
   */
  $(".js-go-top").on("click", "a", function(e) {
    $("html:not(:animated), body:not(:animated)").animate(
      { scrollTop: 0 },
      240
    );
  });

  initNavCollapse($("#nav-primary-collapse").find("ul.submenu"));
}); // END DOM ready

var initNavCollapse = function(submenus) {
  var backLabel =
    window.cmsTranslations && window.cmsTranslations.MOBILE_NAVIGATION_BACK;
  /**
   * Simple Submenu
   */
  submenus
    .append('<li class="dl-back"><a>' + backLabel + "</a></li>")
    .end()
    .on("click", ".js-open-submenu", function(e) {
      if (Kit.bIsXs) {
        $(this)
          .parent("li")
          .addClass("is-open")
          .parent("ul")
          .addClass("nav-expanded")
          .closest("li.is-open")
          .addClass("trail");
      }
    })
    .on("click", "li.dl-back", function(e) {
      if (Kit.bIsXs) {
        $(this)
          .closest("li.is-open")
          .removeClass("is-open")
          .parent("ul.nav-expanded")
          .removeClass("nav-expanded")
          .parent("li.trail")
          .removeClass("trail");
      }
    })
    .on("hidden.bs.collapse", function(e) {
      Kit.reset_navPrimary();
    })
    .on("click", "li", function() {
      var ocsNav = $("#ocs-nav").find("ul.nav");
      ocsNav.addClass("hidden");
      setTimeout(ocsNav.removeClass.bind(ocsNav, "hidden"), 500);
    });
};

/*START extended modules pho*/

//START Fix Mobile Accordion-Tab

var resetActiveClass = function() {
  $("#nav-tab-accordion-dropdown li").click(function() {
    $("#nav-tab-accordion-dropdown li").removeClass("active");
  });
};

resetActiveClass();

//END Fix Mobile Accordion-Tab

//START fix waypoints and accordion issue
// $('.collapse').on('shown.bs.collapse hidden.bs.collapse', function(e) {
// 	e.stopPropagation();
// 	Waypoint.refreshAll();
// })
//END fix waypoints and accordion issue

//START mobile Accordion label
$(document).ready(function() {
  var viewportWidth = $(window).width();
  var accordionTitle = $("#accordion-title");
  var accordionHeadline = $("fs-two-column-category-accordion");
  var activeTitle = $(
    ".fs-two-column-category-accordion .dropdown-menu li.active"
  ).text();
  var titleLink = $(".fs-two-column-category-accordion .dropdown-menu li a");

  if (viewportWidth < 992) {
    $(accordionTitle).text(activeTitle);
    $(titleLink).click(function() {
      $(accordionTitle).text($(this).text());
      $(accordionTitle).val($(this).text());
    });
  }
});
//END mobile Accordion label

/*END extended modules pho*/

$(document).on("search.highlight.finished", function(event, highlight) {
  $("mark.highlight").each(function() {
    $(this)
      .closest(".panel-collapse")
      .closest(".panel")
      .find('[data-toggle="collapse"]')
      .click();
  });
});

/* START 20170210, workaround for display lag on slick carousel inside accordion */
$(document).ready(function() {
  if ($.fn.slick) {
    $(".accordion.js-has-slick-slider.slick-collapse-init .panel-collapse").on(
      "shown.bs.collapse",
      function(e) {
        $(e.target)
          .find(".slick-image-slider .slide img")
          .css("display", "block");
        $(e.target)
          .find(".js-slick-slider")
          .slick({
            arrows: false,
            dots: true,
            autoplay: true,
            autoplaySpeed: 4000,
            speed: 1000,
            cssEase: "ease-in-out"
          });
      }
    );
  }
});
/* END 20170210, workaround for display lag on slick carousel inside accordion */

/*START Hotspot Module BOTTWEB-174 20170503 pho */
$(function() {
  var $hotspotTrigger = $(".hotspot-trigger");

  if ($hotspotTrigger.length > 0) {
    $hotspotTrigger.each(function() {
      var $thisPopover = $(this);
      var $hotspotTitleTag = $thisPopover.attr("data-title-tag");
      var $hotspotTitleSize = $thisPopover.attr("data-title-size");
      $thisPopover.popover({
        html: true,
        template:
          '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        content: $("#" + $thisPopover.attr("id") + "-data").html(),
        container: "#popover-container"
      });
    });

    $(document).on("click", function(e) {
      $('[data-toggle="popover"],[data-original-title]').each(function() {
        if (
          !$(this).is(e.target) &&
          $(this).has(e.target).length === 0 &&
          $(".popover").has(e.target).length === 0
        ) {
          (
            (
              $(this)
                .popover("hide")
                .data("bs.popover") || {}
            ).inState || {}
          ).click = false;
        }
      });
    });
  }
});
/*END Hotspot Module BOTTWEB-174 20170503 pho */

/*START Image-Text Module BOTTWEB-174 20170505 pho */

$(function() {
  var viewportWidth = $(window).width();
  var textImage = $(".fs-image-text .fs-image-text-element");
  var textImageCovered = $(".fs-image-text-covered .fs-image-text-element");

  function equalize(element, reset) {
    var maxHeight = 0;
    if (reset === true) {
      element.each(function() {
        $(this).css("height", "auto");
      });
    }
    element.each(function() {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height();
      }
    });
    element.height(maxHeight);
  }

  $(window).load(function() {
    equalize(textImage, false);
    equalize(textImageCovered, false);
  });

  $(window).resize(function() {
    equalize(textImage, true);
    equalize(textImageCovered, true);
  });
});

/*END Image-Text Module BOTTWEB-174 20170505 pho */

/*START Mediawall Module BOTTWEB-174 20170510 pho */
$(function() {
  var masonryGrid = $(".masonry_grid");

  if (masonryGrid.length) {
    // init masonry
    var $grid = masonryGrid.masonry({
      itemSelector: ".masonry_grid-item",
      columnWidth: ".masonry_grid-sizer",
      percentPosition: true
    });

    //init imagesloaded
    $grid.imagesLoaded().progress(function() {
      $grid.masonry("layout");
    });
  }
});
/*END Mediawall Module BOTTWEB-174 20170510 pho */

/*START BOTTWEB-180 20170516 pho*/

$(window).load(function() {
  var viewportWidth = $(window).width();

  if (viewportWidth > 767) {
    var equalTableCellWidth = function() {
      var maxWidth2col = 0;
      var contactTable = $(".contact-table");
      var tableCell = $(".contact-table tr td:last-child");

      $(contactTable).each(function() {
        var $this = $(this);
        $this.find("tr td:last-child").addClass("last-columns");
      });

      $(".last-columns").each(function() {
        if ($(this).width() > maxWidth2col) {
          maxWidth2col = $(this).width();
        }
      });

      $(".last-columns").width(maxWidth2col);
    };
    equalTableCellWidth();
  }
});

/*END BOTTWEB-180 20170516 pho*/

/*START Special Header BOTTWEB-174 20170522 pho */
$(function() {
  var $scrollLink = $(".section-scroll-link");

  $scrollLink.each(function() {
    var $this = $(this);

    /*START Section-Scroll*/
    var $linkId = $(this).attr("href");

    $this.click(function(e) {
      e.preventDefault();
      $scrollLink.removeClass("js-selected-link");
      $this.addClass("js-selected-link");
      $("html, body").animate(
        {
          scrollTop: $($linkId).offset().top
        },
        500
      );
    });
    /*END Section-Scroll*/
  });
});
/*END Special Header BOTTWEB-174 20170522 pho */

/* START animated anchor scroll pho - updated 20171017 jpo */
var $root = $("html, body");

if (window.location.hash) {
  var urlHash = window.location.hash.substring(1);
  var targetPanel = $('.panel-heading[data-id="' + urlHash + '"]');
  if (urlHash) {
    $(".panel-heading").each(function() {
      var panelID = $(this).attr("data-id");
      if (panelID === urlHash) {
        var scrollToID = targetPanel.attr("id");
        $($root).animate(
          {
            scrollTop: $("#" + scrollToID).offset().top + -75
          },
          750
        );

        var target = targetPanel.parent(".panel");
        var $targetAccordion = target.find(".collapse");
        $targetAccordion.collapse("show");
      }
    });
  }
}

$("a[href*=\\#]").on("click", function(event) {
  // var hostname = new RegExp(location.host);
  var viewportWidth = $(window).width();
  var url = $(this).attr("href");

  if (url.slice(0, 1) === "#" || window.location.hash.length) {
    // It's an anchor link
    event.preventDefault();
    if (viewportWidth > 991) {
      var supergraphicH = $(".supergraphic").height();
      var navigationH = $(".navbar").height();
      var marginHeight =
        $(".supergraphic").length > 0 && $(".navbar").length > 0
          ? supergraphicH + navigationH
          : $(".supergraphic").length === 0 && $(".navbar").length > 0
            ? navigationH
            : 0;
      $($root).animate(
        {
          scrollTop: $(this.hash).offset().top + -marginHeight
        },
        750
      );
    } else if (viewportWidth <= 991 && $(".fs-search-results").length) {
      $($root).animate(
        {
          scrollTop: $(this.hash).offset().top + -75
        },
        750
      );
    }
  }
});
/* END animated anchor scroll pho */

/*START Sticky Element BOTTWEB-210 20170710 pho*/
if ($(".sticky-element-trigger").length) {
  $(function() {
    $(".sticky-element-trigger").popover();
  });
}
/*END Sticky Element BOTTWEB-210 20170710 pho*/

/*START maintainable animations ODSUPPORT-2807 20170809 pho*/
$(function() {
  $(".animation-modal").appendTo("body");
});
/*END maintainable animations ODSUPPORT-2807 20170809 pho*/

/*START microsites threesixty module BOTTWEB-193 20170817 pho*/
// var $reelInstance = $(".reel");
//
// $reelInstance.each(function(){
// 	var $thisInstance = $(this);
// 	var $imageSrc = $thisInstance.attr("src");
// 	var $imageName = $imageSrc.replace( /^.*?([^\/]+)\..+?$/, '$1' );
// 	$thisInstance.attr("data-frames", $imageName);
// });
/*END microsites threesixty module BOTTWEB-193 20170817 pho*/

/*START Subdivisions Startpage BOTTWEB-294 20170808 jpo*/
$(".subdivision a").on("click", function() {
  var target = $(this).data("target");
  $('[data-id="' + target + '"]').show();
  $(".subdivision").hide();
});

$(".subdivision-back").on("click", function() {
  $(".subdivision-links").hide();
  $(".subdivision").show();
});
/*END Subdivisions Startpage BOTTWEB-294 20170808 jpo*/

/*START Anchor Startpage BOTTWEB-291 20170809 jpo*/
if ($(".tab-content-container").length) {
  var hashTag = window.location.hash;

  if (hashTag) {
    function scrollToElement(hashTag) {
      $(window).scrollTop(hashTag.offset().top);
    }
    $('[href="' + hashTag + '"]')
      .parent("li")
      .addClass("active");
    $('[href!="' + hashTag + '"]')
      .parent("li")
      .removeClass("active");

    var hashID = hashTag.substring(1);
    $(".tab-content-container")
      .find('.tab-pane[id="' + hashID + '"]')
      .addClass("in active");
    $(".tab-content-container")
      .find('.tab-pane[id!="' + hashID + '"]')
      .removeClass("in active");
  } else {
    $(".nav-tab-container .nav-tabs")
      .find("li")
      .first()
      .addClass("active");
    $(".tab-content-container .tab-content")
      .find(".tab-pane")
      .first("in active");
  }
}
/*END Anchor Startpage BOTTWEB-291 20170809 jpo*/

if (document.querySelector('.fs-timeline')) {
  $.fn.chunk = function (size) {
    var arr = [];
    for (var i = 0; i < this.length; i += size) {
      arr.push(this.slice(i, i + size));
    }
    return this.pushStack(arr, 'chunk', size);
  };

  function adjustTimeline() {
    var panelGroups = $('.timeline-panel').chunk(2);
    panelGroups.each(function () {
      var minHeight = 0;
      var panelGroup = $(this);
      // Reset previous min-height to get recalculation work.
      panelGroup.css('min-height', 0);
      panelGroup.each(function () {
        var thisH = $(this).height();
        if (thisH > minHeight) {
          minHeight = thisH;
        }
      });
      // console.log(minHeight);
      panelGroup.css('min-height', minHeight);
    });
  }

	$('.timeline').imagesLoaded().progress( function() {
		adjustTimeline();
	});

  $(window).resize(function() {
    if (window.innerWidth < 768) {
      adjustTimeline();
    }
  });
}

/*START special nav affix revision 20170905 pho*/
var affixNav = function() {
  var $specialNav = $(
    "#header.special-header + #content .special-nav-wrapper.affix"
  );
  var $keyVisualHeight = $(
    "#content > .fs-keyvisual:first-of-type"
  ).outerHeight(true);
  var $stripeHeight = $("#header.special-header .header-stripe").outerHeight(
    true
  );

  if ($specialNav) {
    $specialNav.affix({
      offset: {
        top: function() {
          return $keyVisualHeight + $stripeHeight;
        }
      }
    });
  }
};

$(function() {
  affixNav();
});

$(window).on("resize", function() {
  affixNav();
});

/*END special nav affix revision 20170905 pho*/

// Video no autoplay on load for mobile devices
// remove data-backgroundvideo
// set autoplay to 'false'



if (isMobile && $(".video-container").length > 0) {
  $(".video-container").each(function() {
    var dataAutoplay = $(this)
      .find(".video-player-static")
      .attr("data-autoplay");
    if (dataAutoplay === "true") {
      $(this)
        .find(".video-player-static")
        .attr("data-autoplay", "false")
        .attr("data-backgroundvideo", "false");
    }
  });
}

// Webforms
// get page country to preselect the country
setTimeout(function(){
  if ($('.webforms-wrapper').length > 0) {
    var country = $('meta[name="DCSext.wtg_country"]').attr('content').toLowerCase();
    $('select[name="land"] option').each(function() {
      $(this)
        .parent('select')
        .find('option[data-mwf-value="' + country + '"]')
        .attr('selected', true);
    });
  }
}, 1500);

// panel no slider = set display
// for IE/FF only one panel
// text breaks (two gaps)
var twoColumn = $('.fs-two-column-icon-accordion');
if (twoColumn.length) {
  $(twoColumn).each(function(){
    var panel = $(this).find('.panel');
    $(panel).css({display: 'inline-block'});

    $(twoColumn).find('.js-slick-slider')
      .on('init', function(event, slick){
        $(panel).each(function(){
          var slider = $(this).find('.js-slick-slider');
          if($(slider).length === 1) {
            $(slider).parents('.panel').removeAttr('style');
          }
        });
      });
  });
}
