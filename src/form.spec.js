import React, {Component} from 'react';
import {mount} from 'enzyme';
import Form, {DEFAULT_TYPES} from './form';
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
        state = {};

        onChange = () => {
            this.setState({
                value: 'staticValue'
            }, () => {
                this.props.customOnChange('randomArg', this.state.value, 'randomArg');
            });
        };

        render() {
            return (
                <p contentEditable="true"
                    onBlur={this.onChange}
                    onKeyUp={this.onChange}
                    onPaste={this.onChange}
                    onCopy={this.onChange}
                    onCut={this.onChange}
                    onMouseUp={this.onChange}
                ></p>
            );
        }
    }

    const customComponentTypes = {
        ...DEFAULT_TYPES,
        [CustomComponent]: {
            idProperty: 'customIdProp',
            onChangeProperty: 'customOnChange',
            valueExtractor: (randomArg1, value) => value
        }
    };

    it('call onValidate when an onChange event is triggered on a direct child', done => {
        mount(
            <Form onValidate={() => done()}>
                <input id="text" type="text" onChange={() => {}}/>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text');
        ReactTestUtils.Simulate.change(input, {target: {value: ''}});
    });

    it('call onValidate when an onChange event is triggered on an element somewhere in the element tree', done => {
        mount(
            <Form onValidate={() => done()}>
                <div>
                    <div>
                        <input id="text" type="text" onChange={() => {}}/>
                    </div>
                </div>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text');
        ReactTestUtils.Simulate.change(input, {target: {value: ''}});
    });

    it('call onValidate when an onChange event is triggered on one element of many', done => {
        mount(
            <Form onValidate={() => done()}>
                <input id="text1" type="text" onChange={() => {}}/>
                <input id="text2" type="text" onChange={() => {}}/>
                <input id="text3" type="text" onChange={() => {}}/>
            </Form>,
            {attachTo: root});

        const input = document.getElementById('text2');
        ReactTestUtils.Simulate.change(input, {target: {value: ''}});
    });

    it('call onValidate with information about all elements on which onChange has been triggered', done => {
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
                <input id="text1" type="text" onChange={() => {}}/>
                <input id="text2" type="text" onChange={() => {}}/>
                <input id="text3" type="text" onChange={() => {}}/>
            </Form>,
            {attachTo: root});

        const input1 = document.getElementById('text1');
        ReactTestUtils.Simulate.change(input1, {target: {value: 'value1'}});
        const input2 = document.getElementById('text2');
        ReactTestUtils.Simulate.change(input2, {target: {value: 'value2'}});
        const input3 = document.getElementById('text3');
        ReactTestUtils.Simulate.change(input3, {target: {value: 'value3'}});
    });

    it('call onValidate with value from custom component', done => {
        const onValidate = (fieldName, fieldValue, allFieldValues) => {
            expect(fieldValue).toEqual('staticValue');
            done();
        };

        mount(
            <Form types={customComponentTypes} onValidate={onValidate}>
                <CustomComponent customIdProp="text" customOnChange={() => {}}/>
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
                <input id="text1" type="text" onChange={() => {}}/>
                <input id="text2" type="text" onChange={() => {}}/>
            </Form>,
            {attachTo: root});

        const input1 = document.getElementById('text1');
        ReactTestUtils.Simulate.change(input1, {target: {value: 'value1'}});

        wrapper.unmount();
        wrapper.mount();

        const input2 = document.getElementById('text2');
        ReactTestUtils.Simulate.change(input2, {target: {value: 'value2'}});
    });
});