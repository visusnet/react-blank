'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_TYPES = exports.DEFAULT_TYPE_DEFINITION = exports.MINIMAL_TYPE_DEFINITION = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MINIMAL_TYPE_DEFINITION = exports.MINIMAL_TYPE_DEFINITION = {
    idProperty: 'id'
};

var DEFAULT_TYPE_DEFINITION = exports.DEFAULT_TYPE_DEFINITION = _extends({}, MINIMAL_TYPE_DEFINITION, {
    onBlurProperty: 'onBlur',
    valueExtractor: function valueExtractor(e) {
        return e.target.value;
    }
});

var DEFAULT_TYPES = exports.DEFAULT_TYPES = {
    'input': DEFAULT_TYPE_DEFINITION,
    'select': DEFAULT_TYPE_DEFINITION,
    'textarea': DEFAULT_TYPE_DEFINITION,
    'button': MINIMAL_TYPE_DEFINITION
};

var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Form);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Form, [{
        key: 'createBlurHandler',
        value: function createBlurHandler(child, callback) {
            return function () {
                this.onBlur(child, Array.prototype.slice.call(arguments));

                if (callback) {
                    return callback.apply(undefined, arguments);
                }
            }.bind(this);
        }
    }, {
        key: 'renderWrappedChildren',
        value: function renderWrappedChildren(children) {
            var _this2 = this;

            return _react2.default.Children.map(children, function (child) {
                var _React$cloneElement2;

                if (!child.props) {
                    return child;
                }

                var onBlurProperty = _this2.getOnBlurProperty(child);

                if (child.props.children) {
                    var _React$cloneElement;

                    return _react2.default.cloneElement(child, (_React$cloneElement = {
                        children: _this2.renderWrappedChildren(child.props.children)
                    }, _defineProperty(_React$cloneElement, onBlurProperty, _this2.createBlurHandler(child, child.props[onBlurProperty])), _defineProperty(_React$cloneElement, 'data-focus-id', _this2.getElementId(child)), _React$cloneElement));
                }

                return _react2.default.cloneElement(child, (_React$cloneElement2 = {}, _defineProperty(_React$cloneElement2, onBlurProperty, _this2.createBlurHandler(child, child.props[onBlurProperty])), _defineProperty(_React$cloneElement2, 'data-focus-id', _this2.getElementId(child)), _React$cloneElement2));
            });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.focusChild(this.state.activeElement);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._wrapper.addEventListener('focusin', this.onFocusIn);
            this._wrapper.addEventListener('focusout', this.onFocusOut);

            this.setState({
                activeElement: this.props.initialActiveElement
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._wrapper.removeEventListener('focusin', this.onFocusIn);
            this._wrapper.removeEventListener('focusout', this.onFocusOut);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                { tabIndex: 0, ref: function ref(wrapper) {
                        return _this3._wrapper = wrapper;
                    } },
                this.renderWrappedChildren(this.props.children)
            );
        }
    }]);

    return Form;
}(_react.Component);

Form.propTypes = {
    initialActiveElement: PropTypes.string,
    onValidate: PropTypes.func.isRequired,
    onLeaveField: PropTypes.func.isRequired,
    types: PropTypes.any.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};
Form.defaultProps = {
    initialActiveElement: undefined,
    onValidate: function onValidate() {},
    onLeaveField: function onLeaveField() {},
    types: DEFAULT_TYPES
};

var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.state = {
        touched: {},
        activeElement: undefined,
        shouldTrap: false
    };

    this.getElementId = function (child) {
        return child.props[_this4.getIdProperty(child)];
    };

    this.getValueExtractor = function (child) {
        var emptyValueExtractor = function emptyValueExtractor() {
            return undefined;
        };
        return _this4.props.types[child.type] && _this4.props.types[child.type].valueExtractor || emptyValueExtractor;
    };

    this.getIdProperty = function (child) {
        return _this4.props.types[child.type] && _this4.props.types[child.type].idProperty || 'id';
    };

    this.getOnBlurProperty = function (child) {
        return _this4.props.types[child.type] && _this4.props.types[child.type].onBlurProperty || 'onBlur';
    };

    this.onBlur = function (child, args) {
        var valueExtractor = _this4.getValueExtractor(child);
        var id = _this4.getElementId(child);
        if (id) {
            var value = valueExtractor ? valueExtractor.apply(undefined, _toConsumableArray(args)) : args;
            _this4.triggerOnValidate(id, value);
        }
    };

    this.triggerOnValidate = function (id, value) {
        _this4.setState({
            touched: _extends({}, _this4.state.touched, _defineProperty({}, id, value))
        }, function () {
            _this4.props.onValidate(id, value, _this4.state.touched);
        });
    };

    this.closest = function (element, selector) {
        if (!element) {
            return null;
        } else if (element.matches(selector)) {
            return element;
        }
        return _this4.closest(element.parentElement, selector);
    };

    this.focusChild = function (focusId) {
        if (focusId) {
            var focussedElement = _this4._wrapper.querySelector('[data-focus-id=' + focusId + ']');
            if (focussedElement) {
                focussedElement.focus();

                if (!_this4.state.shouldTrap) {
                    _this4.setState({
                        activeElement: undefined
                    });
                }
            } else {
                console.warn('Tried to focus element with ID ' + focusId + ' but did not find any.');
            }
        }
    };

    this.onFocusIn = function (event) {
        var focussableElement = _this4.closest(event.target, '[data-focus-id]');

        if (focussableElement) {
            var activeElement = focussableElement.getAttribute('data-focus-id');
            if (activeElement && _this4.state.activeElement && activeElement !== _this4.state.activeElement) {
                _this4.focusChild(_this4.state.activeElement);
            }
        }
    };

    this.onFocusOut = function (event) {
        var focussableElement = _this4.closest(event.target, '[data-focus-id]');
        if (focussableElement) {
            var previouslyActiveElement = focussableElement.getAttribute('data-focus-id');

            _this4.props.onLeaveField(previouslyActiveElement, _this4.getFocusManager(), _this4.state.touched);
        }
    };

    this.getFocusManager = function () {
        return {
            focus: function focus(activeElement) {
                _this4.setState({
                    activeElement: activeElement,
                    shouldTrap: false
                });
            },

            trap: function trap(activeElement) {
                _this4.setState({
                    activeElement: activeElement,
                    shouldTrap: true
                });
            },

            untrap: function untrap() {
                _this4.setState({
                    activeElement: undefined,
                    shouldTrap: false
                });
            },

            isFocussed: function isFocussed(element) {
                var querySelector = document.body.querySelector('[data-focus-id="' + element + '"');
                return querySelector === document.activeElement;
            },

            getFocussedElement: function getFocussedElement() {
                return _this4.state.activeElement;
            }
        };
    };
};

exports.default = Form;