import React, {Component} from 'react';
import * as PropTypes from 'prop-types';
import {mount} from 'enzyme';
import Form, {DEFAULT_TYPES} from '../src/form';
import ReactTestUtils from 'react-dom/test-utils';

describe('Form should', () => {
    let root;

    beforeEach(() => {
        root = document.createElement('div');
        document.body.appendChild(root);
    });

    afterEach(() => {
        document.body.removeChild(root);
    });

    class CustomComponent extends Component {
        static propTypes = {
            customOnBlur: PropTypes.func.isRequired
        };

        static defaultProps = {
            customOnBlur: () => {}
        };

        state = {};

        onBlur = () => {
            this.setState({
                value: 'staticValue'
            }, () => {
                this.props.customOnBlur('randomArg', this.state.value, 'randomArg');
            });
        };

        render() {
            return (
                <p contentEditable="true"
                    onBlur={this.onBlur}
                ></p>
            );
        }
    }

    const customComponentTypes = {
        ...DEFAULT_TYPES,
        [CustomComponent]: {
            idProperty: 'customIdProp',
            onBlurProperty: 'customOnBlur',
            valueExtractor: (randomArg1, value) => value
        }
    };

    it('call onValidate when an onBlur event is triggered on a direct child', done => {
        mount(
            <Form onValidate={() => done()}>
                <input id="text" type="text" onBlur={() => {}}/>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text');
        ReactTestUtils.Simulate.blur(input, {target: {value: ''}});
    });

    it('call onValidate when an onBlur event is triggered on an element somewhere in the element tree', done => {
        mount(
            <Form onValidate={() => done()}>
                <div>
                    <div>
                        <input id="text" type="text" onBlur={() => {}}/>
                    </div>
                </div>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text');
        ReactTestUtils.Simulate.blur(input, {target: {value: ''}});
    });

    it('call onValidate when an onBlur event is triggered on one element of many', done => {
        mount(
            <Form onValidate={() => done()}>
                <input id="text1" type="text" onBlur={() => {}}/>
                <input id="text2" type="text" onBlur={() => {}}/>
                <input id="text3" type="text" onBlur={() => {}}/>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text2');
        ReactTestUtils.Simulate.blur(input, {target: {value: ''}});
    });

    it('call onValidate with information about all elements on which onBlur has been triggered', done => {
        const onValidate = (fieldName, fieldValue, allFieldValues) => {
            const fieldNames = Object.keys(allFieldValues);
            if (fieldNames.length === 3) {
                expect(allFieldValues.text1).toEqual('value1');
                expect(allFieldValues.text2).toEqual('value2');
                expect(allFieldValues.text3).toEqual('value3');
                done();
            }
        };
        mount(
            <Form onValidate={onValidate}>
                <input id="text1" type="text" onBlur={() => {}}/>
                <input id="text2" type="text" onBlur={() => {}}/>
                <input id="text3" type="text" onBlur={() => {}}/>
            </Form>,
            {attachTo: root});

        const input1 = document.getElementById('text1');
        ReactTestUtils.Simulate.blur(input1, {target: {value: 'value1'}});
        const input2 = document.getElementById('text2');
        ReactTestUtils.Simulate.blur(input2, {target: {value: 'value2'}});
        const input3 = document.getElementById('text3');
        ReactTestUtils.Simulate.blur(input3, {target: {value: 'value3'}});
    });

    it('call onValidate with value from custom component', done => {
        const onValidate = (fieldName, fieldValue, allFieldValues) => {
            expect(fieldValue).toEqual('staticValue');
            done();
        };

        mount(
            <Form types={customComponentTypes} onValidate={onValidate}>
                <CustomComponent customIdProp="text" customonBlur={() => {}}/>
            </Form>,
            {attachTo: root});

        const input = document.getElementsByTagName('p')[0];
        ReactTestUtils.Simulate.blur(input);
    });

    it('forget previously touched elements when remounted', done => {
        const onValidate = (fieldName, fieldValue, allFieldValues) => {
            if (fieldValue === 'value2') {
                expect(allFieldValues.text1).not.toBeDefined();
                done();
            }
        };

        const wrapper = mount(
            <Form onValidate={onValidate}>
                <input id="text1" type="text" onBlur={() => {}}/>
                <input id="text2" type="text" onBlur={() => {}}/>
            </Form>,
            {attachTo: root});

        const input1 = document.getElementById('text1');
        ReactTestUtils.Simulate.blur(input1, {target: {value: 'value1'}});

        wrapper.unmount();
        wrapper.mount();

        const input2 = document.getElementById('text2');
        ReactTestUtils.Simulate.blur(input2, {target: {value: 'value2'}});
    });
});