(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('imageSrcSet', ImageSrcSet);

    ImageSrcSet.$inject = ['_'];

    function Dimensions(width, height) {
        return {
            width: width,
            height: height
        }
    }
    // '{{$image | imageUrl: $type: \'270x95\'}} 270w, ' +
    // '{{$image | imageUrl: $type: \'680x240\'}} 680w, ' +
    // '{{$image | imageUrl: $type: \'820x290\'}} 820w, ' +
    // '{{$image | imageUrl: $type: \'1170x410\'}} 1170w, ' +
    // '{{$image | imageUrl: $type: \'1470x515\'}} 1470w, ' +
    // '{{$image | imageUrl: $type: \'1600x560\'}} 1600w, ' +
    function ImageSrcSet(_) {
        var breakpoints = {
            '21:9': [Dimensions(1600, 560), Dimensions(1470, 515), Dimensions(1170, 410), Dimensions(820, 290), Dimensions(680, 240), Dimensions(270, 95)]
        };

        return {
            restrict: 'EA',
            replace: true,
            template: function (element, attrs) {
                var ratio = attrs.aspectRatio;
                var variants = _
                    .map(breakpoints[ratio], function (dimension) {
                        return "{{$image | imageUrl: $type: '" + dimension.width + "x" + dimension.height + "'}} " + dimension.width +"w,"
                    })
                    .join();

                return '<img ' +
                    'class="{{$class}}" ' +
                    'ng-src="{{$image | imageUrl: $type}}" ' +
                    'alt="{{$alt}}" ' +
                    'title="{{$title}}" ' +
                    'ng-srcset="' + variants + '{{$image | imageUrl: $type}}' +
                '">';
            },
            scope: {
                $image: '=image',
                $alt: '=altText',
                $title: '=titleText',
                $type: '=imageType',
                $class: '@appendClass'
            },
            link: function(scope, element, attrs) {

            }
        }
    }

})(angular);
