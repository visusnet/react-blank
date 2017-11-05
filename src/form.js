import React, {Component} from 'react';
import * as PropTypes from 'prop-types';

export const MINIMAL_TYPE_DEFINITION = {
    idProperty: 'id'
};

export const DEFAULT_TYPE_DEFINITION = {
    ...MINIMAL_TYPE_DEFINITION,
    onBlurProperty: 'onBlur',
    valueExtractor: e => e.target.value
};

export const DEFAULT_TYPES = {
    'input': DEFAULT_TYPE_DEFINITION,
    'select': DEFAULT_TYPE_DEFINITION,
    'textarea': DEFAULT_TYPE_DEFINITION,
    'button': MINIMAL_TYPE_DEFINITION
};

export default class Form extends Component {
    static propTypes = {
        initialActiveElement: PropTypes.string,
        onValidate: PropTypes.func.isRequired,
        onLeaveField: PropTypes.func.isRequired,
        types: PropTypes.any.isRequired,
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
    };

    static defaultProps = {
        initialActiveElement: undefined,
        onValidate: () => {},
        onLeaveField: () => {},
        types: DEFAULT_TYPES
    };

    state = {
        touched: {},
        activeElement: undefined,
        shouldTrap: false
    };

    getElementId = child => {
        return child.props[this.getIdProperty(child)];
    };

    getValueExtractor = child => {
        const emptyValueExtractor = () => undefined;
        return this.props.types[child.type] && this.props.types[child.type].valueExtractor || emptyValueExtractor;
    };

    getIdProperty = child => {
        return this.props.types[child.type] && this.props.types[child.type].idProperty || 'id';
    };

    getOnBlurProperty = child => {
        return this.props.types[child.type] && this.props.types[child.type].onBlurProperty || 'onBlur';
    };

    onBlur = (child, args) => {
        const valueExtractor = this.getValueExtractor(child);
        const id = this.getElementId(child);
        if (id) {
            const value = valueExtractor ? valueExtractor(...args) : args;
            this.triggerOnValidate(id, value);
        }
    };

    triggerOnValidate = (id, value) => {
        this.setState({
            touched: {
                ...this.state.touched,
                [id]: value
            }
        }, () => {
            this.props.onValidate(id, value, this.state.touched);
        });
    };

    createBlurHandler(child, callback) {
        return (function () {
            this.onBlur(child, Array.prototype.slice.call(arguments));

            if (callback) {
                return callback(...arguments);
            }
        }).bind(this);
    }

    renderWrappedChildren(children) {
        return React.Children.map(children, (child) => {
            if (!child.props) {
                return child;
            }

            const onBlurProperty = this.getOnBlurProperty(child);

            if (child.props.children) {
                return React.cloneElement(child, {
                    children: this.renderWrappedChildren(child.props.children),
                    [onBlurProperty]: this.createBlurHandler(child, child.props[onBlurProperty]),
                    'data-focus-id': this.getElementId(child)
                });
            }

            return React.cloneElement(child, {
                [onBlurProperty]: this.createBlurHandler(child, child.props[onBlurProperty]),
                'data-focus-id': this.getElementId(child)
            });
        });
    }

    closest = (element, selector) => {
        if (!element) {
            return null;
        } else if (element.matches(selector)) {
            return element;
        }
        return this.closest(element.parentElement, selector);
    };

    focusChild = (focusId) => {
        if (focusId) {
            const focussedElement = this._wrapper.querySelector(`[data-focus-id=${focusId}]`);
            if (focussedElement) {
                focussedElement.focus();

                if (!this.state.shouldTrap) {
                    this.setState({
                        activeElement: undefined
                    });
                }
            } else {
                console.warn(`Tried to focus element with ID ${focusId} but did not find any.`);
            }
        }
    };

    onFocusIn = event => {
        const focussableElement = this.closest(event.target, '[data-focus-id]');

        if (focussableElement) {
            const activeElement = focussableElement.getAttribute('data-focus-id');
            if (activeElement && this.state.activeElement && activeElement !== this.state.activeElement) {
                this.focusChild(this.state.activeElement);
            }
        }
    };

    onFocusOut = event => {
        const focussableElement = this.closest(event.target, '[data-focus-id]');
        if (focussableElement) {
            const previouslyActiveElement = focussableElement.getAttribute('data-focus-id');

            this.props.onLeaveField(previouslyActiveElement, this.getFocusManager(), this.state.touched);
        }
    };

    getFocusManager = () => {
        return {
            focus: activeElement => {
                this.setState({
                    activeElement,
                    shouldTrap: false
                });
            },

            trap: activeElement => {
                this.setState({
                    activeElement,
                    shouldTrap: true
                });
            },

            untrap: () => {
                this.setState({
                    activeElement: undefined,
                    shouldTrap: false
                });
            },

            isFocussed: element => {
                const querySelector = document.body.querySelector(`[data-focus-id="${element}"`);
                return querySelector === document.activeElement;
            },

            getFocussedElement: () => this.state.activeElement
        }
    };

    componentDidUpdate() {
        this.focusChild(this.state.activeElement);
    }

    componentDidMount() {
        this._wrapper.addEventListener('focusin', this.onFocusIn);
        this._wrapper.addEventListener('focusout', this.onFocusOut);

        this.setState({
            activeElement: this.props.initialActiveElement
        });
    }

    componentWillUnmount() {
        this._wrapper.removeEventListener('focusin', this.onFocusIn);
        this._wrapper.removeEventListener('focusout', this.onFocusOut);
    }

    render() {
        return (
            <div tabIndex={0} ref={wrapper => this._wrapper = wrapper}>
                {this.renderWrappedChildren(this.props.children)}
            </div>
        );
    }
}