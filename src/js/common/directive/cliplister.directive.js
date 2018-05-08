(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('cliplister', CliplisterDirective);

    CliplisterDirective.$inject = ['locale', '$timeout'];

    function CliplisterDirective(locale, $timeout) {
        return {
            restrict: 'E',
            template: '<div class="video-player" style="height:400px;"></div>',
            scope: {
                videoId: '=videoId'
            },
            link: function(scope, element, attrs) {
                var id = 'video' + Math.floor(Math.random()*1000);
                element.attr('id', id);
                $timeout(function () {
                    var viewer = new CliplisterControl.Viewer({
                        parentId: id,
                        customer: 157893,
                        assets: [scope.videoId],
                        keyType: 10000,
                        lang: locale.language,
                        fsk: 18,
                        autoplay: false,
                        plugins: {
                            InnerControls: {
                                layer: 2,
                                mobileDefaultControls: true,
                                id: "controls",
                                blacklist: ["share","quality","playback-speed"],
                                template: {
                                    type: "external",
                                    source: "https://mycliplister.com/static/viewer/assets/skins/default/controls.html"
                                }
                            },
                            ClickableVideo: {layer: 1},
                            PlayButton: {
                                id: "playButton",
                                layer: 7,
                                image: "https://mycliplister.com/static/viewer/assets/skins/default/playButton.png",
                                width: 100,
                                height: 100
                            },
                            PreviewImage: {layer: 6}
                        }
                    });

                    var slick = element.closest('.js-slick-slider');
                    viewer.onPlay(function () {
                        slick.slick('slickPause');
                    });

                    slick.on('beforeChange', function () {
                        viewer.pause();
                    });
                }, 500);
            },
            replace: true
        }
    }

})(angular);
