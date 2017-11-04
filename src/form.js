import React, {Component} from 'react';

export const DEFAULT_TYPE_DEFINITION = {
    idProperty: 'id',
    onChangeProperty: 'onChange',
    valueExtractor: e => e.target.value
};

export const DEFAULT_TYPES = {
    'input': DEFAULT_TYPE_DEFINITION,
    'select': DEFAULT_TYPE_DEFINITION,
    'textarea': DEFAULT_TYPE_DEFINITION
};

export default class Form extends Component {
    static defaultProps = {
        onValidate: () => {},
        types: DEFAULT_TYPES
    };

    state = {
        touched: {}
    };

    onChange = (child, args) => {
        const {idProperty, valueExtractor} = this.props.types[child.type];
        const id = child.props[idProperty];
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

    createChangeHandler(child, callback) {
        return (function () {
            if (callback) {
                this.onChange(child, Array.prototype.slice.call(arguments));

                return callback(...arguments);
            }
        }).bind(this);
    }

    renderWrappedChildren(children) {
        return React.Children.map(children, (child) => {
            if (!child.props) {
                return child;
            }

            const {onChangeProperty} = this.props.types[child.type] || {onChangeProperty: 'onChange'};

            if (child.props.children) {
                return React.cloneElement(child, {
                    children: this.renderWrappedChildren(child.props.children),
                    [onChangeProperty]: this.createChangeHandler(child, child.props[onChangeProperty])
                });
            }

            return React.cloneElement(child, {
                [onChangeProperty]: this.createChangeHandler(child, child.props[onChangeProperty])
            });
        }
        )
    }

    render() {
        return this.renderWrappedChildren(this.props.children);
    }
}