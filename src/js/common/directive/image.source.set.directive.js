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
    function ImageSrcSet(_) {
        var breakpoints = {
            '21:9': [Dimensions(1600, 560), Dimensions(1470, 515), Dimensions(1170, 410), Dimensions(820, 290), Dimensions(680, 240), Dimensions(270, 95)],
            '16:9': [Dimensions(320, 180), Dimensions(480, 270)],
            '1:1': [Dimensions(310, 310), Dimensions(130, 130)]
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
                    .join("");

                return '<img ' +
                    'class="{{$class}}" ' +
                    'ng-src="{{$image | imageUrl: $type}}" ' +
                    'alt="{{$alt}}" ' +
                    'ng-attr-sizes="{{$sizes}}" ' +
                    'title="{{$title}}" ' +
                    'ng-srcset="' + variants + '{{$image | imageUrl: $type}}' +
                '">';
            },
            scope: {
                $image: '=image',
                $alt: '=altText',
                $title: '=titleText',
                $type: '=imageType',
                $class: '@appendClass',
                $sizes: '@imgSizes'
            },
            link: function(scope, element, attrs) {

            }
        }
    }

})(angular);
