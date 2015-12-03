+function (angular, $) {
    "use strict";
    angular.module("app", ['ngSanitize', 'ngDraggable', 'ngSanitize'])
            .directive("myCheckbox", function () {
                return {
                    require: 'ngModel',
                    transclude: true,
                    scope: {
                        ngModel: "="
                    },
                    template: '<label><input ng-model="ngModel" type="checkbox" style="display:none"><i class="fa" style="display:inline-block;width:1em" ng-class="css"></i> <ng-transclude></ng-transclude></label>',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $ngModel.$render = function () {
                            $scope.css = $ngModel.$viewValue ? 'fa-check-square-o' : 'fa-square-o';
                        }
                    }
                };
            })
            .directive("myRadio", function () {
                return {
                    require: 'ngModel',
                    transclude: true,
                    scope: {
                        ngModel: "=",
                        value: "@",
                        name: "@ngModel"
                    },
                    template: '<label><input type="radio" name="{{name}}" ng-model="ngModel" value="{{value}}" style="display:none"><i class="fa" style="display:inline-block;width:1em" ng-class="css"></i> <ng-transclude></ng-transclude></label>',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $ngModel.$render = function () {
                            $scope.css = $ngModel.$viewValue == $scope.value ? 'fa-check-circle-o' : 'fa-circle-o';
                        }
                    }
                };
            })
            .directive("myImage", function () {
                return {
                    require: 'ngModel',
                    scope: {onupload: "&"},
                    template: '<input type="file" class="form-control">',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $element.on("change", function (event) {
                            var file = event.target.files[0];
                            $scope.onupload({file: file})
                                    .then(function (result) {
                                        $ngModel.$setViewValue(result);
                                    })
                        });
                    }
                };
            })
            .directive("myAddToAlbum", function () {
                return {
                    require: 'ngModel',
                    scope: {onupload: "&"},
                    template: '<input type="file" class="form-control">',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $element.on("change", function (event) {
                            var file = event.target.files[0];
                            $scope.onupload({file: file})
                                    .then(function (result) {
                                        var array = $ngModel.$viewValue || [];
                                        array.push(result);
                                        $ngModel.$setViewValue(array);
                                    })
                        });
                    }
                };
            })
            .directive("myFile", function () {
                return {
                    require: 'ngModel',
                    scope: {onupload: "&"},
                    template: '<input type="file" class="form-control">',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $element.on("change", function (event) {
                            var file = event.target.files[0];
                            $scope.onupload({file: file})
                                    .then(function (result) {
                                        $ngModel.$setViewValue(result);
                                    })
                        });
                    }
                };
            })
            .directive("myDrag", function () {
                return {
                    scope: {
                        onDragStart: "&",
                        onDrag: "&",
                        onDragEnd: "&"
                    },
                    link: function ($scope, $element, $attrs, $ngModel) {
                        $element.on("dragstart", function (event) {
                            $scope.$apply(function () {
                                if ($scope.onDragStart)
                                    $scope.onDragStart({event: event})
                            })
                        });
                        $element.on("dragend", function (event) {
                            $scope.$apply(function () {
                                if ($scope.onDragEnd)
                                    $scope.onDragEnd({event: event})
                            })
                        });
                        $element.on("drag", function (event) {
                            $scope.$apply(function () {
                                if ($scope.onDrag)
                                    $scope.onDrag({event: event})
                            })
                        });
                    }
                };
            })
            .directive("mySearch", function ($timeout) {
                return {
                    require: 'ngModel',
                    scope: {'onsearch': "&", 'onselect': '&'},
                    template: "<input class='form-control' ng-model='query' ng-change='search()'><ul class='dropdown-menu' ng-show='suggestions.length'><li ng-repeat='s in suggestions' ng-click='select(s)'><a>{{s}}</a></li></ul>",
                    link: function ($scope, $element, $attrs, $ngModel) {
                        var timer;
                        $scope.search = function () {
                            $timeout.cancel(timer);
                            timer = $timeout(function () {
                                $scope.onsearch({query: $scope.query})
                                        .then(function (result) {
                                            $scope.suggestions = result;
                                            console.log(result)
                                        })
                            }, 500);
                        }
                        $scope.select = function (item) {
                            $ngModel.$setViewValue(item);
                            $scope.onselect({item: item});
                        }

                    }
                };
            })
            .directive("myArticle", function ($sanitize) {
                return {
                    require: 'ngModel',
                    scope: {onupload: "&"},
                    template: '\
<div class="btn-group">\
<span class="btn btn-default" style="position:relative;display:inline-block;overflow:hidden"><i class="fa fa-image"></i><input type="file" style="position:absolute;top:0;left:0;opacity:0;"/></span>\
</div>\n\
<div class="btn-group">\
<button class="btn btn-default" ng-click="exec(\'bold\')"><i class="fa fa-bold"></i></button>\
<button class="btn btn-default" ng-click="exec(\'italic\')"><i class="fa fa-italic"></i></button>\
<button class="btn btn-default" ng-click="exec(\'underline\')"><i class="fa fa-underline"></i></button>\
</div>\n\
<div class="btn-group">\
<button class="btn btn-default" ng-click="exec(\'createLink\')"><i class="fa fa-link"></i></button>\
<button class="btn btn-default" ng-click="exec(\'unlink\')"><i class="fa fa-unlink"></i></button>\
</div>\
<div class="article form-control" contenteditable="true"></div>',
                    link: function ($scope, $element, $attrs, $ngModel) {
                        var $editor = $element.find("[contenteditable]");
                        $element.on("change", function (event) {
                            var file = event.target.files[0];
                            $scope.onupload({file: file})
                                    .then(function (result) {
                                        document.execCommand("insertHTML", null, "<img src='" + result + "'/>")
                                    })
                        });
                        $ngModel.$render = function () {
                            $editor.html($ngModel.viewValue);
                        }
                        $editor.on("drop", function (event) {
                            if (event.originalEvent.dataTransfer.files[0] && event.originalEvent.dataTransfer.files[0].type.match("image.*")) {
                                var file = event.originalEvent.dataTransfer.files[0];
                                $scope.onupload({file: file})
                                        .then(function (result) {
                                            document.execCommand("insertHTML", null, "<img src='" + result + "'/>")
                                        })
                                event.preventDefault();
                                return false;
                            } else {
                                return true;
                            }
                        });
                        $editor.on("paste", function (event) {
                            if (event.originalEvent.clipboardData.types.indexOf("text/plain") != -1) {
                                $.each(event.originalEvent.clipboardData.items, function (i, item) {
                                    if (item.type == "text/plain") {
                                        console.log(item);
                                        item.getAsString(function (result) {
                                            console.log(result)
                                            document.execCommand("insertHTML", null, $sanitize(result));
                                        });
                                    }
                                })
                            } else if (event.originalEvent.clipboardData.types[0] && event.originalEvent.clipboardData.types[0].match("image.*") != -1) {
                                var file = event.originalEvent.clipboardData.items[0].getAsFile();
                                $scope.onupload({file: file})
                                        .then(function (result) {
                                            document.execCommand("insertHTML", null, "<img src='" + result + "'/>")
                                        })
                            }
                            return false;
                        })
                        $editor.on("input", function () {
                            $ngModel.$setViewValue($editor.html());
                        })
                        $scope.exec = function (cmd) {
                            var value = false;
                            if (cmd == "createLink") {
                                value = document.getSelection();
                                if (!value) {
                                    return false;
                                }
                            }
                            document.execCommand(cmd, null, value);
                        }
                    }
                };
            })
            .directive("myTreeView", function ($compile) {
                return {
                    template: "<i ng-hide='hideSelf' class='fa' ng-class='css'></i><span ng-hide='hideSelf' class='btn btn-link text-muted'>{{node.name}}</span>",
                    scope: {"node": "=", "onClick": "&", 'showChildren': "=", 'hideSelf': "@"},
                    link: function ($scope, $element, $attrs) {


                        console.log($scope.showChildren)
                        $element.on("click", "span", function (event) {
                            return $scope.onClick({$event: event, node: $scope.node})
                        })

                        $element.on("click", "i", function (event) {
                            if ($scope.node.children) {
                                $scope.$apply(function () {
                                    $scope.showChildren = !$scope.showChildren;
                                    $scope.css = !$scope.showChildren ? "fa-plus-square" : "fa-minus-square";
                                })
                            }
                            return false;
                        })

                        if ($scope.node.children) {

                            $scope.css = !$scope.showChildren ? "fa-plus-square" : "fa-minus-square";

                            var el = $("<div ng-show='showChildren'></div>")
                            el.append("<my-tree-view ng-repeat='child in node.children' node='child' on-click='onClick({$event:$event,node:node})'></my-tree-view>")
                            $element.append(el);
                            $compile($element.contents())($scope);
                        } else {
                            $scope.css = "fa-caret-right";
                        }
                    }
                }
            })
            .controller("SampleController", function ($scope, $q) {
                $scope.form = {};
                //test
                $scope.form.album = [
                    "img/064a7a64-52b0-4197-982f-e898d20756a8cover_file.jpg",
                    "img/444cbe01-e781-47d5-92de-65279fe5d7c8cover_file.jpg",
                    "img/63ff5252-4a9d-4c3a-99c5-86028cc05125cover_file.jpg",
                    "img/73286513-a471-4e30-9e22-ddbb0c5f93d3cover_file.jpg",
                    "img/7db9fa56-24b1-4064-a269-25dd7cf630f8cover_file.jpg",
                    "img/aaea220d-aa52-456f-9de2-2d5ffac4ffbecover_file.jpg",
                    "img/b47626a3-940c-432c-bdeb-7915e3aec324cover_file.jpg",
                    "img/ec548a30-fd21-41ef-884c-dd91d754eb9fcover_file.jpg"
                ];
                $scope.form.tree = {
                    name: "root",
                    children: [
                        {name: "level_1"},
                        {name: "level_2", children: [
                                {name: "level_2_1"},
                                {name: "level_2_2", children: [
                                        {name: "level_2_2_1"},
                                        {name: "level_2_2_2"},
                                        {name: "level_2_2_3"}
                                    ]}
                            ]},
                        {name: "level_3", children: [
                                {name: "level_3_1"},
                                {name: "level_3_2"}
                            ]}
                    ]
                }
                ;
                $scope.form.checklist = {a: false, b: false, c: false}
                $scope.onCheckListChange = function (list) {
                    for (var key in list) {
                        if (!list[key]) {
                            delete list[key];
                        }
                    }

                }
                $scope.onSearch = function (query) {
                    console.log("search")
                    console.log(query);
                    var deferred = $q.defer();
                    setTimeout(function () {
                        var data = ["abc", "acd", "aaa"]
                        deferred.resolve(data);
                    }, 200)
                    return deferred.promise;
                }
                $scope.onUploadImage = function (file) {
                    var deferred = $q.defer();
                    if (file) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            deferred.resolve(fileReader.result);
                        }
                    }
                    return deferred.promise;
                }
                $scope.onUploadFile = function (file) {
                    var deferred = $q.defer();
                    if (file) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function () {
                            deferred.resolve(fileReader.result);
                        }
                    }
                    return deferred.promise;
                }
                $scope.onDragPhoto = function (item, list, event) {

                    var ul = $(event.target).parents("ul");
                    var x0 = event.originalEvent.pageX - ul[0].offsetLeft;
                    var y0 = event.originalEvent.pageY - ul[0].offsetTop;
                    var w = $(event.target).parents("ul").width();
                    var h = $(event.target).parents("ul").height();
                    var maxX = Math.floor(w / 170);
                    var maxY = Math.floor(h / 170);
                    var max = $(event.target).parents("ul").find("li").length;
                    var x = Math.ceil(x0 / 170);
                    if (x >= 1)
                        x--;
                    if (x > maxX)
                        x = maxX;
                    var y = Math.floor(y0 / 170);
                    if (y > 1)
                        y--;
                    if (y > maxY)
                        y = maxY;
                    var z = x + y * maxX;
                    if (z > max)
                        z = max;
                    if (z < 0)
                        z = 0;
                    var index = list.indexOf(item);
                    list.splice(index, 1);
                    list.splice(z, 0, item);
                }

                $scope.select = function (item) {
                    console.log(item);
                }
                $scope.onClickTreeNode = function ($event, node) {
                    console.log("click");
                    console.log(node);
                    return false;
                }
            });
}(window.angular, window.jQuery);

