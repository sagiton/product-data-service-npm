(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('cliplister', CliplisterDirective);

    CliplisterDirective.$inject = ['$filter', '$sce'];

    function CliplisterDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<div id="video" style="height:400px;"></div>',
            scope: {
                videoId: '=videoId'
            },
            link: function(scope, element, attrs) {
                new CliplisterControl.Viewer({
                    parentId: "video",
                    customer: 157893,
                    assets: [scope.videoId],
                    keyType: 10000,
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
            },
            replace: true
        }
    };

})(angular);
